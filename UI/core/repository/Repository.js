//FixMe importy, flow

import {Check, Record, Field, Utils, Debug, DataType} from "../core";

import Permission from "../application/Permission";
import RepositoryStorage from "./RepositoryStorage";
import Action from "./Action";


export class RepositoryMode {
    static LOCAL: RepositoryMode = new RepositoryMode();
    static REMOTE: RepositoryMode = new RepositoryMode();
    static SYNCHRONIZED: RepositoryMode = new RepositoryMode();
}

export const DATA_TYPE = new DataType("Repository", "object", val => Check.instanceOf(val, [Repository]));

export default class Repository {

    static defaultCrudeRights = "CRUD"; //"CRUDE"

    static all = {};

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

    constructor(id: string, name: string, primaryKeyDataType: DataType, recordClass: () => Record) {
        this.id = id;
        this.primaryKeyDataType = primaryKeyDataType;
        this.name = name;
        this._recordClass = recordClass;

        this.permission = Permission.all["repo." + id]
            || new Permission(this, "repo." + id, `Repozytorium "${name}"`, Repository.defaultCrudeRights);

        // utwórz tymczasowo jeden rekord i pobierz z niego listę pól a następnie listę kolumn.
        const rec: Record = this.newRecord();

        rec.fields.forEach((src: Field) => {
            const f: Field = new Field(src.dataType);

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
    update(context: any, records: Record[], canSave: boolean = true) {

        Check.instanceOf(records, [Array]);
        if (!records || !records.length)
            return

        records.forEach((record: Record) => {
            if (record.repository !== this)
                throw new Error(`Konflikt repozytoriów: ${record.repository.id} <-> ${this.id}`);
        });

        records.forEach((record: Record) => {
            let dst: Record = this.get(record._primaryKeyValue);
            let act: Action = dst ? Action.UPDATE : Action.CREATE;
            if (!dst)
                dst = this.newRecord();

            dst._temporary = false;
            dst.fields.forEach((f: Field) => f._locked = true);
            dst._update(context, act, record);

            if (act === Action.CREATE)
                this.items.push(dst);
        });

        if (canSave)
            this.storage.save();
    }


    /**
     * Zastosuj zmiany (edycja / synchronizacja)
     */
    static submit(context: any, items: Record[]): Promise {

        Check.instanceOf(items, [Array]);

        const upd = {};

        // utwórz grupy repozytorium - lista rekordów
        items.forEach((rec: Record) => {
            let arr = upd[rec.repository.id];
            arr = arr ? arr[1] : [];
            arr.push(rec);
            upd[rec.repository.id] = [rec.repository, arr];
        });

        const result: Promise[] = [];

        for (let name in upd) {
            const repo: Repository = upd[name][0];
            if (!repo.storage.write)
                continue;

            const modified: Record[] = upd[name][1];
            result.push(repo.update(context, modified));
        }

        return Promise.all(result);
    }

    static processDTO(context: any, data: Object): Promise {
        if (!data)
            return;
        const recs: Record[] = [];

        Utils.forEach(data, (data: Object, key: string) => {
            const repo: Repository = Repository.getF(key);
            recs.addAll(visitRepository(context, data, repo));
        });

        return Repository.submit(context, recs);
    }

    newRecord(): Record {
        const result: Record = new this._recordClass(this);
        result.init();
        return result;
    }

}


function visitRepository(context: any, data: Object, repo: Repository): Record[] {

    const recs: Record[] = [];

    if (data.key && data.pk && data.columns && data.rows) {

        data.rows.forEach((rowData: []) => {
            const rec = repo.newRecord();
            for (let i = 0; i < rowData.length; i++) {
                const field: Field = rec.getFieldF(data.columns[i].key);
                field.set(rowData[i]);
            }
            recs.push(rec);
        });

        return recs;
    }

    // wariant obiektowy (kluczem obiektu jest klucz pola)
    Utils.forEach((repoData: Object, key: string) => {

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
                visitRepository(context, fieldData, value);
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

