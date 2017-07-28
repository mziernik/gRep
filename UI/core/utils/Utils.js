// @flow
'use strict';

import "./DOMPrototype";
import "./Prototype";
import * as Check from "./Check";
import * as If from "./Is";
import * as Dev from "../Dev";

/** dowolne mapowania (np klas na potrzeby uglify, importów itp) */
export const MAPPING: Map<String, any> = new Map();

export function randomOfRange(min: number, max: number) {
    let rand = Math.random() * (max - min);
    return Math.round(min + rand);
}

export function escape(argument: any): string {
    try {
        return JSON.stringify(argument);
    } catch (e) {
        window.console.warn(e);
        return toString(argument);
    }
}

/** Zwraca [arg] jeśli jest tablicą, w przeciwnym razie opakowuje go w tablicę*/
export function asArray(elm: any): [] {
    if (elm === undefined || elm === null) return [];
    if (elm instanceof Array)
        return elm;

    const type = typeof(elm);

    if (type !== "string" && typeof elm[Symbol.iterator] === 'function')
        return Array.from(elm);

    return [elm];

}

export function toString(argument: any): string {
    if (argument === undefined)
        return "";
    if (argument === null)
        return "null";

    if (typeof argument.toString === "function")
        return argument.toString();

    if (argument.constructor && argument.constructor.name)
        return argument.constructor.name;

    return "" + argument;
}

class ForEach {

    _break: boolean = false;

    break() {
        this._break = true;
    }
}

export function find(object: ?any, callback: (object: ?any, index: number | string) => ?boolean) {
    return forEach(object, (obj, idx, fe) => {
        if (callback(obj, idx)) {
            fe.break();
            return obj;
        }
    }) [0];
}

/***
 * Wariant bezpieczny funkcji iterującej - iteruje na kopii obiektu, dzięki czemu w trakcie można modyfikować kolekcję
 * @param object
 * @param callback
 * @return {Array}
 */
export function forEachSafe(object: ?any, callback: (object: ?any, index: number | string, forEach: ForEach) => ?any): [] {

    const items = [];
    forEach(object, (item, index) => items.push([item, index]));

    const result = [];

    for (let i = 0; i < items.length; i++) {
        const res = callback(items[i][0], items[i][1], forEach);
        if (res !== undefined) result.push(res);
        if (forEach._break) return result;
    }
    return result;
}

export function forEach(object: ?any, callback: (object: ?any, index: number | string, forEach: ForEach) => ?any): [] {
    if (!Check.isFunction(callback))
        throw new Error("Nieprawidłowe wywołanie funkcji forEach");

    const result = [];
    const forEach: ForEach = new ForEach;

    if (If.func(object))
        object = object();

    if (object instanceof Array) {
        for (let i = 0; i < (object: Array).length; i++) {
            const res = callback(object[i], i, forEach);
            if (res !== undefined) result.push(res);
            if (forEach._break) return result;
        }
        return result;
    }

    if (object instanceof Set) {
        let i = 0;
        for (const value of object) {
            const res = callback(value, i++, forEach);
            if (res !== undefined) result.push(res);
            if (forEach._break) return result;
        }
        return result;
    }

    if (object instanceof Map) {
        for (const [key, value] of object) {
            const res = callback(value, key, forEach);
            if (res !== undefined) result.push(res);
            if (forEach._break) return result;
        }
        return result;
    }


    for (let name in object) {
        const res = callback(object[name], name, forEach);
        if (res !== undefined) result.push(res);
        if (forEach._break) return result;
    }

    return result;
}

export function format(value: any, formatter: (value: any) => any): any {
    return typeof formatter === "function" ? formatter(value) : value;
}

/**
 * Tworzy tag [style] w sekcji [head] i ustawia treść [content]
 * @param {string} content
 * @returns {HTMLStyleElement}
 */
export function importHeadStyle(content: string): HTMLElement | null {
    if (!content)
        return null;
    const tag = window.document.createElement("style");
    tag.innerHTML = content;
    window.document.head.appendChild(tag);
    return tag;
}

export function className(object: any): string {
    // Zwraca nazwę klasy obiektu

    if (typeof object === "function" && object.name)
        return object.name;

    if (typeof object !== "undefined"
        && object !== null
        && object.constructor
        && object.constructor.name)
        return object.constructor.name;
    return typeof object;
}

/**
 * Mierzy czas trwania funkcji [callback]
 * @param {string} name
 * @param {function} callback
 * @returns {undefined}
 */
export function duration(name: string, callback: () => any): void {
    const ts = new Date().getTime();
    callback();
    console.log(name + ": " + (new Date().getTime() - ts));
}


export function clone(src: any, dst: ?any = null): any {
    if (!src)
        return {};
    if (src === dst)
        throw new Error("Identyczne instancje obiektów");
    dst = dst || new src.constructor();
    Object.assign(dst, src);
    return dst;
}

