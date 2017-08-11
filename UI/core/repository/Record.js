import {
    Utils,
    Check,
    Is,
    Field,
    Repository,
    Dispatcher,
    CRUDE,
    Type,
    Column,
    ContextObject,
    Endpoint
} from "../core";


"use strict";
import {RepoCursor, RepoReference} from "./Repository";
import {ListDataType} from "./Type";

export default class Record {

    /** Zdarzenie utworzenia lub aktualizacji rekordu */
    onChange: Dispatcher = new Dispatcher(); // action: CRUDE, changes: Map

    /** Rekord nadrzędny - referencja*/
    parent: Record;
    changedReferences: Record[] = [];

    onReferenceChange: Dispatcher = new Dispatcher();
    onFieldChange: Dispatcher = new Dispatcher(); // field, prevValue, currValue, wasChanged
    repo: Repository;
    action: ?CRUDE = null;
    fields: Map<Column, Field> = new Map();
    context: any;

    endpoint: Endpoint; // endpoint edycyjny rekordu
    /** Wymuś lokalną edycję zmian (bez wysyłania do serwera) */
    localCommit: boolean = false;

    constructor(repo: Repository, context: any) {
        this.repo = Check.instanceOf(repo, [Repository]);
        if (!context) return;
        this.repo.refs.push(this);
        ContextObject.add(context, this, () => this.repo.refs.remove(this));

        this.onChange.listen(this, data => {
            if (data.action !== CRUDE.UPDATE) return;
            Utils.forEach(data.changes, (change: [], col: Column) => {
                const field: Field = this.fields.get(col);
                field.update(change[0]);
            });
        });

    }

    _pk: any;

    /** Zwraca wartość klucza głównego */
    get pk(): any {
        return this._pk || (this._pk = this.primaryKey.value);
    }

    _row: [] = null;

    set row(row: []) {
        this._row = new Array(this.repo.columns.length);
        for (let i = 0; i < this._row.length; i++) {
            const field: Field = this.fields.get(this.repo.columns[i]);
            field.value = row[i];
            field.changed = false;
            this._row[i] = row[i];
        }
    }

    get lastUpdate(): ?number { //timestamp ostatniej aktualizacji wiersza
        return this.repo.recordsUpdateTsMap.get(this.pk);
    }

    get fullId(): string {
        return this.repo.key + "[" + this.repo.primaryKeyColumn.key + "=" + this.primaryKey.escapedValue + "]";
    }

    get displayValue(): string {
        return this.repo.getDisplayValue(this);
    }

    /** Zwraca pole klucza głównego */
    get primaryKey(): Field {
        return Check.isDefined(this.fields.get(this.repo.primaryKeyColumn), new Error("Brak klucza głównego repozytorium "
            + Utils.escape(this.repo.key)));
    }

    get canRead(): boolean {
        return this.repo.config.crude.contains('R');
    }

    get canUpdate(): boolean {
        return this.repo.config.crude.contains('U');
    }

    get canDelete(): boolean {
        return this.repo.config.crude.contains('D');
    }

    get references(): RepoReference[] {
        const refs: RepoReference[] = this.repo.references;
        const pk = this.pk;
        Utils.forEach(refs, (rr: RepoReference) => {
            rr.parent = this;
            rr.records.addAll(rr.repo.find(this, (cursor: RepoCursor) => cursor.get(rr.column) === pk))
        });
        return refs;
    }

    // set(col: Column, value: any): Record {
    //     Check.instanceOf(col, [Column]);
    //
    //     const idx = this._getColumnIndex(col);
    //
    //     value = col.parse(value);
    //
    //     if (this.cells[idx] === value)
    //         return this;
    //
    //
    //     this.cells[idx] = value;
    //     this.changed.add(col);
    //
    //     return this;
    // }

    get dto(): object {
        const dto: Object = {};
        this.fields.forEach((field: Field) => dto[field.key] = field.config.type.serialize(field.value));
        return dto;
    }

    get (col: Column): Field {
        const field: Field = this.fields.get(col);
        if (!field)
            throw new Error("Repozytorium " + this.repo.key + " nie posiada kolumny " + col.key);
        return field;
    }

    getValue(col: Column): any {
        if (!this._row)
            throw new RecordError(this, "Rekord nie ma przypisanych danych");

        const idx: number = this.repo.columns.indexOf(col);
        if (idx < 0)
            throw new Error("Repozytorium " + this.repo.key + " nie posiada kolumny " + col.key);
        return this._row[idx];
    }

    /** Walidacja danych - do przeciążenia */
    validate() {

    }

