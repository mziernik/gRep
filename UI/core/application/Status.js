import {React, Check, If, Debug, Utils, Dispatcher} from "../core";

import * as Application from "./Application";
//import {StatusHint} from "../component/application/StatusHint";

type StatusType = "debug" | "info" | "success" | "warning" | "error"

export default class AppStatus {

    static catchExceptions: boolean = Application.DEV_MODE;
    static defaultTimeout: number = 2000;
    static onChange: Dispatcher = new Dispatcher();

    static factory: ?(context: any) => AppStatus = null;

    message: string;
    type: StatusType;
    details: ?string;
    timeout: ?number = null;
    id: string = Utils.randomId();
    hide: () => void;
    _tag: HTMLElement;

    static debug(context: any, message: string, details: ?string = null, timeout: ?number = null) {
        return AppStatus.set(context, "debug", message, details, timeout);
    }

    static info(context: any, message: string, details: ?string = null, timeout: ?number = null) {
        return AppStatus.set(context, "info", message, details, timeout);
    }

    static success(context: any, message: string, details: ?string = null, timeout: ?number = null) {
        return AppStatus.set(context, "success", message, details, timeout);
    }

    static error(context: any, message: string, details: ?string = null, timeout: ?number = null) {
        return AppStatus.set(context, "error", message, details, If.isDefined(timeout) ? timeout : 5000);
    }

    static warning(context: any, message: string, details: ?string = null, timeout: ?number = null) {
        return AppStatus.set(context, "warning", message, details, timeout);
    }

    static set(context: any, type: StatusType, message: string, details: ?string = null, timeout: ?number = null) {
        const status = AppStatus.factory ? AppStatus.factory(context) : new AppStatus();
        If.isString(type, t => type = t.trim().toLowerCase());
        status.type = Check.oneOf(type, ["debug", "info", "success", "warning", "error"]);
        if (timeout === null || timeout === undefined)
            timeout = AppStatus.defaultTimeout;
        status.message = message;
        status.details = details;
        status.timeout = timeout;

        AppStatus.onChange.dispatch(context, status);

        if (timeout > 0)
            setTimeout(() => {
                if (status.hide)
                    status.hide();
            }, timeout);

    }
}

window.addEventListener("error", (e: any, file: ?any, line: ?number, column: ?number, ex: ?Error) => {
    if (!AppStatus.catchExceptions)
        return;
    try {
        //   AppStatus.set('ErrorHandler', "error", e instanceof ErrorEvent ? e.message : "" + e);
    } catch (e) {
        Debug.error(this, e);
    }

});