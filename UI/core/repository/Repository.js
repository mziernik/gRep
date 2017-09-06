import {
    DEV_MODE,
    Ready,
    Check,
    Record,
    Field,
    Column,
    CRUDE,
    Utils,
    Is,
    Dev,
    Cell,
    AppEvent,
    PROD_MODE,
    Endpoint
} from "../core.js";

import Permission from "../application/Permission";
import Dispatcher from "../utils/Dispatcher";
import RepositoryStorage from "./storage/RepositoryStorage";
import Alert from "../component/alert/Alert";
import {RecordDataGenerator} from "./Record";
import WebApiRepoStorage from "./storage/WebApiRepoStorage";


//ToDo: Opcja inline - edycja rekordów podobnie jak w uprawnieniach

export default class Repository {

    /** Ignoruj błędy w rekordach i dodawaj je nawet jeśli nie przeszły walidacji*/
    static ignoreErrors: boolean = true;

    static onUpdate: Dispatcher = new Dispatcher();
    static defaultStorage: RepositoryStorage = WebApiRepoStorage.INSTANCE;
    /** Lista wszystkich zarejestrowanych repozytoriów */
    static all = {};
    onChange: Dispatcher = new Dispatcher(); //CRUDE, Record, Map
    /** Błąd metadanych lub treści repozytorium */
    error: ?Error = null;
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
    /** Wersja repozytorium, wymagane podczas zapisu/odczytu danych magazynu*/
    version: number = 1;

    constructor(config: (cfg: RepoConfig) => void) {
        Check.isFunction(config);
        config(this.config);

        for (let name in this.constructor) {

            const col: Column = this.constructor[name];
            if (!(col instanceof Column))
                continue;
            this.config._columns.push(col);
            col.repository = this;
            if (DEV_MODE)
                col["#instance"] = this.config.key + "." + col.key;
        }

        this.config._processColumns(this.config);
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

    get references(): ?RepoReference[] {
        if (!this.config.references)
            return null;

        return Utils.forEach(this.config.references, (ref, key) => {
            const result: RepoReference = new RepoReference();
            result.key = key;
            result.name = ref.name;

            let r = ref.repo;
            result.repo = r instanceof Repository ? r : Repository.get(r, true);

            let c = ref.column;
            result.column = c instanceof Column ? c : result.repo.getColumn(c, true);

            return result;
        });

    }

    get primaryKeyColumn(): Column {
        return this.config.primaryKeyColumn;
    }

    get isEmpty(): boolean {
        return this.rows.size === 0;
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
                try {
                    repo.config.load(data);
                    repo.config.update();
                } catch (e) {
                    Dev.error(Repository, e);
                    repo.error = e;
                }
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
            try {
                if (value instanceof Record) {
                    const rec: Record = value;
                    if (rec.repo.error) {
                        rec.repo.confirmReadyState();
                        return;
                    }
                    records.push(rec);
                    return;
                }
                const repo: Repository = Repository.get(key, true);

                if (repo.error) {
                    repo.confirmReadyState();
                    return;
                }
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
                        const rec: Record = repo.createRecord(context, CRUDE.CREATE);
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

                        const pk = obj[repo.primaryKeyColumn.key];
                        Check.isDefined(pk, "Pusta wartość klucza głównego repozytorium " + repo.key);

                        const rec: Record = repo.createRecord(context, repo.has(pk) ? CRUDE.UPDATE : CRUDE.CREATE);
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

            } catch (e) {
                if (!Repository.ignoreErrors)
                    throw e;
                if (DEV_MODE) console.warn(e); else Dev.error(this, e);
            }
        });

        if (!records.length)
            return;

        Utils.forEachSafe(records, (rec: Record) => {
            try {
                rec.validate();
            } catch (e) {
                if (!Repository.ignoreErrors)
                    throw e;
                if (DEV_MODE) console.warn(e); else Dev.error(this, e);
            }
        });

        // zastosowanie zmian (na tym etapie dane są zwalidowane)
        const map: Map<Repository, Record[]> = Utils.agregate(records, (rec: Record) => rec.repo);
        Repository.onUpdate.dispatch(context, {map: map});


        const changes = [];

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
            rec._row = row;

