import {Utils, Check, If, Field, Repository, Dispatcher, Debug, CRUDE, Exception, Column, ContextObject} from "../core";


"use strict";

export default class Record {

    /** Zdarzenie utworzenia lub aktualizacji rekordu */
    onChange: Dispatcher = new Dispatcher();

    onFieldChange: Dispatcher = new Dispatcher(); // field, prevValue, currValue, wasChanged
    repo: Repository;
    action: CRUDE;
    fields: Map<Column, Field> = new Map();
    _pk: any;
    context: any;

    constructor(repo: Repository, context: any) {
        this.context = Check.isDefined(context);
        this.repo = Check.instanceOf(repo, [Repository]);
        this.repo.refs.push(this);
        ContextObject.add(context, this, () => this.repo.refs.remove(this));
    }

    set row(row: []) {
        this._row = new Array(this.repo.columns.length);
        for (let i = 0; i < this._row.length; i++)
            this.fields.get(this.repo.columns[i]).value = row[i];
    }

    get fullId(): string {
        return this.repo.key + "[" + this.repo.primaryKeyColumn.key + "=" + this.primaryKey.escapedValue + "]";
    }

    _getColumnIndex(col: Column): number {
        const idx: number = this.repo.columns.indexOf(col);
        if (idx < 0)
            throw new Error("Repozytorium " + this.repo.key + " nie posiada kolumny " + col.key);
        return idx;

    }

    get displayName(): string {
        return this.get(this.repo.config.displayNameColumn || this.repo.config.primaryKeyColumn).displayValue;
    }

    /** Zwraca wartość klucza głównego */
    get pk(): any {
        return this._pk || (this._pk = this.primaryKey.value);
    }

    /** Zwraca pole klucza głównego */
    get primaryKey(): Field {
        return Check.isDefined(this.fields.get(this.repo.primaryKeyColumn), new Error("Brak klucza głównego"));
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

    /** Walidacja danych - do przeciążenia */
    validate() {

    }

    get dto(): object {
        const dto: Object = {};
        this.fields.forEach((field: Field) => dto[field.key] = field.config.type.serialize(field.value));
        return dto;
    }

}