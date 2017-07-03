// @flow
'use strict';

import Utils from "../utils/Utils"
import "../utils/DOMPrototype";
import WebApiRequest from "./Request";
import WebApiFile from "./File";
import WebApiMessage from "./Message";
import WebApi from "./WebApi";
import {EError, Debug, If} from "../core";

export default class WebApiResponse {

    webApi: WebApi;
    data: Object;
    raw: Object;
    type: ["event", "response"];
    request: WebApiRequest;
    hash: string;
    error: boolean = false;
    file: ?WebApiFile;
    processTime: number; // łączny czas przetwarzania żądania

    constructor(webApi: WebApi, data: Object) {
        this.webApi = webApi;
        this.raw = data;
        this.data = data.data;

        this.type = data.type;

        if (this.type === "event" && !data.id) {
            webApi.onEvent.dispatch(this, data.source, data.event, data.data, this);
            return;
        }

        if (!webApi.processed.has(data.id)) {
            Debug.error(this, "Nieznane id " + data.id);
            return;
        }

        // $FlowFixMe
        const req: WebApiRequest = this.request = webApi.processed.get(data.id);
        this.hash = data.hash;
        req._processed = true;
        if (req.sendTime)
            this.processTime = new Date().getTime() - req.sendTime.getTime();


        Debug.log(this, `${req.id},\t "${req.method}", czas: ${this.processTime}ms, serwer: ${data.duration}ms`);

        /*
         if (req.spinner && req.spinner.hide)
         req.spinner.hide();
         */

        if (typeof this.hash === "string") {
            const split = this.hash.split("\/");
            if (split.length === 2 && data.mode === "dev") {
                if (webApi.hash !== split[0])
                    Debug.warning("Wersja api uległa zmianie");

                if (req.hash !== split[1])
                    Debug.warning(`Wersja endpoint-u ${req.method} uległa zmianie`);
            }

        }

        if (req.onResponse)
            req.onResponse(data);

        if (this.type === "response")
            this.webApi.processed.delete(data.id);

        data.request = req;
        this.error = data.error;

        if (this.type === "event") {
            if (data.request && data.request.onEvent)
                data.request.onEvent(data);
            return;
        }

        let err: ?EError = null;
        let errMsg: ?string = null;

        if (data.messages)
            data.messages.forEach(src => {
                const msg = new WebApiMessage(this, src);
                if (this.error && msg.type === "error") {
                    errMsg = (msg.title ? msg.title + ": " : "") + msg.value;
                    err = new EError();
                    err.message = msg.value;
                    err.title = msg.title;
                    err.stack = msg.stackTrace;
                    err.details = msg.details;
                    return;
                }
                webApi.onMessage(msg);
            });

        /*
         if (data.file && data.file.url) {
         webApi.downloadFile(data.file);
         return;
         }
         */
        if (this.error) {
            req._reject(err, this);

            let handled = false;
            if (err && typeof req.onError === "function") {
                req.onError(err, this);
                handled = true;
            }

            if (err && typeof webApi.onError === "function")
                webApi.onError(err, err, handled);
        }


        if (!this.error) {
            if (req._resolve)
                req._resolve(this.data, this);
            if (typeof req.onSuccess === "function")
                req.onSuccess(this.data, this);
        }
    }

    static error(req: WebApiRequest, err: Error) {
        req._reject(err, this);
        let handled = false;
        If.isFunction(req.onError, f => {
            f(err, req);
            handled = true;
        });

        If.isFunction(req.webApi.onError, f => f(err, null, handled))
    }
}
