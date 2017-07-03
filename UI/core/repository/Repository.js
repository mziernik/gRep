import {ContextObject, Check, Record, Field, Column, CRUDE, Utils, If, Debug, Type, AppEvent} from "../core";

import Permission from "../application/Permission";
import LocalRepoStorage from "./storage/LocalRepoStorage";
import Action from "./Action";
import Dispatcher from "../utils/Dispatcher";
import WebApiRepositoryStorage from "./storage/WebApiRepoStorage";
import {FieldConfig} from "./Field";
import RepositoryStorage from "./storage/RepositoryStorage";

export class RepositoryMode {
    static LOCAL: RepositoryMode = new RepositoryMode();
    static REMOTE: RepositoryMode = new RepositoryMode();
    static SYNCHRONIZED: RepositoryMode = new RepositoryMode();
}

//ToDo: Opcja inline - edycja rekordów podobnie jak w uprawnieniach


export class RepoConfig {
    static defaultCrudeRights = "CRUD"; //"CRUDE"

    record: object = null;
    key: ?string = null;
    name: ?string = null;
    primaryKeyColumn: Column = null;
    displayNameColumn: ?Column = null;

    crude: string = RepoConfig.defaultCrudeRights;
    readOnly: boolean = false;
    autoUpdate: boolean = false;
    local: ?boolean = null;

    constructor() {
        Object.preventExtensions(this);
    }
}

export default class Repository {

    static onUpdate: Dispatcher = new Dispatcher();
    onChange: Dispatcher = new Dispatcher();

    static defaultStorage: ?RepositoryStorage;

    /** Lista wszystkich zarejestrowanych repozytoriów */
    static all = {};

    refs: Record[] = [];


    config: RepoConfig = new RepoConfig();
    rows: Map<any, any[]> = new Map();

    columns: Column[] = [];

    permission: Permission;

    storage: RepositoryStorage = Repository.defaultStorage;
    /** Czy dane repozytorium zostały już wczytane */
    isReady: boolean = false;

    /** Data ostatniej aktualizacji */
    lastUpdated: Date;
    /** Autor ostatniej aktualizacji */
    lastUpdatedBy: string;
    /* Ilość aktualizacji (numer bieżącej wersji)*/
    updates: Number = 0;
    /** Mapa <Klucz główny, nazwa wyświetlana> */
    displayMap: Map<any, string> = new Map();

    constructor(config: (cfg: RepoConfig) => void) {

        Check.isFunction(config);
        config(this.config);

        for (let name in this.constructor) {

            const col: Column = this.constructor[name];
            if (!(col instanceof Column))
                continue;
            this.columns.push(col);

            Object.defineProperty(this.constructor, name, {
                value: col,
                writable: false
            });
        }

        if (!this.config.primaryKeyColumn)
            throw new Error("Brak definicji klucza głównego repozytorium " + Utils.escape(this.config.key));

        if (!this.columns.contains(this.config.primaryKeyColumn))
            throw new Error("Kolumna " + Utils.escape(this.config.primaryKeyColumn.key) + " nie należy do repozytorium " + Utils.escape(this.config.key));

        this.permission = Permission.all["repo-" + this.key];
        if (!this.permission) {
            this.permission = new Permission(this, "repo-" + this.key, `Repozytorium "${this.name}"`, Repository.defaultCrudeRights);
            this.permission.crude = this.config.crude;
        }
    }

    get key(): string {
        return this.config.key;
    }

    get name(): string {
        return this.config.name;
    }

    get canCreate(): boolean {
        return this.config.crude.contains('C');
    }

    get canRead(): boolean {
        return this.config.crude.contains('R');
    }

    get canUpdate(): boolean {
        return this.config.crude.contains('U');
    }

    get canDelete(): boolean {
        return this.config.crude.contains('D');
    }

    getRefs(pk: any): Record[] {
        return Utils.forEach(this.refs, (rec: Record) => rec.pk === pk ? rec : undefined);
    }

    getColumn(key: string, mustExists: boolean = true): Column {
        const result = this.columns.find(c => c.key === key);
        if (!result && mustExists)
            throw new Error("Kolumna " + this.key + "." + key + " nie istnieje");
        return result;
    }


    get(context: any, pk: any, mustExists: boolean = true): Record {
        if (If.isDefined(pk))
            pk = this.config.primaryKeyColumn.parse(pk);
        const row: [] = this.rows.get(pk);
        if (!row) {
            if (mustExists)
                throw new Error("Nie znaleziono rekordu " + this.key + "[" + this.primaryKeyColumn.key + "=" + Utils.escape(pk) + "]");
            return null;
        }
        const rec: Record = this.createRecord(context);
        rec.row = row;
        return rec;
    }

