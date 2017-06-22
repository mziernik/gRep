import {Utils, Check, Field, Repository, Dispatcher, Debug, CRUDE, Exception} from "../core";
import Action from "./Action";

"use strict";

export default class Record {

    $instanceId = Utils.randomId();
    repository: ?Repository = null;
    primaryKey: Field;
    //----------- kluczowe pola --------


    //----------------------------
    static all: Map<String, Repository[]> = new Map();
    fields: Field[] = [];

    initialized: boolean = false;
    onChange: Dispatcher = new Dispatcher(); // (action: Action, changes: Change[]) => void = [];
    /** Lista kopii bieżącego repozytorium w trybie edycyjnym */
    edits: Record[] = [];
    /** Źródłowe repozytorium, z którego utworzono kopię na czas edycji */
    _sourceRecord: ?Record = null;
    _editContext: ?any = null;

    fieldChanged: Dispatcher = new Dispatcher(this);
    /** wartość klucza głównego ustawiana automatycznie podczas dodawania rekordu */
    _primaryKeyValue: ?string | ?number = null;

    /** Rekord nie należący do żadnego repozytorium */
    _temporary: boolean = true;

    /** Nowy rekord */
    _isNew: boolean = false;

    /** Akcja, która ma zostać wykonana na danym repozytorium*/
    _action: ?CRUDE = null;


    constructor(repository: Repository) {
        this.repository = Check.instanceOf(repository, [Repository]);
    }

    /**
     * Inicjalizacja struktury klasy
     * Metoda powinna być wywołana w konstruktorze klasy nadrzędnej
     */
    init(): Record {
        if (this.initialized) return this;
        try {

            // konwertuj pola typu Field na tylko do odczytu
            for (let name in this) {
                const field: Field = this[name];
                if (!(field instanceof Field) || this.fields.contains(field)) continue;

                field._parent = this;
                field.onChange.listen(this, (field: Field, prev: ?any) => {

                    if (this.primaryKey === field) {
                        // Ustawienie wartości klucza głównego
                        const val = field.value;

                        if (val === this._primaryKeyValue)
                            return;

                        const exists = this._isNew ? this.repository.get(val) : null;
                        if (!this._isNew && this._primaryKeyValue)
                            throw new Error("Nie można zmienić wartości klucza głównego " + this.getFullId());

                        if (val === null || val === undefined)
                            throw new Error(`Wartość klucza głównego ${this.getFullId()} nie może być pusta`);

                        this.repository.primaryKeyColumn.type.parse(val);

                        this._primaryKeyValue = val;
                        this.$instanceId += " " + val;

                        if (exists) //this._temporary ? null :
                            throw new Error(`Rekord ${this.getFullId()} już istnieje`);
                    }

                    this.fieldChanged.dispatch(this, field, prev);
                });

                field._getFullId = () => {
                    return this.getFullId() + "." + field.key;
                };

                this.fields.push(field);
                Object.defineProperty(this, name, {
                    value: field,
                    writable: false
                });
            }


            this.primaryKey = this.getFieldF(this.repository.config.primaryKeyColumn);

            if (!this.primaryKey.required)
                throw new Error("Klucz główny musi mieć ustawioną flagę 'required'");

            if (!this.primaryKey.unique)
                throw new Error("Klucz główny musi mieć ustawioną flagę 'unique'");

            // zablokuj możliwość dodawania nowych pól
            Object.preventExtensions(this);
            this.initialized = true;
            return this;
        } catch (e) {
            throw new Exception(this, e);
        }
    }

    /**
     * Rozpocznij edycję rekordu
     * @return {Record}
     */
    beginEdit(context: any): Record {
        const result: Record = this.repository.newRecord();
        result._isNew = false;
        if (this.edits.length)
            Debug.warning(this, `Rekord ${this.getFullId()} jest już edytowany!!!`)
        this.edits.push(result);
        result._sourceRecord = this;
        result._editContext = context;
        this.$instanceId += " [" + Utils.className(context) + "]";

        this.fields.forEach((field: Field) => {
            const dst: Field = result.getFieldF(field.key);
            dst._locked = false;
            dst.set(field.value);
        });

        return result;
    }

    get displayValue(): string {
        return this.displayField ? "" + this.displayField.value : this.getFullId();
    }

    getFieldF(key: string): ?any {
        let result;
        if (key) {
            result = this.fields.find(f => f.key === key);
        }
        if (!result)
            throw new Error(`Nie znaleziono kolumny ${key} repozytorium ${this.repository ? this.repository.key : "???"}`);
        return result;
    }

    cancelEdit(): Record {
        if (!this._sourceRecord)
            throw new Error("Rekord " + this.getFullId() + " nie jest w trybie edycji");
        const result = this._sourceRecord.edits.remove(this);
        this._sourceRecord = null;
        if (!result)
            throw new Error("Nieprawidłowy stan: " + this.getFullId());
        return this;
    }

    getValues(changedOnly: boolean = false): Object {
        const obj = {};
        this.fields.forEach(field => {
            if (field.changed || !changedOnly)
                obj[field.key] = field.value
        });
        return obj;
    }

    toString() {
        const obj = this.getValues(false);
        return JSON.stringify(obj, null, 4);
    }

    getFullId(): string {
        return (this.repository ? this.repository.key : "") + `[${this.primaryKey.name}=${
                this._primaryKeyValue !== null ? JSON.stringify(this._primaryKeyValue) : "???"}]`;
    }

    submit(context: any) {
        Repository.submit(context, [this], true);
    }

    _update(context: any, action: Action, source: Record) {

        if (this._temporary)
            throw new Error(this.getFullId() + ": Nie można aktualizować obiektów tymczasowych");

        const changes = [];

        source.fields.forEach((srcField: Field) => {
            const dstField: Field = this.getFieldF(srcField.key);
            const locked = dstField._locked;
            dstField._locked = false;
            try {
                const src = srcField.value;
                const dst = dstField.value;

                if (src !== dst) {
                    //     changes.push(srcField.key + ": " + JSON.stringify(Field.formatValue(src)) +
                    //         (action === Action.UPDATE ? " -> " + JSON.stringify(Field.formatValue(dst)) : ""));
                    dstField.set(src);
                }
            } finally {
                dstField._locked = locked;
            }
            dstField.changed = false;
        });

        // Debug.group([this, context], (action === Action.UPDATE ? "Aktualizacja rekordu: " : "Nowy rekord: ")
        //     + this.getFullId(), ...changes);

        this.fields.forEach(field => field._locked = true);

        // poinformuj o modyfikacji
        this.onChange.dispatch(this, action, {});

        // zaktualizuj wszystkie kopie repozytorium będące w trybie edycji
        this.edits.forEach(rec => {
            if (rec !== source)
                rec._update(action, source);
        });
    }
}

