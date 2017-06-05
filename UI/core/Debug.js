// @flow
import * as Utils from "./utils/Utils";
'use strict';


export default class Debug {


    static group(context: ?any | any[], value: ?mixed, ...other: any) {
        window.console.groupCollapsed(format(context, value));
        (other || []).forEach(item => window.console.debug(item));
        window.console.groupEnd();
    }

    static log(context: ?any | any[], value: ?mixed, ...args: any) {
        window.console.debug(format(context, value), ...args);
    }

    static warning(context: ?any | any[], value: ?mixed, ...args: any) {
        window.console.warn(value instanceof Error ? value : format(context, value), ...args);
    }

    static error(context: ?any | any[], value: ?mixed, ...args: any) {
        window.console.error(value instanceof Error ? value : format(context, value), ...args);
    }

    static dir(value: ?mixed, ...args: any) {
        window.console.dir(value, ...args);
    }
}

function format(context: ?any | any[], value: ?mixed): string {
    if (value === null || value === undefined) {
        value = context;
        context = null;
    }

    let out: string = "";
    if (context)
        out = "[" + Utils.getContextName(context) + "] ";

    // $FlowFixMe: zignoruj ostrzeżenie
    return out + value;
}