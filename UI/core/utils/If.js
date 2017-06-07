// @flow
'use strict';

/**
 * Zbiór metod weryfikujących dane.
 * Każda z metod zwraca boolean-a oraz może wywoływać funkcje zwrotne [then] oraz [otherwise].
 * Przydatne w połączeniu z wyrażeniami strzałkowymi
 */

import "./DOMPrototype";
import "./Prototype";
import * as Utils from "./Utils";

export function isArray(object: ?any, then: ?(object: []) => void, otherwise: ?(object: []) => void): boolean {
    return result(object instanceof Array, object, then, otherwise);
}

export function isObject(object: ?any, then: ?(object: []) => void, otherwise: ?(object: any) => void): boolean {
    return result(typeof object === "object", object, then, otherwise);
}

export function isFunction(object: ?any, then: ?(object: () => void) => void, otherwise: ?(object: any) => void): boolean {
    return result(typeof object === "function", object, then, otherwise);
}

export function isString(object: ?any, then: ?(object: string) => void, otherwise: ?(object: any) => void): boolean {
    return result(typeof object === "string", object, then, otherwise);
}

export function isNumber(object: ?any, then: ?(object: number) => void, otherwise: ?(object: any) => void): boolean {
    return result(typeof object === "number", object, then, otherwise);
}

export function isDefined(object: ?any, then: ?(object: any) => void, otherwise: ?(object: any) => void): boolean {
    return result(typeof object !== undefined && object !== null, object, then, otherwise);
}

export function condition(condition: boolean, then: ?(object: any) => void, otherwise: ?(object: any) => void): boolean {
    return result(condition, condition, then, otherwise);
}

/**
 * Sprawdza czy obiekt jest danej instancji
 * @param {type} object
 * @param {type} instances
 * @returns {Boolean}
 */

export function instanceOf(object: any, instances: any[], then: ?(object: any) => void, otherwise: ?(object: any) => void): boolean {
    return result(Utils.verifyObjectInstance(object, instances) === null, object, then, otherwise);
}


export function isFontInstalled(name: string, then: ?(object: any) => void, otherwise: ?(object: any) => void): boolean {
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
    return result(installed, name, then, otherwise);
}


function result(condition: boolean, object: any, then: ?(object: any) => void, otherwise: ?(object: any) => void) {
    if (condition && typeof then === "function")
        then(object);
    if (!condition && typeof otherwise === "function")
        otherwise(object);
    return condition;
}