/**
 * Definiuje pola jako tylko do odczytu, blokuje możliwość dodawania nowych
 * @param {object} obj
 * @param {string} fieldName
 */

export function makeFinal(obj: any, filter: ?(name: string, value: any) => boolean | string | string[] = null): any {
    if (!obj) return obj;
    Object.entries(obj).forEach(en => {
        if (If.func(filter) && !filter(en[0], en[1]))
            return;

        if (filter instanceof Array && filter.indexOf(en[0]) === -1)
            return;

        if (typeof filter === "string" && en[0] !== filter)
            return;

        const prop = Object.getOwnPropertyDescriptor(obj, en[0]);

        Object.defineProperty(obj, en[0], {
            value: en[1],
            writable: false,
            enumerable: prop.enumerable,
            configurable: prop.configurable
        });
    });
    return obj;
}


export function setReadOnly(object: Object, key: string, value: ?any, checkInstance: ?[] = null): any {
    if (checkInstance)
        Check.instanceOf(value, checkInstance);

    Object.defineProperty(object, key, {
        value: value,
        writable: false
    });
    return value;
}

export function agregate(object: any, aggregator: (element: any) => any): Map<*, []> {
    const result: Map<*, []> = new Map();

    forEach(object, (element: any) => {
        const base = aggregator(element);
        if (base === null || base === undefined) return;

        if (result.has(base))
            result.get(base).push(element);
        else
            result.set(base, [element]);
    });
    return result;
}

/**
 * Pobierz wartość ciastka na podstawie nazwy. Funkcja bazuje na kodowaniu URI
 * @param {string} name
 * @return {string|null}
 */
export function getCookie(name: string): string | null {
    let i, x, y, arr = document.cookie.split(";");
    for (i = 0; i < arr.length; i++) {
        x = arr[i].substr(0, arr[i].indexOf("="));
        y = arr[i].substr(arr[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x === name)
            return decodeURIComponent(y);
    }
    return null;
}

/**
 * Ustaw wartość ciastka, kodowanie URI
 * @param {string} name
 * @param {string} value
 * @param {number} exdays
 * @param {boolean} httpOnly
 */
export function setCookie(name: string, value: string, exdays: number, httpOnly: boolean = false) {
    let exp: ?Date = null;
    if (!isNaN(exdays)) {
        exp = new Date();
        exp.setDate(new Date().getDate() + exdays);
    }
    document.cookie = name + "=" + encodeURIComponent(value)
        + (exp ? "; expires=" + exp.toUTCString() : "")
        + (httpOnly ? +"; HttpOnly" : "");
}


/**
 * Generuje losowy identyfikator w formie UID-a (GUID-a)  8-4-4-4-12

 * @return {string}
 */
export function randomUid(): string {
    const r = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r();
}


/**
 * Generuje losowy identyfikator złożony ze znaków alfanumerycznych ASCII a zadanej długości
 * @param {number} length Długość identyfikatora - ilość znaków
 * @return {string}
 */
export function randomId(length: number = 10) {
    const chars = "abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890";
    const id: string[] = [];
    for (let i = 0; i < length; i++)
        id.push(chars[Math.floor(Math.random() * (chars.length - (i === 0 ? 10 : 0)))]);
    return id.join("");
}

/** formatuje zapis liczbowy uwzględniając jednostkę. Jednostki muszą być zadeklarowane w kolejności malejącej!!! */
export function formatUnits(value: number, units: {}): string {

    let prevU;
    let prevN;

    for (let name in units) {
        let u: number = units[name];
        if (value < u) {
            prevU = u;
            prevN = name;
            continue;
        }
        if (u === 0)
            return "0";

        let val = value / u;

        if (val >= 1000) {
            // korekta dla rozmiaru w bajtach (1024)
            u = prevU;
            name = prevN;
            val = value / u;
        }

        // $FlowFixMe
        return val.round(val >= 100 ? 0 : val >= 10 ? 1 : 2) + " " + name;
    }

    return null;
}


/**
 * Formatuje wartość numeryczną rozmiaru danych do postaci wyświetlanej
 * @param {number} size
 * @return {string}
 */
export function formatTime(timeMS: number): string {
    return formatUnits(timeMS, {
        h: 24 * 60 * 1000,
        m: 60 * 1000,
        s: 1000,
        ms: 0
    });
}

/**
 * Formatuje wartość numeryczną rozmiaru danych do postaci wyświetlanej
 * @param {number} size
 * @return {string}
 */
export function formatFileSize(size: number): string {
    return formatUnits(size, {
        GB: 0x40000000,
        MB: 0x100000,
        KB: 0x400,
        B: 0
    });
}

export function formatId(value: string) {
    const CHARS = "abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890";

    value = toString(value);
    if (!value) return value;

    let result = "";
    for (let i = 0; i < value.length; i++) {
        const char = value.charAt(i);
        if (CHARS.indexOf(char) >= 0)
            result += char;
    }
    return result;
}

export function trimFileName(name: string, length: number): string {
    if (!name || !length)
        return name;
    name = name.trim();
    if (name.length <= length)
        return name;
    if (name.indexOf(".") > 0) {
        let ext = name.substring(name.lastIndexOf("."), name.length);
        name = name.substring(0, name.length - ext.length);
        name = name.substring(0, length - ext.length - 1).trim();
        return name + "\u2026" + ext;
    }

    return name.substring(0, length - 1).trim() + "\u2026";
}


/*
 Odnajduje w tekscie linki i formatuje je do postaci odnosnikow
 */
export function linkify(text: string): string {
    if (!(typeof text === "string"))
        return text;
    let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~$_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}

/**
 * Zwraca pierwszy argument, który jest różny od undefined i null-a
 * @param {any[]}args
 * @return {any}
 */
export function coalesce(...args): any {
    // zwraca pierwszy z argumentów metody, który jest zdefiniowany i nie jest null-em
    for (let i = 0; i < args.length; i++)
        if (args[i] !== null && args[i] !== undefined)
            return args[i];
    return null;
}


//Breakpoint on access to a property, eg debugAccess(document, 'cookie');
export function debugAccess(obj: any, prop: string, debugGet: boolean = false): void {
    let origValue = obj[prop];
    Object.defineProperty(obj, prop, {
        get: function () {
            if (debugGet)
                debugger;
            return origValue;
        },
        set: function (val) {
            debugger;
            return origValue = val;
        }
    });
}


/**
 * Funkcja parsuje obiekty JSON w notacji JavaScript (np bez cudzysłowów w kluczach)
 * @param {string} text
 */
export function jsonParse(text: string): any {
    let trim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
    text = text.replace(trim, "");

    if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ":")
            .replace(/\w*\s*:/g, ":")))
        return (new Function("return " + text))();

    throw "Invalid JSON: " + text;
}


