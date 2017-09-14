import {Connection} from "./Connection";

export {Connection} from "./Connection";
export {TransportType} from "./Transports";

export class HubConnection {
    static create(url, queryString) {
        return new this(new Connection(url, queryString));
    }

    constructor(connectionOrUrl, queryString) {
        this.connection = typeof connectionOrUrl === "string" ? new Connection(connectionOrUrl, queryString) : connectionOrUrl;
        this.connection.onDataReceived = data => {
            this.onDataReceived(data);
        };
        this.connection.onClosed = (error) => {
            this.onConnectionClosed(error);
        };
        this.callbacks = new Map();
        this.methods = new Map();
        this.id = 0;
    }

    onDataReceived(data) {
        if (!data) {
            return;
        }
        var descriptor = JSON.parse(data);
        if (descriptor.Method === undefined) {
            let invocationResult = descriptor;
            let callback = this.callbacks.get(invocationResult.Id);
            if (callback != null) {
                callback(invocationResult);
                this.callbacks.delete(invocationResult.Id);
            }
        }
        else {
            let invocation = descriptor;
            let method = this.methods[invocation.Method];
            if (method != null) {
                method.apply(this, invocation.Arguments);
            }
        }
    }

    onConnectionClosed(error) {
        let errorInvocationResult = {
            Id: "-1",
            Error: error ? error.message : "Invocation cancelled due to connection being closed.",
            Result: null
        };
        this.callbacks.forEach(callback => {
            callback(errorInvocationResult);
        });
        this.callbacks.clear();
        if (this.connectionClosedCallback) {
            this.connectionClosedCallback(error);
        }
    }

    start(transportType) {
        return this.connection.start(transportType);
    }

    stop() {
        return this.connection.stop();
    }

    invoke(methodName, ...args) {
        let id = this.id;
        this.id++;
        let invocationDescriptor = {
            "Id": id.toString(),
            "Method": methodName,
            "Arguments": args
        };
        let p = new Promise((resolve, reject) => {
            this.callbacks.set(invocationDescriptor.Id, (invocationResult) => {
                if (invocationResult.Error != null) {
                    reject(new Error(invocationResult.Error));
                }
                else {
                    resolve(invocationResult.Result);
                }
            });
            this.connection.send(JSON.stringify(invocationDescriptor))
                .catch(e => {
                    reject(e);
                    this.callbacks.delete(invocationDescriptor.Id);
                });
        });
        return p;
    }

    on(methodName, method) {
        this.methods[methodName] = method;
    }

    set onClosed(callback) {
        this.connectionClosedCallback = callback;
    }
}
