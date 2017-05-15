var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TransportType, WebSocketTransport, ServerSentEventsTransport, LongPollingTransport } from "./Transports";
import { HttpClient } from "./HttpClient";
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["Initial"] = 0] = "Initial";
    ConnectionState[ConnectionState["Connecting"] = 1] = "Connecting";
    ConnectionState[ConnectionState["Connected"] = 2] = "Connected";
    ConnectionState[ConnectionState["Disconnected"] = 3] = "Disconnected";
})(ConnectionState || (ConnectionState = {}));
export class Connection {
    constructor(url, queryString = "", options = {}) {
        this.url = url;
        this.queryString = queryString || "";
        this.httpClient = options.httpClient || new HttpClient();
        this.connectionState = ConnectionState.Initial;
    }
    start(transport = TransportType.WebSockets) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionState != ConnectionState.Initial) {
                return Promise.reject(new Error("Cannot start a connection that is not in the 'Initial' state."));
            }
            this.connectionState = ConnectionState.Connecting;
            this.startPromise = this.startInternal(transport);
            return this.startPromise;
        });
    }
    startInternal(transportType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connectionId = yield this.httpClient.get(`${this.url}/negotiate?${this.queryString}`);
                if (this.connectionState == ConnectionState.Disconnected) {
                    return;
                }
                if (this.queryString) {
                    this.queryString += "&";
                }
                this.queryString += `id=${this.connectionId}`;
                this.transport = this.createTransport(transportType);
                this.transport.onDataReceived = this.onDataReceived;
                this.transport.onClosed = e => this.stopConnection(true, e);
                yield this.transport.connect(this.url, this.queryString);
                this.changeState(ConnectionState.Connecting, ConnectionState.Connected);
            }
            catch (e) {
                console.log("Failed to start the connection. " + e);
                this.connectionState = ConnectionState.Disconnected;
                this.transport = null;
                throw e;
            }
            ;
        });
    }
    createTransport(transport) {
        if (transport === TransportType.WebSockets) {
            return new WebSocketTransport();
        }
        if (transport === TransportType.ServerSentEvents) {
            return new ServerSentEventsTransport(this.httpClient);
        }
        if (transport === TransportType.LongPolling) {
            return new LongPollingTransport(this.httpClient);
        }
        if (this.isITransport(transport)) {
            return transport;
        }
        throw new Error("No valid transports requested.");
    }
    isITransport(transport) {
        return "connect" in transport;
    }
    changeState(from, to) {
        if (this.connectionState == from) {
            this.connectionState = to;
            return true;
        }
        return false;
    }
    send(data) {
        if (this.connectionState != ConnectionState.Connected) {
            throw new Error("Cannot send data if the connection is not in the 'Connected' State");
        }
        return this.transport.send(data);
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            let previousState = this.connectionState;
            this.connectionState = ConnectionState.Disconnected;
            try {
                yield this.startPromise;
            }
            catch (e) {
            }
            this.stopConnection(previousState == ConnectionState.Connected);
        });
    }
    stopConnection(raiseClosed, error) {
        if (this.transport) {
            this.transport.stop();
            this.transport = null;
        }
        this.connectionState = ConnectionState.Disconnected;
        if (raiseClosed && this.onClosed) {
            this.onClosed(error);
        }
    }
}
