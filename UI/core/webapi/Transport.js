import WebApiRequest from "./Request";
import {HubConnection} from "./SignalR/HubConnection";
import WebApiResponse from "./Response";
import {Debug, Utils, If, Dispatcher} from "../core";

let _reconnect: ?() => void;

export class State {

    static INIT: State = new State("Nie połączony", "gray");
    static CONNECTING: State = new State("Łączenie", "yellow");
    static CONNECTED: State = new State("Połączone", "lime");
    static CLOSED: State = new State("Rozłączone", "red");

    static onChange: Dispatcher = new Dispatcher();

    static get current(): State {
        return currentState;
    }

    static reconnect() {
        if (State.current !== State.CLOSED)
            return;

        if (_reconnect)
            _reconnect();
    }

    static set current(state: State) {
        if (state === currentState) return;
        currentState = state;
        State.onChange.dispatch(null, state);
    }

    name: string;
    color: string;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }
}

let currentState: State = State.INIT;

export default class WebApiTransport {

    connected: boolean = false;
    /** Kolejka żądań oczekujących na  wysłanie */
    queue: WebApiRequest[] = [];
    onMessage: (message: any) => void;
    onClose: (reason: string) => void;
    onError: (message: string) => void;
    onOpen: () => void;

    connect(url: string) {
        _reconnect = () => this.connect(url);
        State.current = State.CONNECTING;
        this.doConnect(url);
    }

    doConnect(url: string) {
        throw new Error("Unsupported operation");
    }

    send(request: WebApiRequest) {
        throw new Error("Unsupported operation");
    }

    close() {
        throw new Error("Unsupported operation");
    }
}


export class WebSocketTransport extends WebApiTransport {

    ws: WebSocket;

    send(request: WebApiRequest) {
        this.ws.send(JSON.stringify(request.transportData));
    }

    close() {
        this.ws.close();
    }


    doConnect(url: string) {

        this.ws = new WebSocket(url.replace(/^http/, "ws"));

        this.ws.onopen = (ws) => {
            this.onOpen();
        };

        this.ws.onclose = (e: CloseEvent) => {

            if (e.wasClean && e.code === 1000) {
                this.onClose(null);
                return;
            }

            this.onClose(getReason(e.code, this.connected));
        };

        this.ws.onerror = (e: Event, f) => {
            this.onError(e);
        };

        this.ws.onmessage = (e: MessageEvent) => {
            this.onMessage(JSON.parse(e.data));
        };
    }


}

export class SignalRTransport extends WebApiTransport {

    conn: HubConnection;

    send(req: WebApiRequest) {
        const args: [] = Utils.forEach(req.params, v => v);
        this.conn.invoke(req.method, ...args)
            .then(data => {
                data.id = req.id;
                new WebApiResponse(req.webApi, data);
            })
            .catch(e => WebApiResponse.error(req, e));
    }

    close() {
        this.conn.stop();
    }


    doConnect(url: string) {

        this.conn = HubConnection.create(url);
        this.conn.start()
            .then((xxx) => {
                this.onOpen();
            })
            .catch((e: Object) => {
                if (If.isDefined(e.statusText))
                    e = e.statusText || "Nie można nawiązać połączenia z serwerem";
                this.onClose(e && e.code ? getReason(e.code, this.connected) : e);
            });

        this.conn.onClosed = (e, f, g) => {
            //  debugger;
            if (Utils.className(e) === "CloseEvent") {
                if (e.wasClean && e.code === 1000) {
                    this.onClose(null);
                    return;
                }
                this.onClose(getReason(e.code, this.connected));
                return;
            }

            this.onClose(e);
        };

    }


}


export function getReason(code: number, wasConnected: boolean): string {
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
            return wasConnected ? "Utracono połączenie z serwerem" : "Nie można nawiązać połączenia z serwerem";
        //return "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
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