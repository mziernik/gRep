// @flow
'use strict';

import WebApiRequest from "./Request";
import WebApiMessage from "./Message";
import WebApiResponse from "./Response";
import Dev from "../Dev";
import EError from "../utils/EError";
import WebApiTransport, {State, WebSocketTransport} from "./Transport";
import Dispatcher from "../utils/Dispatcher";
import {AppStatus} from "../core";
import * as If from "../utils/Is";
import AppEvent from "../application/Event";
import Config from "../config/CoreConfig";

export type OnSuccess = (data: ?any, response: WebApiResponse) => void;
export type OnError = (error: Object, response: WebApiResponse) => void;


export default class WebApi {

    static instance: WebApi;
    static headers: Object = {
        "Local-TS": -1,
        "User-Agent": window.navigator.userAgent,
        "Accept-Language": window.navigator.language
    };
    url: string;
    httpUrl: string;
    wsUrl: string;
    hash: string;
    maxRetries: number = 10;
    processed: Map<string, WebApiRequest> = new Map();
    transport: WebApiTransport;
    onEvent: Dispatcher = new Dispatcher(); //(source: string, event: string, data: object, context: WebApiResponse)
    onClose: Dispatcher = new Dispatcher();

    constructor(url: string, transportClass) {
        if (!url) url = Config.api.url.value;

        this.url = url;
        this.httpUrl = url;
        this.wsUrl = url;
        WebApi.instance = this;

        let retryCount = 0;

        const retry = (): boolean => {
            ++retryCount;
            if (retryCount >= this.maxRetries)
                return false;

            const delay = Math.pow(50 * retryCount, 1.7);
            setTimeout(() => {
                if (transport.connected)
                    return;
                transport.connect(url);
            }, delay);
            return true;
        };


        this.transport = new (transportClass || WebSocketTransport)(this);

        const transport = this.transport;

        let wasConnected = false;

        transport.onOpen = e => {
            if (wasConnected && retryCount > 0) {
                AppStatus.warning(this, "Wznowiono połączenie z WebApi", "Przeładowuję stronę");
                window.location.reload();
                return;
            }

            wasConnected = true;
            retryCount = 0;
            State.current = State.CONNECTED;
            transport.connected = true;
            transport.queue.forEach(request => this.send(request));
        };

        transport.onError = e => {
            console.error(e);
        };

        transport.onMessage = data => new WebApiResponse(this, data);

        transport.onClose = (reason, e) => {
            transport.connected = false;
            State.current = State.CLOSED;
            const canRetry = e && e.code === 1006;
            if (reason)
                AppStatus.error(this, "WebApi: " + reason, canRetry ? "Próba " + (retryCount + 1) + " / " + this.maxRetries : null);
            if (canRetry && retry())
                return;
            const err = new EError(reason);
            this.processed.forEach((req: WebApiRequest) => WebApiResponse.error(req, err));
            this.processed.clear();
        };

    }

    onMessage(data: WebApiMessage) {
        if (window.spa && window.spa.alert)
            window.spa.alert(data);
    };

    onError(error: EError, response: WebApiResponse, handled: boolean) {
        Dev.error(this, error.message);
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

        const transport = this.transport;

        if (!transport.connected)
            transport.connect(this.url)

        if (!transport.connected) {
            transport.queue.push(request);
            return;
        }

        AppEvent.WEB_API_ACTION.send(request, {
            request: true,
            ts: new Date(),
            ...request.transportData
        });

        Dev.log(request, `${request.id},\t "${request.method}"`, request.transportData);
        transport.send(request);

        request.sendTime = new Date();
        if (typeof request.onSent === "function")
            request.onSent(request);
    }


    close() {
        this.transport.close();
        this.transport.connected = false;
    }


}
