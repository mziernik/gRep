// @flow
'use strict';

import WebApiRequest from "./Request";
import WebApiMessage from "./Message";
import WebApiResponse from "./Response";
import Debug from "../Debug";
import EError from "../utils/EError";
import WebApiTransport, {WebSocketTransport} from "./Transport";
import Dispatcher from "../utils/Dispatcher";

export type OnSuccess = (data: ?any, response: WebApiResponse) => void;
export type OnError = (error: Object, response: WebApiResponse) => void;

export default class WebApi {
    url: string;
    httpUrl: string;
    wsUrl: string;
    hash: string;

    eventHandlers = [];
    processed: Map<string, WebApiRequest> = new Map();
    transport: WebApiTransport;
    onEvent: Dispatcher = new Dispatcher(); //(source: string, event: string, data: object, context: WebApiResponse)


    static headers: Object = {
        "Local-TS": -1,
        "User-Agent": window.navigator.userAgent,
        "Accept-Language": window.navigator.language
    };


    constructor(url: string) {
        this.url = url;
        this.transport = new WebSocketTransport(this);

        this.transport.onClose.listen(this, reason => {

            const err = new Error(reason);
            this.processed.forEach((req: WebApiRequest) => {
                req._reject(err, this);
                let handled = false;
                if (req.onError === "function") {
                    req.onError(err, req);
                    handled = true;
                }
                if (err && typeof this.onError === "function")
                    this.onError(err, err, handled);
            });

            this.processed.clear();
        })
    }

    /*
     registerEvent (controller, sourceName, hashes, callback) {
     if (!sourceName || !hashes)
     return;

     var h = [];

     if (typeof hashes === "string")
     h.push(hashes);

     if (hashes.constructor === Array)
     for (var i = 0; i < hashes.length; i++)
     h.push(hashes[i]);

     eventHandlers.push([controller, sourceName, h, callback]);
     };



     this.downloadFile = function (file) {
     var a = document.createElement("a");
     a.setAttribute("href", file.url);
     a.setAttribute("download", file.name);
     //    document.body.appendChild(a);
     a.click();
     // document.body.removeChild(a);


     // window.location = file.url;

     };
     */

    // metoda do przeciążenia
    // onEvent (controller, sourceName, hashes, callback, data) {
    //     if (callback)
    //         callback(data);
    // };

    onMessage(data: WebApiMessage) {
        if (window.spa && window.spa.alert)
            window.spa.alert(data);
    };

    onError(error: EError, response: WebApiResponse, handled: boolean) {
        Debug.error(this, error.message);
    }


    call(method: string, hash: ?string, params: ?Object, onSuccess: OnSuccess, onError: OnError): WebApiRequest {
        return new WebApiRequest(this, method, hash, params, onSuccess, onError);
    }


    send(request: WebApiRequest) {
        this.processed.set(request.id, request);

        if (request.headers["Local-TS"] === -1)
            request.headers["Local-TS"] = new Date().getTime();

        request.transportData = {
            id: request.id,
            location: request.location,
            method: request.method,
            //deprecated
            endpoint: request.method, //------------------------------             //deprecated
            params: request.params,
            headers: request.headers,
            hash: request.hash
        };

        this.transport.send(request);
    }
}
