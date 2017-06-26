// @flow
'use strict';

import * as Utils from "../utils/Utils";
import * as Check from "../utils/Check";
import * as If from "../utils/If";
import AppNode from "./Node";
import Dispatcher, {Observer} from "../utils/Dispatcher";
import Delayed from "../utils/Trigger";


/**
 * Definicja typu zdarzenia
 */
export class EventType {

    static all: EventType[] = [];

    /** @type {EventHandler[]} */
    dispatcher: Dispatcher = new Dispatcher(this);

    /** @type {string} Nazwa (opisowa) zdarzenia */
    name: string;


    /**
     * @param {string} name
     */
    constructor(name: string) {
        this.name = name;
        EventType.all.push(this);

        Object.preventExtensions(this);
    }

    send(context: any, ...value: any) {
        new AppEvent(context, this, ...value);
    }

    /**
     * Deklaracja chęci obsługi zdarzeń danego typu
     * @param {EventType} type
     * @param {function} callback
     * @return {Component}
     */
    listen(context: any, callback: (value: any, event: AppEvent) => any) {
        Check.isFunction(callback);
        this.dispatcher.listen(context, (...args) => callback(...args));
        return this;
    }

}

const queue: AppEvent[] = [];
const delayedDispatch = new Delayed(null, 0);

/**
 * Klasa umożliwiająca asynchroniczne przesyłanie zdarzeń
 */
export default class AppEvent {

    /** @type {EventType}  */
    static APPLICATION__BEFORE_UPDATE = new EventType("Aktualizacja gałęzi aplikacji")

    /** @type {EventType}  */
    static REPOSITORY_REGISTERED = new EventType("Zarejestrowano repozytorium");

    /** @type {EventType}  */
    static NAVIGATE = new EventType("Nawigacja do strony");

    /** @type {any} Źródło zdarzenia, najczęściej klasa Component */
    sender: any;
    /** @type {EventType} Typ zdarzenia */
    type: EventType;
    value: ?any;
    sent = false;
    /** @type {EventHandler[]} handlery, które obsłużyły zdarzenie */
    handlers: Observer[] = [];

    /** @type {function} Zdarzenie generowane w momencie przetworzenia zdarzenia przez wszystkie handlery */
    onSent: (AppEvent) => ?any;

    /**
     *
     * @param sender
     * @param {EventType} type
     * @param value
     */
    constructor(sender: any, type: EventType, ...value: ?any) {
        this.sender = sender;
        this.type = Check.instanceOf(type, [EventType]);
        this.value = value;

        queue.push(this);

        delayedDispatch.call(() => {
            while (queue.length) {
                const event: AppEvent = queue.splice(0, 1)[0];
                queue.remove(event);
                event.type.dispatcher.dispatch(sender, ...event.value, event);
                event.sent = true;
                If.isFunction(event.onSent, onSent => onSent(event));
            }
        });
    }
}






