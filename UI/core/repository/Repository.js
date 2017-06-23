import {Check, Record, Field, RecordConfig, Utils, If, Debug, Type, AppEvent} from "../core";

import Permission from "../application/Permission";
import RepositoryStorage from "./RepositoryStorage";
import Action from "./Action";
import Dispatcher from "../utils/Dispatcher";
import WebApiRepositoryStorage from "../webapi/WebApiRepositoryStorage";
import {FieldConfig} from "./Field";

export class RepositoryMode {
    static LOCAL: RepositoryMode = new RepositoryMode();
    static REMOTE: RepositoryMode = new RepositoryMode();
    static SYNCHRONIZED: RepositoryMode = new RepositoryMode();
}

//ToDo: Opcja inline - edycja rekordów podobnie jak w uprawnieniach


export class RepoConfig {
    static defaultCrudeRights = "CRUD"; //"CRUDE"

    key: ?string = null;
    name: ?string = null;
    primaryKeyColumn: ?string | ?Field = null;
    displayNameColumn: ?string | ?Field = null;

    recordClass: ?any = null;
    crude: string = RepoConfig.defaultCrudeRights;
    readOnly: boolean = false;
    autoUpdate: boolean = false;
    local: ?boolean = null;

    constructor() {
        Object.preventExtensions(this);
    }
}

export default class Repository {

    static externalStore: ?WebApiRepositoryStorage;

    static all = {};
    static onChange: Dispatcher = new Dispatcher();

    config: RepoConfig = new RepoConfig();
    key: string;
    name: string;
    crude: string;

    items: Record[] = [];
    mode: RepositoryMode = RepositoryMode.LOCAL;
    _recordClass: any;

    permission: ?Permission;
    columns: Field[] = [];
    primaryKeyColumn: Field;
    storage: RepositoryStorage = new RepositoryStorage(this);
    /** Czy dane repozytorium zostały już wczytane */
    isReady: boolean = false;
    /** Repozytorium lokalne, nie podlega synchronizacji */
    isLocal: boolean = false;
    /** Czy repozytorium ma być automatycznie synchronizowane z serwerem */
    autoUpdate: boolean = true;

    /** Data ostatniej aktualizacji */
    lastUpdated: Date;
    /** Autor ostatniej aktualizacji */
    lastUpdatedBy: string;
    /* Ilość aktualizacji (numer bieżącej wersji)*/
    updates: Number = 0;


    constructor(config: (cfg: RepoConfig) => void) {

        Check.isFunction(config);
        config(this.config);

        Check.id(this.config.key);

        Utils.setReadOnly(this, "key", this.config.key);
        this.name = Check.nonEmptyString(this.config.name);
        this.crude = this.config.crude;
        this._recordClass = this.config.recordClass;

        this.permission = Permission.all["repo-" + this.key]
            || new Permission(this, "repo-" + this.key, `Repozytorium "${name}"`, Repository.defaultCrudeRights);

        for (let name in this.config)
            Object.defineProperty(this.config, name, {
                value: this.config[name],
                writable: false
            });

        // utwórz tymczasowo jeden rekord i pobierz z niego listę pól a następnie listę kolumn.
        const rec: Record = this.newRecord();


        rec.fields.forEach((src: Field) => {
            const f: Field = new Field((fc: FieldConfig) => {
                for (let name in fc)
                    fc[name] = src[name];
            });
            if (f.key === this.config.primaryKeyColumn)
                this.primaryKeyColumn = f;
            this.columns.push(f);
        });

        if (!this.primaryKeyColumn)
            throw new Error("Brak definicji klucza głównego");
    }

    static getF(key: string): Repository {
        const result = Repository.all[key];
        if (!result)
            throw new Error("Nie znaleziono repozytorium " + JSON.stringify(key));
        return result;
    }

    static register(repository: Repository) {
        if (Repository.all[repository.key])
            throw new Error(`Repozytorium ${repository.key} już istnieje`);
        Repository.all[repository.key] = repository;
        AppEvent.REPOSITORY_REGISTERED.send(this, repository);
        return repository;
    }


    getF(key: string | number): Record {
        const result = this.get(key);
        if (result)
            return result;
        throw new Error(`Nie znaleziono rekordu ${this.key}.${key}`);
    }

    get(key: string | number): ?Record {
        key = this.primaryKeyColumn.type.parse(key);
        return this.items.find((record: Record) => record._primaryKeyValue === key);
    }

