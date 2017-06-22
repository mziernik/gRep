import WebApi from "./WebApi";
import WebApiRequest from "./Request";
import Debug from "../Debug";
import WebApiResponse from "./Response";
import AppStatus from "../application/Status";
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
        AppStatus.error(this, e);
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
            if (e.code) {
                let reason = getReason(e.code);
                AppStatus.error(this, "WebApi: " + reason);
            }
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

function getReason(code: number): string {
    switch (code) {
        case  1000:
            return "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
        case 1001:
            return "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
        case 1002:
            return "An endpoint is terminating the connection due to a protocol error";
        case 1003:
            return "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
        case 1004:
            return "Reserved. The specific meaning might be defined in the future.";
        case 1005:
            return "No status code was actually present.";
        case 1006:
            return "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
        case 1007:
            return "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
        case 1008:
            return "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
        case 1009:
            return "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
        case 1010:
            return "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake.";
        case 1011:
            return "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
        case 1015:
            return "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
        default:
            return "Unknown reason";
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