/** Zwraca nazwę kontekstu z obiektu */
export function getContextName(object: any): string {
    if (object === null || object === undefined)
        return null;

    switch (typeof object) {
        case "string":
            return object;
        case "boolean":
            return "" + object;
        case "number":
            return "" + object;
    }

    if (object instanceof Array)
        return (object: Array).map(item => getContextName(item)).join(", ");

    return className(object);
}

/**
 * Zwraca nulla jeśli [object] pasuje do którejś instancji lub tablicę nazw wykorzystywaną do wyświetlenia komunikatu błędu
 * @param object
 * @param instances
 * @return {*}
 */
//ToDo: Problemy wydajnościowe
export function verifyObjectInstance(object: any, instances: any[]): ?string[] {

    if (!Dev.DEV_MODE)
        return null;

    Check.isArray(instances, new Error("Wymagana tablica"));

    const names = [];

    for (let i = 0; i < instances.length; i++) {
        let arg = instances[i];
        if ((arg === undefined && object === undefined) || (arg === null && object === null))
            return null;

        if (!arg)
            continue;
        if (typeof arg === "function" || typeof arg === "object") {
            arg = arg.name || arg.toString();
            if (arg.startsWith("function") && arg.contains("("))
                arg = arg.substring("function".length, arg.indexOf("(")).trim();
        }

        if (typeof arg !== 'string')
            arg = arg.toString();
        names.push(arg);
    }


    if (instances.length === 0)
        return null;

    if (object === null || object === undefined)
        return names;


    const clsName = className(object).toLowerCase();
    for (let i = 0; i < names.length; i++)
        if (names[i].toLowerCase() === clsName)
            return null;

    let constr = object.constructor;
    while (constr) {
        for (let i = 0; i < names.length; i++)
            if (names[i] === constr.name)
                return null;
        constr = constr.__proto__;
    }

    return names;
}

/** zaokrągla liczbę do określonej precyzji
 * @param a liczba do zaokrąglenia
 * @param precision liczba cyfr po przecinku
 * @returns {number}
 */
export function round(a: number, precision: number = 2): number {
    precision = Math.pow(10, precision);
    a = Math.round(a * precision);
    return a / precision;
}

export class AtomicNumber {

    value = 0;

    get next(): number {
        return ++this.value;
    }

    get prev(): number {
        return --this.value;
    }
}

/** klasa budująca filtr */
export class CustomFilter {
    static OPERATIONS = {
        AND: '&&',
        OR: '||'
    };

    static TYPES = {
        EQUAL: '===',
        BIGGER: '>',
        SMALLER: '<'
    };

