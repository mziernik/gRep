import {React, Check, If, Debug} from "../core";

type StatusType = "debug" | "info" | "success" | "warning" | "error"

export default class AppStatus {

    static factory: ?(context: any) => AppStatus = null;

    message: string;
    type: StatusType;
    details: ?string;
    duration: ?number = null;

    static set(context: any, type: StatusType, message: string, details: ?string = null, duration: ?number = null) {
        const status = AppStatus.factory ? AppStatus.factory(context) : new AppStatus();
        If.isString(type, t => type = t.trim().toLowerCase());
        status.type = Check.oneOf(type, ["debug", "info", "success", "warning", "error"]);
        status.message = message;
        status.details = details;
        status.duration = duration;

        status.publish();
    }

    publish() {
        //do przeciążenia
        Debug.log([this, context], this.message);
    }


}


