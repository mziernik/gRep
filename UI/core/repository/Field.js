// @flow
'use strict';

import {Check, If, React, Type, Record, Repository, Delayed, Utils, Dispatcher, Store} from "../core";
import {DataType} from "./Type";


export class FieldConfig {
    type: ?DataType = null;
    key: ?string = null;
    name: ?string = null;
    subtitle: ?string = null;
    hint: ?string = null;
    description: ?string = null;
    enumerate: ?() => Map = null;
    units: ?() => {} = null;
    readOnly: ?boolean = null;
    required: ?boolean = null;
    unique: ?boolean = null;
    min: ?number = null;
    max: ?number = null;
    regex: ?string = null;
    autoGenerated: ?boolean = null;
    trimmed: ?boolean = null;
    defaultValue: ?any = null;
    defaultUnit: ?[] = null; //domyślna jednostka [klucz, tekst, mnożnik]
    //ToDo: Parsowanie ze stringa
    textCasing: ?string = TEXT_CASING.NONE; // określa formatowanie tekstu (uppercase/lowercase/capitalize)
    validator: ?(value: any) => void = null;

    sortable: ? boolean = null;
    sortOrder: ? boolean = null;
    filterable: ? boolean = null;
    hidden: ? boolean = null;
    compare: ?(a: ?any, b: ?any) => number = null;
    filter: ?(filter: ?any, cell: ?any) => boolean = null;

    foreign: ?Repository = null;

    constructor() {
        if (!(this instanceof Field))
            Object.preventExtensions(this);
    }
}

export default class Field extends FieldConfig {

    _locked: boolean = false; // blokada możliwości zmiany edycji (tryb REMOTE i SYNCHRONIZED)
    _parent: ?Object = null;
    _error: ?string = null; // błędy walidacji
    _warning: ?string = null; // ostrzeżenie (np. pole wymagane)
    _store: ?FieldStore = null;
    _unit: ?[] = null;


    _value: ?T = null;

    /** Walidator wartości
     * @type value wartość do zwalidatowania
     * @type done czy jest to wywołanie na koniec edycji
     * @return prawda jeśli jest ok, w innym przypadku false
     */
    validator: ?(value: ?any, done: boolean) => boolean = null;

    /** Lista handlerów błędów walidacji */
    onError: Dispatcher = new Dispatcher(this);
    /** Lista handlerów ostrzeżeń walidacji */
    onWarning: Dispatcher = new Dispatcher(this);

    /** Lista handlerów zdarzenia zmiany wartości */
    onChange: Dispatcher = new Dispatcher(this);

    /** Zawartość pola uległa zmianie */
    changed: boolean = false;

    _getFullId: ?() => string = null;

    constructor(config: (cfg: FieldConfig) => void) {
        super();

        const cfg: FieldConfig = new FieldConfig();
        Check.isFunction(config);
        config(cfg);


        If.isString(cfg.type, t => cfg.type = Type.get(t));
        Check.instanceOf(cfg.type, [Type.DataType]);

        Check.nonEmptyString(cfg.key);
        Check.nonEmptyString(cfg.name);

        cfg.hint = cfg.hint || cfg.name;

        if (cfg.type.enumerate && !cfg.enumerate)
            cfg.enumerate = () => cfg.type.enumerate;

        if (cfg.enumerate && !If.isFunction(cfg.enumerate)) {
            const arr = cfg.enumerate instanceof Array;
            const map: Map = new Map();
            Utils.forEach(cfg.enumerate, (value, key) => {
                if (arr) {
                    key = value;
                    if (value instanceof Array) {
                        key = value[0];
                        value = If.isDefined(value[1]) ? value[1] : key;
                    }
                }
                map.set(key, value);
            });
            cfg.enumerate = () => map;
        }


        if (cfg.type.units && !cfg.units)
            cfg.units = () => cfg.type.units;

        If.isDefined(cfg.enumerate, e => Check.isFunction(e));
        If.isDefined(cfg.units, e => Check.isFunction(e));

        if (cfg.foreign) {
            Check.instanceOf(cfg.foreign, [Repository]);
            cfg.enumerate = () => {
                const map: Map = new Map();
                Utils.forEach(cfg.foreign.items, (rec: Record) => map.set(rec._primaryKeyValue, rec.displayValue));
                return map;
            }
        }

        for (let name in cfg) {
            if (this[name] === undefined)
                throw new Error("Pole " + name + " nie istnieje");

            Object.defineProperty(this, name, {
                value: cfg[name],
                writable: false
            });
        }


        If.isDefined(cfg.defaultValue, val => this.value = val);
        If.isDefined(cfg.defaultUnit, unit => this._unit = unit);

        Object.preventExtensions(this);
    }

