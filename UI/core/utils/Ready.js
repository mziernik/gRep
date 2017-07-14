import {Utils, Debug, Check, If, EError} from "../core";

const confirmed: any[] = [];
const awaiting: [] = [];

export function confirm(context: any, object: any) {
    if (object === null || object === undefined)
        return;

    confirmed.push(object);
    const toRemove: [] = [];

    awaiting.forEach((awt, idx) => {
        if (!waitFor(context, awt[0], null)) return;
        try {
            awt[1]();
        } catch (e) {
            Debug.error(this, e);
            If.isFunction(awt[2], f => f(e));
        }
        toRemove.push(idx);
    });

    toRemove.forEach(idx => awaiting.splice(idx, 1));
}

export function waitFor(context: any, objects: [], onReady: () => void, onError: (e: Error) => void): boolean {
    let ready = true;
    Check.isArray(objects).forEach(obj => {
        if (confirmed.indexOf(obj) === -1)
            ready = false;
    });

    if (ready) return true;
    If.isFunction(onReady, f => awaiting.push([objects, f, onError]));
    return false;
}

export function onReady(context: any, objects: [], onReady: () => void, onError: (e: Error) => void): boolean {
    const result = waitFor(context, objects, onReady, onError);
    if (result && onReady)
        onReady();
    return result;
}