    /**
     * Zaktualizuj rekordy (lub dodaj nowe)
     */
    _update(context: any, records: Record[], canSave: boolean = false): Record[] {

        Check.instanceOf(records, [Array]);
        if (!records || !records.length)
            return;

        records.forEach((record: Record) => {
            if (record.repository !== this)
                throw new Error(`Konflikt repozytoriów: ${record.repository.key} <-> ${this.key}`);
        });

        const result: Record[] = [];

        records.forEach((record: Record) => {
            let dst: Record = this.get(record._primaryKeyValue);
            let act: Action = dst ? Action.UPDATE : Action.CREATE;
            if (!dst)
                dst = this.newRecord();

            dst._temporary = false;
            dst.fields.forEach((f: Field) => f._locked = true);
            dst._update(context, act, record);
            result.push(dst);

            if (act === Action.CREATE)
                this.items.push(dst);
        });

        if (canSave)
            this.storage.save();

        return result;
    }


    /**
     * Zastosuj zmiany (edycja / synchronizacja)
     */
    static submit(context: any, records: Record[], dtoCallback: ?(dto: {}) => void): Promise {
        Check.instanceOf(records, [Array]);

        records.forEach((item: Record) => {
            if (!item._action)
                throw new Error(item.getFullId() + ": Brak przypisanej akcji CRUDE");
        });

        if (Repository.externalStore)
            return Repository.externalStore.submit(context, records);

        return new Promise((resolve, reject) => {
            Repository.update(context, records);
            resolve(dto);
        });

    }

    /** Zaktualizuj rekordy z obiektu DTO lub z listy rekordów */
    static update(context: any, data: Object | Record[]): Map<Repository, Record[]> {
        if (!data)
            return;

        const updatedRecords: Record[] = [];

        Utils.forEach(data, (data: Object, key: string) => {
            if (data instanceof Record) {
                updatedRecords.push(data);
                return;
            }
            const repo: Repository = Repository.getF(key);
            const records: Record[] = processUpdate(context, data, repo);
            updatedRecords.addAll(records);
            if (!records.length)
                repo.isReady = true;
        });

        const map: Map<Repository, Record[]> = Utils.agregate(updatedRecords, (rec: Record) => rec.repository);
        const allUpdated: Record[] = [];

        map.forEach((records: Record[], repo: Repository) => {
            const updated = repo._update(context, records, false);
            records.clear();
            records.addAll(updated);
            allUpdated.addAll(updated);
            repo.isReady = true;
        });

        Repository.onChange.dispatch(context, map, allUpdated);
        return map;
    }

    newRecord(): Record {
        const result: Record = new this._recordClass(this, (rc: RecordConfig) => {
            rc.primaryKey = this.primaryKeyColumn;
        });
        result.init();
        result._isNew = true;
        return result;
    }

}

function processUpdate(context: any, data: Object, repo: Repository): Record[] {

    const recs: Record[] = [];

    if (data.rows instanceof Array) {

        repo.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : new Date();
        repo.lastUpdatedBy = data.lastUpdatedBy;
        repo.updates = data.updates ? data.updates : repo.updates + 1;

        data.rows.forEach((rowData: {} | []) => {

            if (rowData instanceof Array) {
                const rec: Record = repo.newRecord();
                for (let i = 0; i < rowData.length; i++) {
                    const col = data.columns[i];
                    const field: Field = rec.getFieldF(If.isString(col) ? col : col.key);
                    field.value = rowData[i];
                }
                recs.push(rec);
                return;
            }

            let pk = rowData[repo.primaryKeyColumn.key];
            if (!If.isDefined(pk))
                throw new Error("Brak klucza głównego");


            let r: Record = repo.get(pk);
            r = r ? r.beginEdit(this) : repo.newRecord();

            r.fields.forEach((field: Field) => {
                if (rowData[field.key] === undefined)
                    return;
                field.value = rowData[field.key];
            });
            recs.push(r);
            if (r._sourceRecord)
                r.cancelEdit();
            return;

        });

        return recs;
    }


    // wariant obiektowy (kluczem obiektu jest klucz pola)
    Utils.forEach(data, (repoData: Object, key: string) => {

        const pk = repo.primaryKeyColumn.type.parse(key);

        let rec: Record = repo.get(pk);

        rec = rec ? rec.beginEdit() : repo.newRecord();

        for (let fieldName in repoData) {
            const fieldData = repoData[fieldName];

            const field = rec.fields.find(field => field.key === fieldName);
            if (!field) {
                Debug.warning("Nie znaleziono pola " + JSON.stringify(fieldName));
                continue;
            }

            let value = field.value;

            if (value instanceof Repository) {
                processUpdate(context, fieldData, value);
                continue;
            }

            field.value = fieldData;
        }

        recs.push(rec);

    });

    return recs;
}

export class Change {
    field: Field;
    from: any;
    to: any;
}