    /** Pełny identyfikator pola uwzględniający wszystkie elementy nadrzędne */
    getFullId() {
        if (this._getFullId)
            return this._getFullId();
        return this.key;
    }


    /**
     * Ustaw wartość pola, zweryfikuj poprawność danych
     * @param value
     * @return {Field}
     */
    set(value: ?any = null, done: boolean = false): Field {
        const prev = this._value;
        if (this._locked)
            throw new Error(`Pole ${this.getFullId()} jest zablokowane`);
        if (value !== null && value !== undefined && this.unit && this.type.simpleType === 'number')
            value *= this.unit[2];

        if (!done)
            if (value === this._value)
                return this;

        if (value !== null && value !== undefined)
            try {
                value = this.type.parse(value);
                If.isFunction(this.validator, f => f(value));
            } catch (e) {
                e.message = this.getFullId() + ": " + e.message;
                this.error = e.message;
                throw e;
            }

        this.changed = true;
        this._value = value;
        this.validate(done);

        if (this._store && !this._store.validatedOnly)
            this._store.onChange(value);
        if (this._store && this._store.validatedOnly)
            this._store.onChange(value);

        this.onChange.dispatch(this._parent, this, prev);
        return this;
    }

    set value(value: ?any) {
        this.set(value);
    }

    get value(): ?any {
        let val = this._value;
        if (typeof  val === "string") {
            if (this.trimmed)
                val = val.trim();

            switch (this.textCasing) {
                case TEXT_CASING.LOWERCASE:
                    val = val.toLowerCase();
                    break;
                case TEXT_CASING.UPPERCASE:
                    val = val.toUpperCase();
                    break;
                default:
                    break;
            }
        }
        return val;
    }

    set unit(value: ?[]) {
        let val = this.unitValue;
        this._unit = value;
        this.value = val;
    }

    get unit(): ?[] {
        return this._unit;
    }

    get isValid(): boolean {
        return this.readOnly || ( !(this._error) && (!this.required || this._value));
    }

    get warning(): ?string {
        return this._warning;
    }

    set warning(war: ?string) {
        const prev = this._warning;
        this._warning = war;
        if (war !== prev)
            this.onWarning.dispatch(this._parent, this._warning, prev);
    }

    get error(): ?string {
        return this._error;
    }

    set error(err: ?string) {
        const prev = this._error;
        this._error = err;
        if (err !== prev)
            this.onError.dispatch(this._parent, this._error, prev);
    }

    get isEmpty(): boolean {
        if (this._value === null || this._value === undefined || this._value === "")
            return true;
        if (this._enumerate !== null && this.type.multiple && this._value.length === 0)
            return true;

        return false;
    }

    /** walidacja wartości
     * @param done czy jest to wywołanie na koniec edycji wartości */
    validate(done: boolean) {
        if (!this.changed)return null;
        const check = (): ?string => {

            if (this.isEmpty)
                return this.required ? 'Pole obowiązkowe' : null;

            if (this.type.simpleType === 'string') {
                //$FlowFixMe
                if (this.min && (this._value.length < this.min))
                    return "Zbyt krótka wartość (min: " + this.min + ")";
                //$FlowFixMe
                if (this.max && (this._value.length > this.max))
                    return "Zbyt długa wartość (max: " + this.max + ")";
                //$FlowFixMe
                if (this.regex && (!this.regex.test(this._value)))
                    return "Niepoprawna wartość";
            }

            if (this.type.simpleType === 'number') {
                //$FlowFixMe
                if ((this.min !== null) && (this._value < this.min))
                //$FlowFixMe
                    return "Zbyt mała wartość (min: " + this.min + ")";
                //$FlowFixMe
                if (this.max && (this._value > this.max))
                    return "Zbyt duża wartość (max: " + this.max + ")";
            }

            return null;
        };

        let err = check();

        if (If.isFunction(this.validator))
            try {
                //$FlowFixMe
                if (!this.validator(this._value, done)) {
                    this.error = "Nieprawidłowa wartość";
                    return false;
                }
            } catch (e) {
                this.error = e.message;
                return false;
            }

        this.error = err;

        return !err;
    }