    operation: string = CustomFilter.OPERATIONS.AND;
    type: string = CustomFilter.TYPES.EQUAL;
    value: ?any; //wartość filtru
    negation: boolean = false; //negacja wyniku
    conditions: [] = []; //warunki [CustomFilter]

    /** konstruktor
     * @param value wartość do której ma być porównanie
     * @param type typ porównania CustomFilter.TYPES
     * @param operation typ operacji (łączenia warunków) CustomFilter.OPERATIONS
     * @param negation czy negacja warunku
     */
    constructor(value, type = null, operation = null, negation = false) {
        this.value = value;
        this.type = type || CustomFilter.TYPES.EQUAL;
        this.operation = operation || CustomFilter.OPERATIONS.AND;
        this.negation = negation;
    }

    /** dodaje n warunków
     * @param CustomFilter warunki
     * @returns {CustomFilter} this
     */
    addCondition([...CustomFilter]): CustomFilter {
        forEach(arguments, (arg) => this.conditions.push(arg));
        return this;
    }

    /** Tworzy warunek && (x > value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static andBigger(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.TYPES.BIGGER, CustomFilter.OPERATIONS.AND, negation);
    }

    /** Tworzy warunek || (x > value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static orBigger(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.TYPES.BIGGER, CustomFilter.OPERATIONS.OR, negation);
    }

    /** Tworzy warunek && (x < value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static andSmaller(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.TYPES.SMALLER, CustomFilter.OPERATIONS.AND, negation);
    }

    /** Tworzy warunek || (x < value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static orSmaller(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.TYPES.SMALLER, CustomFilter.OPERATIONS.OR, negation);
    }

    /** Tworzy warunek && (x === value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static andEqual(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.TYPES.EQUAL, CustomFilter.OPERATIONS.AND, negation);
    }

    /** Tworzy warunek || (x === value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static orEqual(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.TYPES.EQUAL, CustomFilter.OPERATIONS.OR, negation);
    }

    /** wykonuje filtr
     * @param val wartość, która ma być sprawdzona
     * @param compareFn funkcja porównująca np.: (a,b)=>a-b;
     * @returns {boolean}
     */
    filter(val, compareFn: (a, b) => number): boolean {
        if (!compareFn) compareFn = CustomFilter.defaultCompareFn(typeof(val));
        if (!If.func(compareFn)) throw new Error("Brak poprawnej funkcji 'compareFn'");

        let res = false;
        switch (this.type) {
            case CustomFilter.TYPES.EQUAL:
                res = compareFn(val, this.value) === 0;
                break;
            case CustomFilter.TYPES.SMALLER:
                res = compareFn(val, this.value) < 0;
                break;
            case CustomFilter.TYPES.BIGGER:
                res = compareFn(val, this.value) > 0;
                break;
            default:
                res = compareFn(val, this.value) === 0;
                break;
        }

        if (this.negation) res = !res;
        forEach(this.conditions, (condition: CustomFilter) => {
            switch (condition.operation) {
                case CustomFilter.OPERATIONS.AND:
                    res = res && condition.filter(val, compareFn);
                    break;
                case CustomFilter.OPERATIONS.OR:
                    res = res || condition.filter(val, compareFn);
                    break;
                default:
                    break;
            }
        });
        return res;
    }

    /** zwraca podstawową funkcję porównania dla danego typu prostego
     * @param type typ prosty string|number|boolean
     * @returns {*}
     */
    static defaultCompareFn(type: string): ?(a, b) => number {
        switch (type) {
            case 'number':
                return (a, b) => a - b;
            case 'boolean':
                return (a, b) => {
                    if (a === b) return 0;
                    if (a === null || a === undefined) return 1;
                    if (b === null || b === undefined) return -1;
                    return a ? -1 : 1;
                };
            case 'string':
                // ToDo obsługa polskich znaków
                return (a, b) => {
                    a = a ? a.toLowerCase() : a;
                    b = b ? b.toLowerCase() : b;
                    if (a === b) return 0;
                    if (a === null || a === undefined) return 1;
                    if (b === null || b === undefined) return -1;
                    if (a > b) return 1;
                    return -1;
                };
            default:
                return null;
        }
    }

    /** tekstowa reprezentacja zbudowanego warunku
     * @param x sprawdzana wartość. Tylko dla reprezentacji
     * @param cut czy obciąć dodatkowe warunki
     * @returns {string}
     */
    toString(x: string = '$x', cut: boolean = false): string {
        let res = x + ' ' + this.type + ' ' + this.value;
        if (this.negation)
            res = '!(' + res + ')';
        if (!cut)
            forEach(this.conditions, (condition: CustomFilter) => {
                res = res + ' ' + condition.operation + ' (' + condition.toString(x) + ')'
            });
        return res;
    }
}

