//FixMe importy, flow

import {Check, Record, Field, Utils, If, Debug, DataType} from "../core";

import Permission from "../application/Permission";
import RepositoryStorage from "./RepositoryStorage";
import Action from "./Action";
import Dispatcher from "../utils/Dispatcher";
import WebApiRepositoryStorage from "../webapi/WebApiRepositoryStorage";


export class RepositoryMode {
    static LOCAL: RepositoryMode = new RepositoryMode();
    static REMOTE: RepositoryMode = new RepositoryMode();
    static SYNCHRONIZED: RepositoryMode = new RepositoryMode();
}


export default class Repository {

    static externalStore: ?WebApiRepositoryStorage;

    static defaultCrudeRights = "CRUD"; //"CRUDE"

    static all = {};
    static onChange: Dispatcher = new Dispatcher();

    id: string;
    name: string;
    items: Record[] = [];
    mode: RepositoryMode = RepositoryMode.LOCAL;
    _recordClass: any;
    primaryKeyDataType: DataType;
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

    constructor(id: string, name: string, primaryKeyDataType: DataType, recordClass: () => Record) {
        this.id = id;
        this.primaryKeyDataType = primaryKeyDataType;
        this.name = name;
        this._recordClass = recordClass;

        this.permission = Permission.all["repo-" + id]
            || new Permission(this, "repo-" + id, `Repozytorium "${name}"`, Repository.defaultCrudeRights);

        // utwórz tymczasowo jeden rekord i pobierz z niego listę pól a następnie listę kolumn.
        const rec: Record = this.newRecord();

        rec.fields.forEach((src: Field) => {
            const f: Field = new Field(src.type);

            for (let name in src)
                f[name] = src[name];

            if (src === rec.primaryKey)
                this.primaryKeyColumn = f;
            this.columns.push(f);
        });

    }

    static getF(key: string): Repository {
        const result = Repository.all[key];
        if (!result)
            throw new Error("Nie znaleziono repozytorium " + JSON.stringify(key));
        return result;
    }

    static register(repository: Repository) {
        if (Repository.all[repository.id])
            throw new Error(`Repozytorium ${repository.id} już istnieje`);
        Repository.all[repository.id] = repository;
        return repository;
    }


    getF(key: string | number): Record {
        const result = this.get(key);
        if (result)
            return result;
        throw new Error(`Nie znaleziono rekordu ${this.id}.${key}`);
    }

    get(key: string | number): ?Record {
        key = this.primaryKeyDataType.parse(key);
        return this.items.find((record: Record) => record._primaryKeyValue === key);
    }

    /**
     * Zaktualizuj rekordy (lub dodaj nowe)
     */
    _update(context: any, records: Record[], canSave: boolean = false): Record[] {

        Check.instanceOf(records, [Array]);
        if (!records || !records.length)
            return

        records.forEach((record: Record) => {
            if (record.repository !== this)
                throw new Error(`Konflikt repozytoriów: ${record.repository.id} <-> ${this.id}`);
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
            updatedRecords.addAll(processUpdate(context, data, repo));
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
        const result: Record = new this._recordClass(this);
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
                    const field: Field = rec.getFieldF(data.columns[i].key);
                    field.set(rowData[i]);
                }
                recs.push(rec);
                return;
            }

            let pk = rowData[repo.primaryKeyColumn._name];
            if (!If.isDefined(pk))
                throw new Error("Brak klucza głównego");


            let r: Record = repo.get(pk);
            r = r ? r.beginEdit(this) : repo.newRecord();

            r.fields.forEach((field: Field) => {
                if (rowData[field._name] === undefined)
                    return;
                field.set(rowData[field._name]);
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

        const pk = repo.primaryKeyDataType.parse(key);

        let rec: Record = repo.get(pk);

        rec = rec ? rec.beginEdit() : repo.newRecord();

        for (let fieldName in repoData) {
            const fieldData = repoData[fieldName];

            const field = rec.fields.find(field => field._name.toLowerCase() === fieldName.toLowerCase());
            if (!field) {
                Debug.warning("Nie znaleziono pola " + JSON.stringify(fieldName));
                continue;
            }

            let value = field.get();

            if (value instanceof Repository) {
                processUpdate(context, fieldData, value);
                continue;
            }

            field.set(fieldData);
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

