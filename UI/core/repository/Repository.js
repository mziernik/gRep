import {Ready, Check, Record, Field, Column, CRUDE, Utils, Is, Debug, Type, AppEvent} from "../core";

import Permission from "../application/Permission";
import Dispatcher from "../utils/Dispatcher";
import RepositoryStorage from "./storage/RepositoryStorage";


//ToDo: Opcja inline - edycja rekordów podobnie jak w uprawnieniach

export default class Repository {

    static onUpdate: Dispatcher = new Dispatcher();
    onChange: Dispatcher = new Dispatcher(); //CRUDE, Record, Map

    static defaultStorage: ?RepositoryStorage;

    /** Lista wszystkich zarejestrowanych repozytoriów */
    static all = {};

    actions: RepoAction[] = [];
    refs: Record[] = [];

    config: RepoConfig = new RepoConfig(this);
    rows: Map<any, any[]> = new Map();

    recordsUpdateTsMap: Map<any, number> = new Map();

    columns: Column[] = [];

    permission: Permission;

    /** Magazyn danych dla repozytorium. W momencie zarejestrowania repozytorium (metoda [register]) przypisane zostanie [defaultStorage]*/
    storage: RepositoryStorage;
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
            this.config._columns.push(col);
            col.repository = this;
        }

        this.config.update();
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

    getColumnIndex(column: Column) {
        const idx = this.columns.indexOf(column);
        if (idx < 0)
            throw new Error(`Repozytorium ${this.key} nie posiada kolumny ${column.key}`);
        return idx;
    }

    getColumn(key: string, mustExists: boolean = true): Column {
        const result = this.columns.find(c => c.key === key);
        if (!result && mustExists)
            throw new Error("Kolumna " + this.key + "." + key + " nie istnieje");
        return result;
    }


    get(context: any, pk: any, mustExists: boolean = true): Record {
        if (Is.defined(pk))
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

    createRecord(context: any, crude: CRUDE): Record {
        const rec: Record = new (this.config.record || Record)(this, context);
        if (rec.fields.size !== this.columns.length)
            this.columns.forEach((col: Column) => Is.condition(!rec.fields.has(col), () => new Field(col, rec)));
        rec.action = crude;
        return rec;
    }

    min(col: Column, initValue: number = null) {
        let min = initValue;
        const idx = this.getColumnIndex(col);

        Utils.forEach(this.rows, (row: [], pk) => {
            if (min === null || min > row[idx])
                min = row[idx];
        });

        return min;
    }

    max(col: Column, initValue: number = null) {
        let max = initValue;
        const idx = this.getColumnIndex(col);

        Utils.forEach(this.rows, (row: [], pk) => {
            if (max === null || max < row[idx])
                max = row[idx];
        });

        return max;
    }

    find(context: any, filter: (cursor: RepoCursor) => boolean): Record[] {
        const result: Record[] = [];
        const cursor: RepoCursor = this.cursor();
        while (cursor.next()) {
            if (filter(cursor))
                result.push(cursor.getRecord(context));
        }
        return result;
    }

    get references(): ?RepoReference[] {
        if (!this.config.references)
            return null;
        return Utils.forEach(this.config.references, (ref, key) => {
            const result: RepoReference = new RepoReference();
            result.key = key;
            result.name = ref.name;
            result.column = Check.instanceOf(Is.func(ref.column) ? ref.column() : ref.column, [Column]);
            return result;
        });

    }

    /**
     * Przetwarzanie listy repozytoriów zwróconych przez serwer
     * @return Lista nowych (dynamicznych) repozytoriów
     * */
    static processMetaData(response: Object): Repository[] {

        const list: Repository[] = [];

        Utils.forEach(response, data => {
                let repo: Repository = Repository.all[data.key];
                if (!repo) {
                    repo = new DynamicRepo(data);
                    list.push(repo);
                }
                repo.config.load(data);
                repo.config.update();
            }
        );

        return list;

    }

    static update(context: any, dto: Record[] | Object) {

        // debugger;
        const records: Record[] = [];
        const repositories: Repository[] = [];

        const repoStats: Map<Repository, object> = new Map();

        // weryfikacja, utworzenie rekordów
        Utils.forEach(dto, (value, key) => {
            if (value instanceof Record) {
                records.push(value);
                return;
            }
            const repo: Repository = Repository.get(key, true);
            repositories.push(repo);


            if (Is.array(value.rows))
                repoStats.set(repo, {
                    crude: value.crude,
                    lastUpdated: value.lastUpdated,
                    lastUpdatedBy: value.lastUpdatedBy,
                    updates: value.updates,
                });


            if (Is.array(value.columns) && Is.array(value.rows)) {

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
                    const map: Map = new Map();
                    Utils.forEach(obj, (v, k) => {
                        const col: Column = repo.getColumn(k);
                        rec.get(col).value = v;
                        map.set(col, v);
                    });

                    if (map.size === 1)
                        map.forEach((v, col: Column) => {
                            if (col === rec.primaryKey.config)
                                rec.action = CRUDE.DELETE;
                        });

                    records.push(rec);
                });


            if (Is.array(value.rows)) {
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
        Repository.onUpdate.dispatch(context, {map: map});


        records.forEach((rec: Record) => {
            const pk = rec.primaryKey.value;
            const repo: Repository = rec.repo;

            let row: [] = repo.rows.get(pk);

            const action: CRUDE = rec.action || (row ? CRUDE.UPDATE : CRUDE.CREATE  );

            if (action === CRUDE.CREATE) {
                row = new Array(repo.columns.length);
                repo.rows.set(pk, row);
            }

            const refs: Record[] = repo.getRefs(pk);

            const changed: Map<Column, any[]> = new Map();
            if (action === CRUDE.DELETE) {
                repo.rows.delete(pk);
            } else
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

            refs.forEach((r: Record) => r.onChange.dispatch(context, {action: action, changed: changed}));

            repo.displayMap.set(pk, row[repo.columns.indexOf(repo.config.displayNameColumn
                ? repo.config.displayNameColumn : repo.config.primaryKeyColumn)]);

            rec.repo.onChange.dispatch(context, {action: action, record: rec, changed: changed});

            if (repo.isReady && changed.size)
                repo.recordsUpdateTsMap.set(pk, new Date().getTime());
        });


        // zaktualizuj flagę gotowości dla wszystkich odebranych repozytoriów (włącznie z pustymi)
        repositories.forEach(repo => {
            repo.isReady = true;
            Ready.confirm(Repository, repo);
        });
    }

    getDisplayValue(record: Record): string {
        return record.get(this.config.displayNameColumn || this.config.primaryKeyColumn).displayValue;
    }

    /**
     * Zastosuj zmiany (edycja / synchronizacja)
     */
    static commit(context: any, records: Record[], crude: CRUDE): Promise {
        Check.instanceOf(records, [Array]);

        Utils.forEach(records, (rec: Record) =>
            Utils.forEach(rec.fields, (f: Field) => {
                if (!f.validate(true))
                    throw new Error(Utils.escape(f.name) + ": " + f.error);
            })
        );

        const storageMap: Map = Utils.agregate(records, (rec: Record) => rec.repo.storage || "LOCAL");

        const result: Promise[] = [];

        storageMap.forEach((records: Record[], storage: RepositoryStorage) => storage === "LOCAL"
            ? Repository.update(context, records)
            : result.push(storage.save(context, records, crude)));

        return Promise.all(result);
    }

    get primaryKeyColumn(): Column {
        return this.config.primaryKeyColumn;
    }

    /** Zwraca repozytorium na podstawie klucza, opcjonalnie wyjątek jeśli nie znaleziono obiektu */
    static get(key: string, mustExists: boolean = true): Repository {
        const result = Repository.all[key];
        if (mustExists && !result)
            throw new Error("Nie znaleziono repozytorium " + Utils.escape(key));
        return result;
    }

    static register(repository: Repository) {
        if (Repository.all[repository.key])
            throw new Error(`Repozytorium ${repository.key} już istnieje`);
        if (!repository.storage)
            repository.storage = Repository.defaultStorage;
        Repository.all[repository.key] = repository;
        AppEvent.REPOSITORY_REGISTERED.send(this, {repository: repository});
        return repository;
    }


    cursor(): RepoCursor {
        return new RepoCursor(this);
    }

    tree(parentColumn: ?Column = null): RepoTree {
        return RepoTree.create(this, parentColumn || this.config.parentColumn);
    }

}

/**
 * Klasa prezentuje dane repozytorium w strukturze drzewiastej.
 * onwersja następuje po zdefiniowaniu kolumny wskazującej na rodzica.
 */


export class RepoConfig {
    static defaultCrudeRights = "CRUD"; //"CRUDE"

    record: Object = null;
    key: ?string = null;
    name: ?string = null;
    group: ?string = null;
    primaryKeyColumn: Column = null;
    displayNameColumn: ?Column = null;
    actions: ?Object | RepoAction[] = null;
    onDemand: boolean = false;
    broadcast: boolean = false;
    references: ?Object = null;

    /** Kolumna definiująca rodzica - dla struktury drzewiastej */
    parentColumn: ?Column = null;
    /** Kolumna definiująca wartość kolejności wyświetlania wierszy - dla repozytoriów w których można sortować wiersze*/
    orderColumn: ?Column = null;
    description: ?string = null;

    info: ?Object = null;

    limit: ?number = null;
    offset: ?number = null;

    crude: string = RepoConfig.defaultCrudeRights;
    local: ?boolean = null;
    icon: ?string = null;
    _columns: Column[] = [];
    /** Repozytorium utworzone dynamicznie (rezultat metody [list] z webapi)*/
    dynamic: boolean = false;

    _repo: Repository;

    constructor(repo: Repository) {
        this._repo = repo;
        Object.preventExtensions(this);
    }


    /**
     * Wczytanie konfiguracji repozytorium z zewnątrz (rezultat metody list z webapi)
     * @param data
     */
    load(data: Object) {

        Utils.forEach(data.columns, cdata =>
            Is.defined(this._columns.find(c => c.key === cdata.key),
                (c: Column) => c._load(cdata),
                () => this._columns.push(new Column((c: Column) => c._load(cdata)))
            )
        );

        this.name = data.name;
        this.group = data.group;
        this.description = data.description;
        this.info = data.info || {};
        this.actions = data.actions;
        this.limit = data.limit;
        this.icon = data.icon;
        this.broadcast = data.broadcast;
        this.onDemand = data.onDemand;

        const getColumn = (name) => {

            const result = this._columns.find(c => c.key === name);

            if (name && !result)
                throw new RepoError(this._repo, "Nie znaleziono kolumny " + Utils.toString(name));

            return result;
        };

        this.primaryKeyColumn = getColumn(data.primaryKeyColumn);
        this.displayNameColumn = getColumn(data.displayNameColumn);
        this.orderColumn = getColumn(data.orderColumn);
        this.parentColumn = getColumn(data.parentColumn);
        this.crude = data.crude;
        this.local = data.local;
    }

    /**
     * Weryfikacja i stosowanie ustawień (przepisywanie z konfiguracji do repozytorium)
     */
    update() {
        const repo: Repository = this._repo;

        repo.actions = Is.def(this.actions, acts => Utils.forEach(acts, (obj, key) => {
            const act = new RepoAction();
            act.key = key;
            act.rec = !!obj.record;
            act.name = obj.name;
            act.type = obj.type;
            act.icon = obj.icon;
            act.confirm = obj.confirm;
            return act;
        }), []);

        this._columns.forEach(col => {
            if (!repo.columns.contains(col))
                repo.columns.push(col);
        });

        if (!this.primaryKeyColumn)
            throw new Error("Brak definicji klucza głównego repozytorium " + Utils.escape(this.key));


        if (!repo.columns.contains(this.primaryKeyColumn))
            throw new Error("Kolumna " + Utils.escape(this.primaryKeyColumn) + " nie należy do repozytorium " + Utils.escape(this.key));

        repo.permission = Permission.all["repo-" + this.key];
        if (!repo.permission)
            repo.permission = new Permission(repo, "repo-" + this.key, `Repozytorium "${this.name}"`, Repository.defaultCrudeRights);

        repo.permission.crude = this.crude;

        AppEvent.REPO_CONFIG_UPDATE.send(this, {repo: repo, config: this})
    }

}


export class RepoAction {
    repo: Repository;

    rec: boolean;
    key: string;
    name: string;
    hint: string;
    type: string;
    icon: string;
    confirm: string;
    params: object;

    constructor(repo: Repository, act: Object) {
        this.repo = repo;
    }
}


export class RepoTree {

    repo: Repository;
    root: RepoTree;
    parent: RepoTree;
    children: RepoTree[] = [];
    row: [];
    primaryKey: any;
    parentKey: any;

    constructor(repo: Repository) {
        this.repo = repo;
    }

    add(child: RepoTree) {
        if (child.parent)
            child.parent.children.remove(child);
        child.parent = this;
        this.children.push(child);
    }

    get(column: Column): any {
        return this.row[this.repo.getColumnIndex(column)];
    }

    static create(repo: Repository, parentColumn: Column): RepoTree {

        const map: Map = new Map();

        const idx = repo.getColumnIndex(parentColumn);
        const pkIdx: number = repo.columns.indexOf(repo.primaryKeyColumn);

        const root = new RepoTree(repo);
        root.root = root;

        repo.rows.forEach((row: []) => {
            const r: RepoTree = new RepoTree(repo);
            r.primaryKey = row[pkIdx];
            r.parentKey = row[idx];
            r.row = row;
            map.set(r.primaryKey, r);
        });


        map.forEach((rt: RepoTree) => {
            if (rt.parentKey === null || rt.parentKey === undefined) {
                root.add(rt);
                return;
            }

            const parent: RepoTree = map.get(rt.parentKey);
            if (!parent) throw new Error("Nie znaleziono rodzica dla " + rt.parentKey);

            parent.add(rt);
        });

        return root;
    }
}

export class RepoCursor {
    repo: Repository;
    _index: number = -1;
    _rows: [] = [];

    constructor(repo: Repository) {
        this.repo = repo;
        repo.rows.forEach(row => this._rows.push(row));
    }

    next(): boolean {
        ++this._index;
        return this._index < this._rows.length;
    }

    back(): boolean {
        --this._index;
        return this._index >= 0;
    }

    reset() {
        this._index = 0
    }

    getRecord(context: any) {
        const rec: Record = this.repo.createRecord(context);
        rec.row = this._rows[this._index];
        return rec;
    }

    get(column: Column): any {
        const idx = this.repo.getColumnIndex(column);

        if (this._index < 0 || this._index >= this._rows.length)
            throw new Error("Kursor poza zakresem");

        return this._rows[this._index][idx];
    }
}

class DynamicRepo extends Repository {

    constructor(data: Object) {
        super((c: RepoConfig) => {
            c.dynamic = true;
            c.key = data.key;
            c.record = Record;
            c.load(data);
        });
    }

}

class RepoError extends Error {

    constructor(repo: Repository, message: string) {
        super(repo.key + ": " + Utils.toString(message))
    }
}

export class RepoReference {
    key: string;
    column: Column;
    name: string;
    records: Record[] = [];
}