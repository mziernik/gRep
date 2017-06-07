import WebApi from "./WebApi";
import WebApiRequest from "./Request";
import Debug from "../Debug";
import WebApiResponse from "./Response";
export default class WebApiTransport {

    api: WebApi;
    connected: boolean = false;
    queue: WebApiRequest[] = [];

    onReceive: (data: Object) => void;
    onError: (err: Error) => void;
    onClose: (reason: string) => void;
    url: string;

    constructor(api: WebApi) {
        this.api = api;
    }


    send(request: WebApiRequest) {

        if (!this.connected) {
            this.doConnect(this.api.url);
        }

        if (!this.connected) {
            this.queue.push(request);
            return;
        }
        this.doSend(request);
        request.sendTime = new Date();
        if (typeof request.onSent === "function")
            request.onSent(request);
    }


    onOpen() {
        this.connected = true;
        this.queue.forEach(request => this.send(request));
    }


    close() {
        this.doClose();
        this.connected = false;
    }

    onClose(e: ?any) {
        this.connected = false;
    }

    onError(e: ?any) {
        Debug.error(this, e);
        //if (this.connected)
        try {
            this.connected = false;
            this.close();
        } catch (e) {
            Debug.error(this, e);
        }
    }

    onMessage(data: Object) {
        new WebApiResponse(this.api, data);
    }

}

export class WebSocketTransport extends WebApiTransport {

    ws: WebSocket;

    doSend(request: WebApiRequest) {
        this.ws.send(JSON.stringify(request.transportData));
    }

    doClose() {
        this.ws.close();
    }

    doConnect(url: string) {

        this.ws = new WebSocket(url.replace(/^http/, "ws"));

        this.ws.onopen = (ws) => {
            this.onOpen();
        };

        this.ws.onclose = (e: CloseEvent) => {
            this.onClose(e);
        };

        this.ws.onerror = (e: Event, f) => {
            this.onError(e);
        };

        this.ws.onmessage = (e: MessageEvent) => {
            this.onMessage(JSON.parse(e.data));
        };
    }


}


function replaceHost(src: URL, dst: ?URL): URL {
    if (!dst)
        dst = window.document.location;

    if (!(dst instanceof URL))
        dst = new URL(dst);

    src.protocol = dst.protocol;
    src.hostname = dst.hostname;
    src.port = dst.port;

    if ((!src.port || src.port === "0") && src.protocol)
        switch (src.protocol.toLowerCase()) {
            case "http:":
                src.port = "80";
                break;
            case "https:":
                src.port = "443";
                break;
            case "ftp:":
                src.port = "21";
                break;
        }

    return src;
}