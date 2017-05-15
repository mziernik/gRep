// @flow
'use strict';

import Application from "./Application";
import Utils from "./utils/Utils";
import AppNode from "./Node";


/**
 * Definicja typu zdarzenia
 */
export class EventType {
    /** @type {string} Nazwa (opisowa) zdarzenia */
    name: string;

    /**
     * @param {string} name
     */
    constructor(name: string) {
        this.name = name;
    }

    send(sender: any, value: any) {
        new AppEvent(sender, this, value);
    }

}

/**
 * Klasa umożliwiająca asynchroniczne przesyłanie zdarzeń
 */
export default class AppEvent {

    /** @type {EventType}  */
    static APPLICATION__BEFORE_UPDATE = new EventType("Before application update");

    /** @type {any} Źródło zdarzenia, najczęściej klasa Component */
    sender: any;
    /** @type {EventType} Typ zdarzenia */
    type: EventType;
    value: ?any;
    sent = false;
    /** @type {EventHandler[]} handlery, które obsłużyły zdarzenie */
    handlers = [];
    /** @type {boolean|function} flaga lub funkcja zwrotna umożliwiająca podjęcie decyzji, czy zdarzenie może być obsłużone przez dany handler */
    canHandle: boolean;
    /** @type {function} Zdarzenie generowane w momencie przetworzenia zdarzenia przez wszystkie handlery */
    onSent: (AppEvent) => ?any;

    /**
     *
     * @param sender
     * @param {EventType} type
     * @param value
     */
    constructor(sender: any, type: EventType, value: ?any = null) {
        this.sender = sender;
        this.type = Utils.checkInstance(type, EventType);
        this.value = value;

        queue.push(this);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            try {
                queue.forEach((event) => {
                    Application.nodes.forEach((node: AppNode) => node.dispatchEvent(event));
                    event.sent = true;
                    if (typeof event.onSent === "function")
                        event.onSent(event);
                });
            } finally {
                queue.length = 0;
            }

        }, 0);
    }

}

const queue: AppEvent[] = [];
let timeout;


export class EventHandler {
    /** @type {EventType}*/
    type = null;
    /**  @type  {function} */
    callback = null;

    /**
     *
     * @param {EventType} type
     * @param  {function} callback
     */
    constructor(type: EventType, callback: (value: void, event: AppEvent) => void) {
        this.type = type;
        this.callback = callback;
    }


}






