//FixMe importy, flow
import Repository from "./Repository";
import Store from "../Store";
import Record from "./Record";
import Field from "./Field";

export default class RepositoryStorage {
    _store: Store;
    _repository: Repository;
    read: boolean = false;
    write: boolean = false;

    constructor(repository: Repository) {
        this._repository = repository;
    }

    store(store: Store, read: boolean = true, write: boolean = true): RepositoryStorage {
        this._store = store;
        this.write = write;
        this.read = read;
        return this;
    }

    load() {

        if (!this._store || !this.read)
            return;

        const data = this._store.get("repo-" + this._repository.id);

        if (!data || !data.columns || !data.rows)
            return;

        const columns: Field[] = data.columns.map(c => {
            const result = this._repository.columns.find(cc => cc._name.toLowerCase() === c.name.toLowerCase());
            if (!result)
                throw new Error("Nie znaleziono kolumny " + JSON.stringify(c.name));
            return result;
        });

        const records: Record[] = [];
        data.rows.forEach((row: [], idx: number) => {

            if (columns.length !== row.length)
                throw new Error(`Nieprawidłowa ilość elementów w wierszu ${idx + 1}.\nAktualne ${row.length}, oczekiwane ${columns.length}`);

            const rec: Record = this._repository.newRecord();

            columns.forEach((col: Field, idx: number) => {
                const val = row[idx];
                rec.getFieldF(col._name).set(val);
            });

            rec._sourceRecord = this._repository.get(rec.primaryKey.get());
            records.push(rec);
        });

        records.forEach((rec: Record) => this._repository._update(this, [rec], false));
    }

    build(): Object {

        const data = {};
        data.columns = [];
        data.rows = [];

        this._repository.items.forEach((rec: Record) => {
            if (!data.columns.length)
                rec.fields.forEach((f: Field) => data.columns.push({
                    name: f._name,
                    type: f.type.name,
                    raw: f.type.simpleType
                }));

            const row = [];
            rec.fields.forEach((f: Field) => {
                let val = f.get();

                if (val instanceof Repository)
                    val = null;

                if (val instanceof Record)
                    val = val._primaryKeyValue;

                row.push(val);
            });
            data.rows.push(row);
        });
        return data;
    }

    save(): boolean {

        if (!this._store || !this.write)
            return;


        this._store.set("repo-" + this._repository.id, this.build());
    }
}