    createRecord(context: any): Record {
        return new this.config.record(this, context);
    }

    static update(context: any, dto: Record[] | Object) {

        // debugger;
        const records: Record[] = [];

        const repoStats: Map<Repository, object> = new Map();

        // weryfikacja, utworzenie rekordów
        Utils.forEach(dto, (value, key) => {
            if (value instanceof Record) {
                records.push(value);
                return;
            }
            const repo: Repository = Repository.get(key, true);

            if (If.isArray(value.rows))
                repoStats.set(repo, {
                    crude: value.crude,
                    lastUpdated: value.lastUpdated,
                    lastUpdatedBy: value.lastUpdatedBy,
                    updates: value.updates,
                });


            if (If.isArray(value.columns) && If.isArray(value.rows)) {

                let columns: Column[] = Utils.forEach(value.columns, c => repo.getColumn(c, true));

                Utils.forEach(value.rows, (row: []) => {
                    const rec: Record = repo.createRecord(context);
                    repo.refs.remove(rec); // nie traktuj jako referencję
                    records.push(rec);
                    for (let i = 0; i < columns.length; i++) {
                        const field: Field = rec.get(columns[i]);
                        field.value = row[i];
                    }
                });

                return;
            }

            const processObject = (value) =>
                Utils.forEach(value, obj => {
                    const rec: Record = repo.createRecord(context);
                    repo.refs.remove(rec); // nie traktuj jako referencję
                    Utils.forEach(obj, (v, k) => rec.get(repo.getColumn(k)).value = v);
                    records.push(rec);
                });


            if (If.isArray(value.rows)) {
                processObject(value.rows);
                return;
            }

            processObject(value);

        });

        if (!records.length)
            return;

        Utils.forEach(records, (rec: Record) => rec.validate());

        // zastosowanie zmian (na tym etapie dane są zwalidowane)
        const map: Map<Repository, Record[]> = Utils.agregate(records, (rec: Record) => rec.repo);
        Repository.onUpdate.dispatch(context, map);

        const allChanges: [] = [];

        records.forEach((rec: Record) => {
            const pk = rec.primaryKey.value;
            const repo: Repository = rec.repo;

            let row: [] = repo.rows.get(pk);
            const isNew = !row;

            if (isNew) {
                row = new Array(repo.columns.length);
                repo.rows.set(pk, row);
            }

            const refs: Record[] = repo.getRefs(pk);

            const changed: Map<Column, any[]> = new Map();
            Utils.forEach(repo.columns, (col: Column, index: number) => {
                const field: Field = rec.get(col);
                if (!field.changed)
                    return;
                const val = field.value;

                refs.forEach((r: Record) => r.get(col).update(context, val));

                if (row[index] === val)
                    return;

                changed.set(col, [row[index], val]);
                row[index] = val;
            });

            refs.forEach((r: Record) => r.onChange.dispatch(context, changed));

            repo.displayMap.set(pk, row[repo.columns.indexOf(repo.config.displayNameColumn
                ? repo.config.displayNameColumn : repo.config.primaryKeyColumn)]);

            allChanges.push([rec, pk, changed]);
        });


        Utils.agregate(allChanges, a => a[0].repo).forEach((arr: [], repo: Repository) => {
            const m = new Map();
            m.set(arr[1], arr[2]);
            repo.isReady = true;
            repo.onChange.dispatch(context, m);
        });


    }

    /**
     * Zastosuj zmiany (edycja / synchronizacja)
     */
    static commit(context: any, records: Record[]): Promise {
        Check.instanceOf(records, [Array]);

        const storageMap: Map = Utils.agregate(records, (rec: Record) => rec.repo.storage);

        const local: Record[] = [];
        const result: Promise[] = [];

        storageMap.forEach((records: Record[], storage: RepositoryStorage) => {
            if (storage)
                result.push(storage.save(context, records));
            else
                local.push(records);
        });


        local.forEach((records: Record[]) => {
            debugger;
            Repository.update(context, records);
        });

        return Promise.all(result);
    }

    get primaryKeyColumn(): Column {
        return this.config.primaryKeyColumn;
    }

    /** Zwraca repozytorium na podstawie klucza, opcjonalnie wyjątek jeśli nie znaleziono obiektu */
    static get(key: string, mustExists: boolean = true): Repository {
        const result = Repository.all[key];
        if (mustExists && !result)
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

}