    _getForeign(context: any, column: Column | Field): Record | Record[] {
        if (column instanceof Field)
            column = (column: Field).config;

        const fk = this.get(column).value;
        if (!Is.defined(fk)) return null;

        if (!column.foreign)
            throw new RecordError(this, "Kolumna " + column.key + " nie posiada klucza obcego");

        const frepo: Repository = column.foreign();

        if (fk instanceof Array)
            return Utils.forEach(fk, v => frepo.get(context, v));

        return frepo.get(context, fk);

    }

    getParent(): Record {
        if (!this.repo.config.parentColumn)
            return undefined;

        const parentId = this.get(this.repo.config.parentColumn).value;
        if (parentId === null)
            return null;

        return this.repo.get(this.context, parentId);
    }

    _getReferences(context: any, column: Column): Record[] {
        const pk = this.pk;
        return column.repository.find(context, (cursor: RepoCursor) => cursor.get(column) === pk);
    }
}

class RecordError extends Error {

    constructor(record: Record, message: string) {
        super(record.fullId + ": " + Utils.toString(message))
    }
}

export class RecordDataGenerator {

    repo: Repository;

    timestampDelta: number = 1000 * 60 * 60 * 24 * 7; // +- tydzień

    fields: Field[];
    context: any;
    /**  Czy dane mają mieć charakter stały czy losowy */
    random: boolean;
    /** Czy wypełniać wszystkie pola czy tylko te, które są wymagane */
    factor: number = 0.3;
    /** Dane przetwarzane sekwencyjnie / grupowo*/
    sequence: boolean;
    /** Łączna ilość rekordów */
    total: number;
    /** Losowy identyfikator instancji funkcji generującej dane */
    instance: string;
    /** Zmiany będą zastosowane tylko lokalnie */
    local: boolean;

    constructor(repo: Repository) {
        this.instance = Utils.randomId(4);
        this.repo = repo;
        this.fields = Utils.forEach(repo.columns, (c: Column) => new Field(c));
    }

    run(onDone) {

        const rec = (idx: number) => {
            const rec: Record = this.repo.createRecord(this, CRUDE.CREATE);
            rec.localCommit = this.local;
            this.repo.fillRecord(this, rec, idx);
            return rec;
        };

        const list = [];
        for (let i = 0; i < this.total; i++)
            list.push(rec(i + 1));

        const next = () => {
            Repository.commit(this, list.shift())
                .then(e => {
                    if (list.length)
                        next();
                    else if (onDone) onDone(e);
                });
        };

        if (this.sequence) {
            next();
            return;
        }

        Repository.commit(this, list)
            .then(e => {
                if (onDone) onDone(e);
            });

    }


    /**
     * Wypełnia rekord wygenerowanymi danymi losowymi danymi
     * @param context
     * @param Rec
     * @param index Numer sekwencyjny
     */
    fill(rec: Record, index: number) {
        Utils.forEach(rec.fields, (field: Field) => {

            const ref: Field = Utils.find(this.fields, f => f.key === field.key);
            //
            // if (this.local && rec.repo.primaryKeyColumn.key === field.key)
            //     debugger;


            if (ref && ref.changed)
                return field.value = ref.value;

            //if ((!field.config.required || (field.config.autoGenerated && !this.local) ) && !this.all) return;

            const rand = this.random ? Math.random() : null;

            // pomiń niektóre niewymagane pola
            if (!field.config.required && rand > this.factor)
                return;

            if (field.config.type instanceof ListDataType) {
                field.value = [];
                return;
            }

            let enm: Map = field.enumerate;
            if (enm)
                return field.value = Utils.asArray(enm().keys()).random();

            switch (field.config.type) {
                case Type.UUID:
                case Type.GUID:
                    return field.value = Utils.randomUid();
                case Type.DATE:
                    return field.value = new Date().getTime() + Math.round((rand * 2 - 1) * this.timestampDelta);

                case Type.TIME:
                    return field.value = new Date().getTime() + Math.round(rand * 24 * 60 * 60 * 1000);

                case Type.TIMESTAMP:
                    return field.value = new Date().getTime() + Math.round((rand * 2 - 1) * this.timestampDelta);
            }

            let val;
            switch (field.config.type.simpleType) {
                case "any":
                case "string" :
                    return field.value = (this.instance ? this.instance + ": " : "") + (rand ? Utils.randomId(10) : field.name + " " + index);
                case "boolean":
                    return field.value = rand > 0.5;
                case "number" :
                    return field.value = Math.round(rand * (field.config.max || 9999999));
                case "object":
                    return field.value = {value: field.name};
                case "array":
                    return field.value = [field.name];
            }
        });


    }
}