// @flow
'use strict';

import "./DOMPrototype";
import "./Prototype";
import * as Check from "./Check";
import * as If from "./If";

export function toString(argument: any): string {
    if (argument === undefined)
        return "";
    if (argument === null)
        return "null";
    return "" + argument;
}

export function forEachMap(object: ?any, callback: (object: ?any, index: number | string) => ?boolean): [] {
    if (!Check.isFunction(callback))
        throw new Error("Nieprawidłowe wywołanie funkcji forEach");

    const result = [];

    if (object instanceof Array) {
        for (let i = 0; i < object.length; i++) {
            const res = callback(object[i], i);
            if (res !== undefined) result.push(res);
        }
        return result;
    }

    for (let name in object) {
        const res = callback(object[name], name);
        if (res !== undefined) result.push(res);
    }

    return result;
}

export function forEach(object: ?any, callback: (object: ?any, index: number | string) => ?boolean) {
    Check.isFunction(callback, new Error("Nieprawidłowe wywołanie funkcji forEach"));

    if (object instanceof Array) {
        for (let i = 0; i < (object: Array).length; i++)
            if (callback(object[i], i) === false)
                return;
        return;
    }

    for (let name in object)
        if (callback(object[name], name) === false)
            return;

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

/**
 * Definiuje pola jako tylko do odczytu, blokuje możliwość dodawania nowych
 * @param {object} obj
 * @param {string} fieldName
 */

export function makeFinal(obj: any, filter: ?(name: string, value: any) => boolean | string[] = null): any {
    if (!obj) return obj;
    Object.entries(obj).forEach(en => {
        if (If.isFunction(filter) && !filter(en[0], en[1]))
            return;

        if (filter instanceof Array && filter.indexOf(en[0]) === -1)
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
 * Generuje losowy identyfikator w formie UID-a (GUID-a)
 * @return {string}
 */
export function randomUid(): string {
    const uid: string[] = [];
    for (let i = 0; i < 4; i++)
        uid.push((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
    return uid.join("-");
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


/**
 * Formatuje wartość numeryczną rozmiaru danych do postaci wyświetlanej
 * @param {number} size
 * @return {string}
 */
export function formatFileSize(size: number): string {

    function format(base: number): string {
        const val = size / base;
        // $FlowFixMe
        return val.round(val >= 100 ? 0 : val >= 10 ? 1 : 2);
    }

    if (size >= 0x40000000)
        return format(0x40000000) + " GB";
    if (size >= 0x100000)
        return format(0x100000) + " MB";
    if (size >= 0x400)
        return format(0x400) + " KB";
    return size + " B";
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
export function verifyObjectInstance(object: any, instances: any[]): ?string[] {

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



