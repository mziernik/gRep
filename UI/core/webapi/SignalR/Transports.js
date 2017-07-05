var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                result.done ? resolve(result.value) : new P(function (resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
import * as Formatters from "./Formatters";
export var TransportType;
(function (TransportType) {
    TransportType[TransportType["WebSockets"] = 0] = "WebSockets";
    TransportType[TransportType["ServerSentEvents"] = 1] = "ServerSentEvents";
    TransportType[TransportType["LongPolling"] = 2] = "LongPolling";
})(TransportType || (TransportType = {}));
export class WebSocketTransport {
    connect(url, queryString = "") {
        return new Promise((resolve, reject) => {
            url = url.replace(/^http/, "ws");
            let connectUrl = url + "/ws?" + queryString;
            let webSocket = new WebSocket(connectUrl);
            webSocket.onopen = (event) => {
                //    console.log(`WebSocket connected to ${connectUrl}`);
                this.webSocket = webSocket;
                resolve();
            };
            webSocket.onerror = (event) => {
                reject();
            };
            webSocket.onmessage = (message) => {
                //    console.log(`(WebSockets transport) data received: ${message.data}`);
                if (this.onDataReceived) {
                    this.onDataReceived(message.data);
                }
            };
            webSocket.onclose = (event) => {
                if (this.onClosed && this.webSocket) {
                    this.onClosed(event);
                }
            };
        });
    }

    send(data) {
        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(data);
            return Promise.resolve();
        }
        return Promise.reject("WebSocket is not in the OPEN state");
    }

    stop() {
        if (this.webSocket) {
            this.webSocket.close();
            this.webSocket = null;
        }
    }
}
export class ServerSentEventsTransport {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    connect(url, queryString) {
        if (typeof (EventSource) === "undefined") {
            Promise.reject("EventSource not supported by the browser.");
        }
        this.queryString = queryString;
        this.url = url;
        let tmp = `${this.url}/sse?${this.queryString}`;
        return new Promise((resolve, reject) => {
            let eventSource = new EventSource(`${this.url}/sse?${this.queryString}`);
            try {
                eventSource.onmessage = (e) => {
                    if (this.onDataReceived) {
                        let message;
                        try {
                            message = Formatters.ServerSentEventsFormat.parse(e.data);
                        }
                        catch (error) {
                            if (this.onClosed) {
                                this.onClosed(error);
                            }
                            return;
                        }
                        this.onDataReceived(message.content);
                    }
                };
                eventSource.onerror = (e) => {
                    reject();
                    if (this.eventSource && this.onClosed) {
                        this.onClosed(new Error(e.message));
                    }
                };
                eventSource.onopen = () => {
                    this.eventSource = eventSource;
                    resolve();
                };
            }
            catch (e) {
                return Promise.reject(e);
            }
        });
    }

    send(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return send(this.httpClient, `${this.url}/send?${this.queryString}`, data);
        });
    }

    stop() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
}
export class LongPollingTransport {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    connect(url, queryString) {
        this.url = url;
        this.queryString = queryString;
        this.shouldPoll = true;
        this.poll(url + "/poll?" + this.queryString);
        return Promise.resolve();
    }

    poll(url) {
        if (!this.shouldPoll) {
            return;
        }
        let pollXhr = new XMLHttpRequest();
        pollXhr.onload = () => {
            if (pollXhr.status == 200) {
                if (this.onDataReceived) {
                    let messages;
                    try {
                        messages = Formatters.TextMessageFormat.parse(pollXhr.response);
                    }
                    catch (error) {
                        if (this.onClosed) {
                            this.onClosed(error);
                        }
                        return;
                    }
                    messages.forEach((message) => {
                        this.onDataReceived(message.content);
                    });
                }
                this.poll(url);
            }
            else if (this.pollXhr.status == 204) {
                if (this.onClosed) {
                    this.onClosed();
                }
            }
            else {
                if (this.onClosed) {
                    this.onClosed(new Error(`Status: ${pollXhr.status}, Message: ${pollXhr.responseText}`));
                }
            }
        };
        pollXhr.onerror = () => {
            if (this.onClosed) {
                this.onClosed(new Error("Sending HTTP request failed."));
            }
        };
        pollXhr.ontimeout = () => {
            this.poll(url);
        };
        this.pollXhr = pollXhr;
        this.pollXhr.open("GET", url, true);
        this.pollXhr.timeout = 110000;
        this.pollXhr.send();
    }

    send(data) {
        return __awaiter(this, void 0, void 0, function*() {
            return send(this.httpClient, `${this.url}/send?${this.queryString}`, data);
        });
    }

    stop() {
        this.shouldPoll = false;
        if (this.pollXhr) {
            this.pollXhr.abort();
            this.pollXhr = null;
        }
    }
}
const headers = new Map();
headers.set("Content-Type", "application/vnd.microsoft.aspnetcore.method-messages.v1+text");
function send(httpClient, url, data) {
    return __awaiter(this, void 0, void 0, function*() {
        let message = `T${data.length.toString()}:T:${data};`;
        yield httpClient.post(url, message, headers);
    });
}