    toString() {
        //$FlowFixMe
        return "" + this._value;
    }

    /** Zwraca wartość przeliczoną przez jednostkę
     * @returns {?T}
     */
    get unitValue(): ?any {
        let val = this._value;
        if (val !== null && val !== undefined && this.unit && this.type.simpleType === 'number')
            val /= this.unit[2];
        return val;
    }

    /** Zwraca przeliczoną wartość, którą może wyświetlić react
     * @returns {string|number|boolean}
     */
    get displayValue(): string | number | boolean {

        const value = this.value;
        if (value === null)
            return null;

        const val = this.unitValue;

        // wartość przed formatowaniem jest identyczna jak po formatowaniu
        if (val === this._value)
            return Field.formatValue(this.type.formatDisplayValue(val, this.enumerate ? this.enumerate() : null));

        let res = Field.formatValue(val);
        if (this.unit) res += " " + this.unit[0];
        return res;
    }

    /** Zwraca wartość, którą może wyświetlić react
     * @returns {string|number|boolean}
     */
    get simpleValue(): string | number | boolean {
        return Field.formatValue(this.value);
    }

    /** Formatuje wartość do postaci, którą może wyświetlić react*/
    static formatValue(value: any): string | number | boolean {
        if (value === null || value === undefined)
            return null;

        switch (typeof value) {
            case "string":
            case "number":
            case "boolean":
                return value;
        }

        if (value instanceof Repository)
            return (value: Repository).name;

        if (value instanceof Record)
            return (value: Record).getFullId();

        if (value instanceof Date)
            return value.toLocaleString();

        if (value instanceof Array)
            return Utils.forEach(value, val => Field.formatValue(val)).join(", ");

        if (value instanceof Map)
            return Utils.forEach(value, (val, key) => Field.formatValue(key) + ": " + Field.formatValue(val)).join(", ");

        return Utils.toString(value);
    }


    //FixMe: Miłosz: Przenieść do konfiguracji
    store(key: string, store: Store = Store.local): Field {
        this._store = new FieldStore(this, key, store);
        let val = this._store.load();

        if (val !== undefined)
            this.set(val);

        return this;
    }

    /**
     *  Mapowanie wartości typu tablica lub elementy repozytorium na inną tablicę. Przydatne w komponentach reacta
     *  */
    map(func: (item: any, index: number) => void): Array {

        // nie można użyć (this._value instanceof Repository) bo występuje import krzyżowy
        if (Utils.className(this._value) === "Repository")
            return this._value.items.map(func);

        if (this._value instanceof Array)
            return this._value.map(func);

        return [];
    }
}

export const TEXT_CASING = {
    NONE: null,
    UPPERCASE: 'uppercase',
    LOWERCASE: 'lowercase',
    CAPITALIZE: 'capitalize'
};

class FieldStore {

    _field: Field;
    _value: ?any;
    /** Nazwa pola pod w którym zostanie zapisana wartość */
    key: string;

    /** Magazyn docelowy */
    store: Store = Store.session;

    /** Zapisuj tylko wartości, które przeszły walidację */
    validatedOnly: boolean = true;

    /** Zapisuj automatycznie wartość w momencie zmiany */
    autoSave: boolean = true;

    /** Czy zapisywać wartość w postaci zakodowanej (base64) (np na potrzeby zapisu hasła) */
    encode: boolean = false;

    _delayedSave: Delayed = new Delayed(() => this.save(), 100);

    constructor(field: Field, key: string, store: Store = Store.local) {
        this._field = field;
        this.key = key;
        this.store = store;
    }

    save(): FieldStore {
        if (!this.key || !this.store)
            return this;
        this.store.set(this.key, this._value, this.encode);
        return this;
    }

    load(): ?any {
        if (!this.key || !this.store)
            return undefined;
        this._value = this.store.get(this.key);
        return this._value;
    }

    onChange(value: ?any) {
        this._value = value;
        if (this.autoSave)
            this._delayedSave.run();
    }

}