            changes.push({
                pk: pk,
                row: row,
                repo: repo,
                action: action,
                record: rec,
                changed: changed
            });
        });

        changes.forEach(obj => {
            const repo: Repository = obj.repo;
            const rec: Record = obj.record;
            /*
                        const getDisplayValue = (repo: Repository, rec: Record) => {
                            let col: Column = repo.config.displayNameColumn || repo.config.primaryKeyColumn;
                            if (col && col.foreign) {
                                const r: Repository = col.foreign();
                                return getDisplayValue(r, r.get(null, rec.get(col).value));
                            }
                            return rec.getValue(col);
                        };
            */
            if (rec.action !== CRUDE.DELETE) {

                //    if (repo.key === "attrElm") debugger;

                const val = repo.getDisplayValue(rec);
                if (val === undefined) {
                    //           debugger;
                    repo.getDisplayValue(rec);
                }
                repo.displayMap.set(obj.pk, val);
            }

            rec.repo.onChange.dispatch(context, {action: obj.action, record: rec, changed: obj.changed});

            if (repo.isReady && obj.changed.size)
                repo.recordsUpdateTsMap.set(obj.pk, new Date().getTime());
        });


        AppEvent.REPOSITORY_UPDATED.send(Repository, {changes: changes});

        // zaktualizuj flagę gotowości dla wszystkich odebranych repozytoriów (włącznie z pustymi)
        repositories.forEach(repo => repo.confirmReadyState());
    }

    /**
     * Zastosuj zmiany (edycja / synchronizacja)
     */
    static commit(context: any, records: Record[]): Promise {
        records = Utils.asArray(records);

        Utils.forEach(records, (rec: Record) => rec.validate());


        records = Utils.forEach(records, (rec: Record) => {

            const parent: Record = rec.parent;
            if (!parent) return rec;

            if (rec.action && !parent.changedReferences.contains(rec))
                parent.changedReferences.push(rec);

            if (!rec.action && parent.changedReferences.contains(rec))
                parent.changedReferences.remove(rec);

            parent.onReferenceChange.dispatch(this, {record: rec});

        });


        const storageMap: Map = Utils.agregate(records, (rec: Record) => (!rec.localCommit && rec.storage) || "LOCAL");

        const result: Promise[] = [];

        storageMap.forEach((records: Record[], storage: RepositoryStorage) => storage === "LOCAL"
            ? Repository.update(context, records)
            : result.push(storage.save(context, records)));

        return Promise.all(result);
    }

    static buildDTO(records: Record[], includeUnchanged: boolean = false): {} {
        const dto: Object = {};
        const map: Map<Repository, Record[]> = Utils.agregate(records, (rec: Record) => rec.repo);

        let hasChanges = includeUnchanged;

        map.forEach((records: Record[], repo: Repository) => {

            const obj = dto[repo.key] = [];
            records.forEach((record: Record) => {
                const r = {};
                let add: boolean = false;
                r["#action"] = record.action ? record.action.name : null;
                r["#uid"] = record.UID;

                if (record.action !== CRUDE.UPDATE) hasChanges = true;

                record.fields.forEach((field: Field) => {

                    if (record.action === CRUDE.DELETE && field !== record.primaryKey)
                        return;

                    if (includeUnchanged || field.changed || field === record.primaryKey) {
                        const value = field.value;
                        if (value === null && record.action === CRUDE.CREATE)
                            return;
                        r[field.key] = field.serializedValue;
                        if (field !== record.primaryKey)
                            add = true;
                    }

                });

                if (record.changedReferences.length)
                    Is.defined(Repository.buildDTO(record.changedReferences, includeUnchanged), d => {
                        r["#refs"] = d;
                        add = true;
                    });

                if (add) {
                    hasChanges = true;
                    obj.push(r);
                }
            });
        });
        return hasChanges ? dto : null;
    }

    /** Zwraca repozytorium na podstawie klucza, opcjonalnie wyjątek jeśli nie znaleziono obiektu */
    static get(key: string | () => any, mustExists: boolean = true): Repository {

        if (Is.func(key))
            key = key();

        if (key instanceof Repository)
            return key;

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

    getRefs(pk: any): Record[] {
        return Utils.forEach(this.refs, (rec: Record) => rec.pk === pk ? rec : undefined);
    }

    getColumnIndex(column: Column) {
        const idx = this.columns.indexOf(column);
        if (idx < 0)
            throw new Error(`Repozytorium ${this.key} nie posiada kolumny ${column.key}`);
        return idx;
    }

    /**
     * Zwraca kolumnę należącą do bieżącego lub innego repozytorium (w zależności od flagi [checkOwnership])
     * @param key
     * @param mustExists
     * @param checkOwnership
     * @return {*}
     */
    getColumn(key: string | Column, mustExists: boolean = true, checkOwnership: boolean = true): Column {

        if (key instanceof Column) {
            if (checkOwnership && !this.columns.contains(key))
                throw new Error("Kolumna " + key.key + " nie należy do repozytorium " + this.key);
            return key;
        }

        const elements: string[] = Check.isString(key).split(".");

        if (elements.length === 2) {
            const repo = Repository.get(elements[0], true);
            if (checkOwnership && repo !== this)
                throw new Error("Kolumna " + key + " nie należy do repozytorium " + this.key);
            return repo.getColumn(elements[1], mustExists, false);
        }


        if (!this.columns.length)
            throw new RepoError(this, "Repozytorium nie posiada kolumn");

        const result = this.columns.find(c => c.key === key);
        if (!result && mustExists)
            throw new Error("Kolumna " + this.key + "." + key + " nie istnieje");
        return result;
    }

    has(pk: any): boolean {
        pk = this.config.primaryKeyColumn.parse(pk);
        return this.rows.has(pk);
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
        const rec: Record = this.createRecord(context, row ? CRUDE.UPDATE : CRUDE.CREATE);
        rec.row = row;
        return rec;
    }

    getOrCreate(context: any, pk: any): Record {
        return Is.defined(pk) ? this.get(context, pk, true) : this.createRecord(context, CRUDE.CREATE);
    }

    createRecord(context: any, crude: CRUDE): Record {

        Check.instanceOf(crude, [CRUDE.Crude]);
        const rec: Record = new (this.config.record || Record)(this, context);
        rec.action = crude;
        if (PROD_MODE)
            return rec;

        this.columns.forEach((col: Column) => Is.condition(!rec.fields.has(col), () => new Cell(rec, col)));
        Utils.forEachSafe(rec.fields, (f, c) => Is.condition(!this.columns.contains(c)), () => rec.fields.delete(c));

        return rec;
    }

    toObjects(columns: Column[], filter: (cursor: RepoCursor) => boolean): [] {
        const result: [] = [];
        const cursor: RepoCursor = this.cursor();
        while (cursor.next()) {
            if (filter && !filter(cursor))
                continue;
            const obj = {};
            columns.forEach((col: Column) => obj[col.key] = cursor.get(col));
            result.push(obj);
        }
        return result;
    }

    getValues(col: Column): any[] {
        const idx = this.getColumnIndex(col);
        return Utils.forEach(this.rows, (row: [], pk) => row[idx]);
    }

    min(col: Column, initValue: number = null) {
        let min = initValue;
        Utils.forEach(this.getValues(col), val => {
            if (min === null || min > val)
                min = val;
        });
        return min;
    }

    max(col: Column, initValue: number = null) {
        let max = initValue;
        Utils.forEach(this.getValues(col), val => {
            if (max === null || max < val)
                max = val;
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

    /**
     * Wypełnia rekord wygenerowanymi danymi losowymi danymi
     */

    fillRecord(generator: RecordDataGenerator, rec: Record, index: number) {
        generator.fill(rec, index);
    }

    getDisplayValue(record: Record): string {

        if (this.config.displayMask)
            return Utils.processVariables(this.config.displayMask, name => record.get(name).displayValue);

        let col: Column = this.config.displayNameColumn || this.config.primaryKeyColumn;
        if (record.action !== CRUDE.CREATE && col && col.foreign) {
            const r: Repository = col.foreign.repo;
            return r.getDisplayValue(r.get(null, record.get(col).value));
        }

        return record.get(col).displayValue;
    }

    confirmReadyState() {
        this.isReady = true;
        Ready.confirm(Repository, this);
    }

    cursor(): RepoCursor {
        return new RepoCursor(this);
    }

    /**
     * Iteracja po wierszach repozytorium (nie rekordach) przy pomocy kursora
     */
    forEach(consumer: (cursor: RepoCursor, stop: () => void) => void) {
        this.cursor().forEach(consumer);
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
    displayMask: ?string = null;
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


    _processColumns(data: Object) {
        const getColumn = (col) => {
            if (col instanceof Column)
                col = (col: Column).key;

            const result = this._columns.find(c => c.key === col);

            if (col && !result)
                throw new RepoError(this._repo, "Nie znaleziono kolumny " + Utils.toString(col));

            return result;
        };

        let display = data.displayNameColumn;
        if (Is.string(display)) {
            for (let i = 0; i < display.length; i++)
                if (!".-0123456789_abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".contains(display[i])) {
                    data.displayNameColumn = null;
                    data.displayMask = display;
                    break;
                }
        }

        this.primaryKeyColumn = getColumn(data.primaryKeyColumn);
        this.displayNameColumn = getColumn(data.displayNameColumn);
        this.orderColumn = getColumn(data.orderColumn);
        this.parentColumn = getColumn(data.parentColumn);
        this.displayMask = data.displayMask;
    }

    /**
     * Wczytanie konfiguracji repozytorium z zewnątrz (rezultat metody list z webapi)
     * @param data
     */
    load(data: Object) {


        const colsArr: string[] = [];

        // dodanie kolumn / aktualizacja istniejących
        Utils.forEach(data.columns, cdata => {
                colsArr.push(cdata.key);
                Is.defined(this._columns.find(c => c.key === cdata.key),
                    (c: Column) => c._load(cdata),
                    () => this._columns.push(new Column((c: Column) => c._load(cdata)))
                )
            }
        );

        this._processColumns(data);

        // usuwanie nadmiarowych kolumn
        Utils.forEachSafe(this._columns, (c: Column) => Is.condition(!colsArr.contains(c.key), () => this._columns.remove(c)));


        this.name = data.name;
        this.group = data.group;
        this.description = data.description;
        this.info = data.info || {};
        this.actions = data.actions;
        this.limit = data.limit;
        this.icon = data.icon;
        this.broadcast = data.broadcast;
        this.onDemand = data.onDemand;

        this.crude = data.crude;
        this.local = data.local;
        this.references = data.references;
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

        // usuwanie nadmiarowych kolumn
        Utils.forEachSafe(repo.columns, (c: Column) => Is.condition(!this._columns.contains(c), () => repo.columns.remove(c)));

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
    action: ?() => void;
    hint: string;
    type: string;
    icon: string;
    confirm: string;
    params: Object; //ToDo obsługa
    constraints: Object; //ToDo obsługa
    children: RepoAction[] = [];

    constructor(repo: Repository, key: string, name: string, action: () => void, confirm: string) {
        this.repo = repo;
        this.key = key;
        this.name = name;
        this.action = action;
        this.confirm = confirm;
    }

    execute() {

        const run = () => {
            if (this.action)
                this.action();
            else
                this.repo.storage.action(this.repo, this.key, null, {})
        };

        if (this.confirm)
            Alert.confirm(this.confirm, () => run())
        else
            run();
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

    add(child: RepoTree) {
        if (child.parent)
            child.parent.children.remove(child);
        child.parent = this;
        this.children.push(child);
    }

    get(column: Column): any {
        return this.row[this.repo.getColumnIndex(column)];
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

    forEach(consumer: (cursor: RepoCursor, stop: () => void) => void) {
        this.reset();
        let stopped: false;
        const stop = () => stopped = true;
        while (!stopped && this.next())
            consumer(this, stop);
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
        this._index = -1
    }

    get row(): any[] {
        return Utils.clone(this._rows[this._index]);
    }

    get primaryKey(): any {
        return this.get(this.repo.primaryKeyColumn);
    }

    getRecord(context: any) {
        const rec: Record = this.repo.createRecord(context, CRUDE.UPDATE);
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

export class RepoError extends Error {

    constructor(repo: Repository, message: string) {
        super("Repozytorium " + repo.key + ": " + Utils.toString(message))
    }
}

export class RepoReference {
    key: string;
    repo: Repository;
    column: Column;
    name: string;
    records: Record[] = [];
    parent: Record;

    update(parent: Record) {
        this.parent = parent;
        this.records.addAll(this.repo.find(this, (cursor: RepoCursor) => cursor.get(this.column) === parent.pk))
    }
}

