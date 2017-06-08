// @flow
'use strict';

import {Check, If, React, DataType, Record, Repository, Delayed, Utils, Dispatcher, Store} from "../core";


export default class Field {

    _name: string = "";
    _title: ?string = null;
    _value: ?T = null;
    dataType: DataType;
    _readOnly: boolean = false;
    _primaryKey: boolean = false;
    _required: boolean = false;
    _unique: boolean = false;
    _minLength: ?number = null;
    _maxLength: ?number = null;
    _trimmed: boolean = false;
    _textCasing: ?string = TEXT_CASING.NONE; // określa formatowanie tekstu (uppercase/lowercase/capitalize)
    _regex: ?string = null;
    _locked: boolean = false; // blokada możliwości zmiany edycji (tryb REMOTE i SYNCHRONIZED)
    _parent: ?Object = null;
    _error: ?string = null; // błędy walidacji
    _warning: ?string = null; // ostrzeżenie (np. pole wymagane)
    _info: ?string = null; // opis pola
    _store: ?FieldStore = null;
    _enumerate: ?[] = null;
    _multiple: boolean = false;
    _units: ?Map<string, string> = null;
    _unit: ?string = null;

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

    constructor(dataType: DataType) {
        this.dataType = Check.instanceOf(dataType, [DataType]);
        this._enumerate = dataType.enumerate;
        this._multiple = dataType.multiple;
        this._units = dataType.units;
        Object.preventExtensions(this);
    }

    /** Pełny identyfikator pola uwzględniający wszystkie elementy nadrzędne */
    getFullId() {
        if (this._getFullId)
            return this._getFullId();
        return this._name;
    }


    /**
     * Ustaw wartość pola, zweryfikuj poprawność danych
     * @param value
     * @return {Field}
     */
    set(value: ?any = null): Field {
        const prev = this._value;
        if (this._locked)
            throw new Error(`Pole ${this.getFullId()} jest zablokowane`);

        try {
            if (value !== null && value !== undefined)
                value = this.dataType.parse(value);
        } catch (e) {
            e.message = this.getFullId() + ": " + e.message;
            this.error = e.message;
            throw e;
        }

        if (value === this._value)
            return this;
        this.changed = true;
        this._value = value;
        if (this._store && !this._store.validatedOnly)
            this._store.onChange(value);
        this.validate(false);
        if (this._store && this._store.validatedOnly)
            this._store.onChange(value);
        this.onChange.dispatch(this._parent, this, prev);
        return this;
    }

    get(): ?any {
        let val = this._value;
        if (typeof  val === "string") {
            if (this._trimmed)
                val = val.trim();

            switch (this._textCasing) {
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

    title(title: ?string): Field {
        this._title = title;
        return this;
    }

    name(name: ?string): Field {
        this._name = name;
        return this;
    }

    get info(): ?string {
        return this._required ? 'Pole obowiązkowe.\n' + (this._info || '') : this._info;
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

    get textCasing(): ?string {
        return this._textCasing;
    }

    isRequired(): boolean {
        return this._required;
    }


    isEmpty(): boolean {
        if (this._value === null || this._value === undefined || this._value === "")
            return true;
        if (this._enumerate !== null && this._value.length === 0)
            return true;

        return false;
    }

    /** walidacja wartości
     * @param done czy jest to wywołanie na koniec edycji wartości */
    validate(done: boolean) {

        const check = (): ?string => {

            if (this.isEmpty())
                return this._required ? 'Pole obowiązkowe' : null;

            if (this.dataType.simpleType === 'string') {
                //$FlowFixMe
                if (this._minLength && (this._value.length < this._minLength))
                    return "Zbyt krótka wartość (min: " + this._minLength + ")";
                //$FlowFixMe
                if (this._maxLength && (this._value.length > this._maxLength))
                    return "Zbyt długa wartość (max: " + this._maxLength + ")";
                //$FlowFixMe
                if (this._regex && (!this._regex.test(this._value)))
                    return "Niepoprawna wartość";
            }

            if (this.dataType.simpleType === 'number') {
                //$FlowFixMe
                if ((this._minLength !== null) && (this._value < this._minLength))
                //$FlowFixMe
                    return "Zbyt mała wartość (min: " + this._minLength + ")";
                //$FlowFixMe
                if (this._maxLength && (this._value > this._maxLength))
                    return "Zbyt duża wartość (max: " + this._maxLength + ")";
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

    /** Zwraca wartość do postaci, którą może wyświetlić react*/
    getSimpleValue(): string | number | boolean {
        return Field.formatValue(this.get());
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
            return value.toString();

        return Utils.toString(value);
    }

    readOnly(): Field {
        this._readOnly = true;
        return this;
    }

    primaryKey(): Field {
        this._primaryKey = true;
        this._required = true;
        this._unique = true;
        return this;
    }

    required(): Field {
        this._required = true;
        return this;
    }

    unique(): Field {
        this._unique = true;
        return this;
    }

    minLength(value: number): Field {
        this._minLength = value;
        return this;
    }

    maxLength(value: number): Field {
        this._maxLength = value;
        return this;
    }

    regex(value: string): Field {
        this._regex = value;
        return this;
    }

    trimmed(): Field {
        this._trimmed = true;
        return this;
    }

    lowerCase(): Field {
        this._textCasing = TEXT_CASING.LOWERCASE;
        return this;
    }

    upperCase(): Field {
        this._textCasing = TEXT_CASING.UPPERCASE;
        return this;
    }

    capitalize(): Field {
        this._textCasing = TEXT_CASING.CAPITALIZE;
        return this;
    }

    information(info: ?string): Field {
        this._info = info;
        return this;
    }

    setEnumerate(enumerate: [], multiple: boolean = false): Field {
        this._enumerate = enumerate;
        this._multiple = multiple;
        return this;
    }

    setUnits(units: Map<string, string>): Field {
        this._units = units;
        return this;
    }

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