import {
    Utils,
    Check,
    Is,
    Field,
    Repository,
    Dispatcher,
    Debug,
    CRUDE,
    Exception,
    Column,
    ContextObject,
    Endpoint
} from "../core";


"use strict";
import {RepoCursor, RepoReference} from "./Repository";

export default class Record {

    /** Zdarzenie utworzenia lub aktualizacji rekordu */
    onChange: Dispatcher = new Dispatcher(); // action: CRUDE, changes: Map

    onReferenceChange: Dispatcher = new Dispatcher();
    onFieldChange: Dispatcher = new Dispatcher(); // field, prevValue, currValue, wasChanged
    repo: Repository;
    action: ?CRUDE = null;
    fields: Map<Column, Field> = new Map();
    _pk: any;
    context: any;
    changedReferences: Record[] = [];
    endpoint: Endpoint; // endpoint edycyjny rekordu
    _row: [] = null;

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

    get lastUpdate(): ?number { //timestamp ostatniej aktualizacji wiersza
        return this.repo.recordsUpdateTsMap.get(this.pk);
    }

    set row(row: []) {
        this._row = new Array(this.repo.columns.length);
        for (let i = 0; i < this._row.length; i++) {
            const field: Field = this.fields.get(this.repo.columns[i]);
            field.value = row[i];
            field.changed = false;
            this._row[i] = row[i];
        }
    }

    get fullId(): string {
        return this.repo.key + "[" + this.repo.primaryKeyColumn.key + "=" + this.primaryKey.escapedValue + "]";
    }


    get displayValue(): string {
        return this.repo.getDisplayValue(this);
    }

    /** Zwraca wartość klucza głównego */
    get pk(): any {
        return this._pk || (this._pk = this.primaryKey.value);
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
        Utils.forEach(refs, (rr: RepoReference) =>
            rr.records.addAll(rr.repo.find(this, (cursor: RepoCursor) => cursor.get(rr.column) === pk)));
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

    get(col: Column): Field {
        const field: Field = this.fields.get(col);
        if (!field)
            throw new Error("Repozytorium " + this.repo.key + " nie posiada kolumny " + col.key);
        return field;
    }

    getValue(col: Column): any {
        if (!this._row)
            throw new `Rekord ${this.fullId} nie ma przypisanych danych`;

        const idx: number = this.repo.columns.indexOf(col);
        if (idx < 0)
            throw new Error("Repozytorium " + this.repo.key + " nie posiada kolumny " + col.key);
        return this._row[idx];
    }

    /** Walidacja danych - do przeciążenia */
    validate() {

    }

    get dto(): object {
        const dto: Object = {};
        this.fields.forEach((field: Field) => dto[field.key] = field.config.type.serialize(field.value));
        return dto;
    }

    getForeign(context: any, column: Column | Field): Record | Record[] {
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
}

class RecordError extends Error {

    constructor(record: Record, message: string) {
        super(record.fullId + ": " + Utils.toString(message))
    }
}

export class RecordDataGenerator {


    fields: Field[];
    context: any;
    /**  Czy dane mają mieć charakter stały czy losowy */
    random: boolean;
    /** Czy wypełniać wszystkie pola czy tylko te, które są wymagane */
    all: boolean;
    /** Dane przetwarzane sekwencyjnie / grupowo*/
    sequence: boolean;
    /** Łączna ilość rekordów */
    total: number;
    /** Losowy identyfikator instancji funkcji generującej dane */
    instance: string;

    constructor() {

        this.instance = Utils.randomId(4);

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

            if (ref && ref.changed)
                return field.value = ref.value;

            if ((!field.config.required || field.config.autoGenerated ) && !this.all) return;

            const rand = this.random ? Math.random() : null;

            let enm: Map = field.enumerate;
            if (enm)
                return field.value = Utils.asArray(enm().keys()).random();

            switch (field.config.type.name) {
                case "uid":
                case "guid":
                    return field.value = Utils.randomUid();
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