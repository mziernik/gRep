import {Utils, Check, Field, Repository, Dispatcher, Debug} from "../core";
import Action from "./Action";

export default class Record {

    "use strict";
    $instanceId = Utils.randomId();

    static all: Map<String, Repository[]> = new Map();
    repository: ?Repository = null;
    fields: Field[] = [];
    primaryKey: Field;
    initialized: boolean = false;
    onChange: Dispatcher = new Dispatcher(); // (action: Action, changes: Change[]) => void = [];
    /** Lista kopii bieżącego repozytorium w trybie edycyjnym */
    edits: Record[] = [];
    /** Źródłowe repozytorium, z którego utworzono kopię na czas edycji */
    _sourceRecord: ?Record = null;
    _editContext: ?any = null;

    /** Rekord tymczasowy nie należący do żądnego repozytorium*/
    fieldChanged: Dispatcher = new Dispatcher(this);
    /** wartość klucza głównego ustawiana automatycznie podczas dodawania rekordu */
    _primaryKeyValue: ?string | ?number = null;

    /** Rekord nie należący do żadnego repozytorium */
    _temporary: boolean = true;


    constructor(repository: Repository) {
        this.repository = Check.instanceOf(repository, [Repository]);
    }

    /**
     * Inicjalizacja struktury klasy
     * Metoda powinna być wywołana w konstruktorze klasy nadrzędnej
     */
    init(): Record {
        if (this.initialized) return this;

        // konwertuj pola typu Field na tylko do odczytu
        for (let name in this) {
            const field: Field = this[name];
            if (!(field instanceof Field)) continue;

            field._parent = this;
            field._name = field._name || name.toLowerCase();
            field.onChange.listen(this, (field: Field, prev: ?any) => {

                if (this.primaryKey === field) {
                    // Ustawienie wartości klucza głównego
                    const val = field.get();

                    if (val === this._primaryKeyValue)
                        return;

                    const exists = this._temporary ? null : this.repository.get(val);
                    if (this._primaryKeyValue)
                        throw new Error("Nie można zmienić wartości klucza głównego " + this.getFullId());

                    if (val === null || val === undefined)
                        throw new Error(`Wartość klucza głównego ${this.getFullId()} nie może być pusta`);

                    this.repository.primaryKeyDataType.parse(val);

                    this._primaryKeyValue = val;
                    this.$instanceId += " " + val;

                    if (exists)
                        throw new Error(`Rekord ${this.getFullId()} już istnieje`);
                }

                this.fieldChanged.dispatch(this, field, prev);
            });

            if (field._primaryKey) {
                if (this.primaryKey)
                    throw new Error(`Zduplikowany klucz główny ${this.primaryKey._name}, ${name}`);
                this.primaryKey = field;
            }

            field._getFullId = () => {
                return this.getFullId() + "." + field._name;
            };

            this.fields.push(field);
            Object.defineProperty(this, name, {
                value: field,
                writable: false,
                enumerable: true,
                configurable: false
            });
        }

        if (!this.primaryKey)
            throw new Error("Brak definicji klucza głównego dla " + this.getFullId());


        // zablokuj możliwość dodawania nowych pól
        Object.preventExtensions(this);
        this.initialized = true;
        return this;
    }

    /**
     * Rozpocznij edycję rekordu
     * @return {Record}
     */
    beginEdit(context: any): Record {
        const result: Record = this.repository.newRecord();
        if (this.edits.length)
            Debug.warning(this, `Rekord ${this.getFullId()} jest już edytowany!!!`)
        this.edits.push(result);
        result._sourceRecord = this;
        result._editContext = context;
        this.$instanceId += " [" + Utils.className(context) + "]";

        this.fields.forEach(field => {
            const dst: Field = result.getFieldF(field._name);
            dst._locked = false;
            dst.set(field.get());
        });

        return result;
    }

    getFieldF(name: string): ?any {
        let result;
        if (name) {
            let s = name.toLowerCase();
            result = this.fields.find(f => f._name.toLowerCase() === s);
        }
        if (!result)
            throw new Error(`Nie znaleziono kolumny ${name} repozytorium ${this.repository ? this.repository.name : "???"}`);
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
                obj[field._name] = field.get()
        });
        return obj;
    }

    toString() {
        const obj = this.getValues(false);
        return JSON.stringify(obj, null, 4);
    }

    getFullId(): string {
        return (this.repository ? this.repository.id : "") + `[${this.primaryKey._name}=${
                this._primaryKeyValue !== null ? JSON.stringify(this._primaryKeyValue) : "???"}]`;
    }

    submit(context: any) {
        Repository.submit(context, [this], true);
    }

    _update(context: any, action: Action, source: Record) {

        if (this._temporary)
            throw new Error("Nie można aktualizować obiektów tymczasowych");

        const changes = [];

        source.fields.forEach((srcField: Field) => {
            const dstField: Field = this.getFieldF(srcField._name);
            const locked = dstField._locked;
            dstField._locked = false;
            try {
                const src = srcField.get();
                const dst = dstField.get();

                if (src !== dst) {
                    changes.push(srcField._name + ": " + JSON.stringify(Field.formatValue(src)) +
                        (action === Action.UPDATE ? " -> " + JSON.stringify(Field.formatValue(dst)) : ""));
                    dstField.set(srcField.get());
                }
            } finally {
                dstField._locked = locked;
            }
            dstField.changed = false;
        });

        Debug.group([this, context], (action === Action.UPDATE ? "Aktualizacja rekordu: " : "Nowy rekord: ")
            + this.getFullId(), ...changes);

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

