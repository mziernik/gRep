// @flow
'use strict';


export default class Debug {

    /**
     *
     * @param {any} context
     * @param {mixed} value
     */
    static log(context: ?any, value: ?mixed) {
        console.debug(format(context, value));
    }

    static warning(context: ?any, value: ?mixed) {
        console.warn(value instanceof Error ? value : format(context, value));
    }

    static error(context: ?any, value: ?mixed) {
        console.error(value instanceof Error ? value : format(context, value));
    }
}

function format(context: ?any, value: ?mixed): string {
    if (value === null || value === undefined) {
        value = context;
        context = null;
    }

    let out: string = "";
    if (context && context.constructor && context.constructor.name)
        out = "[" + context.constructor.name + "] ";

    // $FlowFixMe: zignoruj ostrzeżenie
    return out + value;
}