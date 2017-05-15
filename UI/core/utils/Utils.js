// @flow
'use strict';

import "./DOMPrototype";
import "./Prototype";

type InstanceType = string | string[] | mixed | mixed[];

export default class Utils {

    static toString(argument: any): string {
        if (argument === undefined)
            return "";
        if (argument === null)
            return "null";
        return "" + argument;
    }


    static forEach(object: ?any, callback: (object: ?any, index: number | string) => ?boolean) {
        if (!object || !Utils.isFunction(callback)) return;

        if (object instanceof Array) {
            for (let i = 0; i < object.length; i++)
                if (callback(object[i], i) === false)
                    return;
            return;
        }

        for (let name in object)
            for (let i = 0; i < object.length; i++)
                if (callback(object[name], name) === false)
                    return;

    }

    static isArray(object: ?any): boolean {
        return typeof object === "array";
    }

    static isObject(object: ?any): boolean {
        return typeof object === "object";
    }


    static isFunction(object: ?any): boolean {
        return typeof object === "function";
    }

    /**
     * Tworzy tag [style] w sekcji [head] i ustawia treść [content]
     * @param {string} content
     * @returns {HTMLStyleElement}
     */
    static importHeadStyle(content: string): HTMLElement | null {
        if (!content)
            return null;
        const tag = window.document.createElement("style");
        tag.innerHTML = content;
        window.document.head.appendChild(tag);
        return tag;
    }

    static className(object: any): string {
        // Zwraca nazwę klasy obiektu
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
    static duration(name: string, callback: () => any): void {
        const ts = new Date().getTime();
        callback();
        console.log(name + ": " + (new Date().getTime() - ts));
    }

    /**
     * @deprecated
     * Zamienia pole na finalne (tylko do odczytu)
     * @param {object} obj
     * @param {string} fieldName
     */

    static makeFinal(obj: any, fieldName: string): void {
        Object.defineProperty(obj, fieldName, {
            value: fieldName,
            writable: false,
            enumerable: false,
            configurable: false
        });
    }

    /**
     * Funkcja sprawdza czy wartość przekazana w argumencie id jest prawidłowym identyfikatorem
     * @param {string} id
     * @param {string} extraChars
     * @returns {string} id
     */
    static checkId(id: string, extraChars: string) {
        Utils.checkInstance(Utils.requireNonEmpty(id), "string");
        const allowed = "0123456789_abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            + (typeof extraChars === "string" ? extraChars : "");
        for (let i = 0; i < id.length; i++)
            if (allowed.indexOf(id[i]) < 0)
                throw new Error("Incorrect identifier \"" + id + "\"");
        return id;

    }

    /**
     * Funkcja sparawdza czy obiekt należy do jednej z instancji przekazanej w argumencie instances
     * @param object - argument może być null-em, funkcja nie zgłosi błędu
     * @param {type|string} instances - tablica lub elementy (funkcję lub nazwy klas)
     * @returns object
     */
    static checkInstance<T>(object: T, instances: InstanceType): T {
        const res = check(object, instances);
        if (res === null || res === undefined)
            return object;

        throw Error("Incorrect object instance.\nExpected "
            + (res: string[]).join(" or ") + ", actual " + Utils.className(object));
    }

    /**
     * Sprawdza czy obiekt nie jest pusty i jest danej instancji
     * @param {type} object
     * @param {type} instances
     * @returns {any}
     */
    static  checkInstanceF(object: mixed, instances: InstanceType): mixed {
        return Utils.requireNotNull(Utils.checkInstance(object, instances));
    }

    /**
     * Sprawdza czy obiekt jest danej instancji
     * @param {type} object
     * @param {type} instances
     * @returns {Boolean}
     */

    static instanceOf(object: mixed, instances: InstanceType): boolean {
        return check(object, instances) === null;
    }

    /**
     * Pobierz wartość ciastka na podstawie nazwy. Funkcja bazuje na kodowaniu URI
     * @param {string} name
     * @return {string|null}
     */
    static getCookie(name: string): string | null {
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
    static setCookie(name: string, value: string, exdays: number, httpOnly: boolean = false) {
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
    static randomUid(): string {
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
    static randomId(length: number = 10) {
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
    static  formatFileSize(size: number): string {

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

    static trimFileName(name: string, length: number): string {
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

    static  isFontInstalled(name: string): boolean {
        name = name.replace(/['"<>]/g, '');
        let body: Node = window.document.body;
        let test = document.createElement('div');
        let installed = false;
        let template = '<b style="display:inline !important; width:auto !important; font:normal 10px/1 \'X\',sans-serif !important">ii</b>' +
            '<b style="display:inline !important; width:auto !important; font:normal 10px/1 \'X\',monospace !important">ii</b>';


        if (name) {
            test.innerHTML = template.replace(/X/g, name);
            test.style.cssText = 'position: absolute; visibility: hidden; display: block !important';
            body.insertBefore(test, body.firstChild);
            let ab = test.getElementsByTagName('b');
            installed = ab[0].offsetWidth === ab[1].offsetWidth;
            body.removeChild(test);
        }
        return installed;
    }

    /*
     Odnajduje w tekscie linki i formatuje je do postaci odnosnikow
     */
    static  linkify(text: string): string {
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
    static coalesce(...args): any {
        // zwraca pierwszy z argumentów metody, który jest zdefiniowany i nie jest null-em
        for (let i = 0; i < args.length; i++)
            if (args[i] !== null && args[i] !== undefined)
                return args[i];
        return null;
    }


    /**
     * Sprawdza czy wartość jest funkcją, jeśli tak zwraca funkcję, w przeciwnym razie generuje błąd
     * @param {function} value
     * @param {Error} error Opcjonalny błąd do przesłania
     * @return {any}
     */
    static requireFunction<T:any>(value: T, error: ?Error = null): T {
        if (typeof value === "function")
            return value;

        throw new Error(error ? error : "Wymagana funkcja, aktualnie " + Utils.className(value));
    }

    /**
     * Sprawdza czy wartość jest zdefiniowana (różna od nulla i undefined)
     * @param {any}value
     * @param {Error}error
     * @return {any}
     */
    static requireNotNull<T:any>(value: T, error: ?Error = null): T {
        if (value !== null && value !== undefined)
            return value;
        throw new Error(error ? error : "Value is missing");
    }

    /**
     * Sprawdza czy wartość jest zdefiniowana oraz czy nie jest pusta
     * @param {any}value
     * @param {Error}error
     * @return {any}
     */
    static requireNonEmpty<T:any>(value: T, error: ?Error = null): T {
        if (value !== null && value !== undefined && value.toString().trim())
            return value;
        throw new Error(error ? error : "Value is missing");
    }

//Breakpoint on access to a property, eg debugAccess(document, 'cookie');
    static debugAccess(obj: any, prop: string, debugGet: boolean = false): void {
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
    static jsonParse(text: string): any {
        let trim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
        text = text.replace(trim, "");

        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ":")
                .replace(/\w*\s*:/g, ":")))
            return (new Function("return " + text))();

        throw "Invalid JSON: " + text;
    }
}

// funkcja pomocnicza
function check(object: any, instances: InstanceType): ?string[] {

    if (object === null || object === undefined)
        return null;

    let args = [];
    for (let i = 1; i < arguments.length; i++)
        if (arguments[i] instanceof Array)
            args = args.concat(arguments[i]);
        else
            args.push(arguments[i]);


    const names = [];

    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
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


    if (args.length === 0)
        return null;

    const className = Utils.className(object).toLowerCase();
    for (let i = 0; i < names.length; i++)
        if (names[i].toLowerCase() === className)
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



