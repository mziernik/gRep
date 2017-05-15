// @flow
'use strict';

const listeners = new Set();

/**
 * Dyspozytor powiadomień (obserwator)
 */
export default class Notify {
    sender: ?any = null;
    type: string = "";
    message: ?any = null;
    timeout: ?number = null;


    constructor(sender: any, type: string, message: any, timeout: ?number) {
        this.sender = sender;
        this.type = type;
        this.message = message;
        this.timeout = timeout;
    }

    send() {
        listeners.forEach((callback) => callback(this.message, this));
    }

    static addListsners(callback) {
        if (typeof callback === "function")
            listeners.add(callback);
    }
}