import {HubConnection} from "../core/webapi/SignalR/HubConnection";
import  API from "./API";
import Debug from "../core/Debug";
import Events from "./Events";
import Alert from "../core/Alert";
import PromiseEx from "../core/PromiseEx";

export type State = "init" | "connecting" | "connected" | "disconnected";


export default class SignalR {

    static state: State = "init";


    static instance: SignalR;
    connected: boolean = false;
    queue = [];

    conn: HubConnection;


    static call(method: string, args: [], onResponse: (result: []) => void): Promise {
        if (!SignalR.instance)
            SignalR.instance = new SignalR();
        return SignalR.instance.invoke(...arguments);
    }


    doInvoke(p: PromiseEx) {
        p.created = new Date();
        this.conn.invoke(p.method, ...p.args)
            .then(e => {
                try {
                    p.duration = new Date().getTime() - p.created.getTime();
                    Debug.log(this, p.method + ", czas: " + p.duration + "ms");
                    if (typeof p.onResponse === "function")
                        p.onResponse(e);
                    p.resolve(e);
                } catch (ex) {
                    Debug.error(ex);
                    throw ex;
                }
            })
            .catch(e => {
                Debug.error(this, e);
                if (!p.hasCatch)
                    Alert.error(this, e);
                p.reject(e);
            });
    }

    invoke(method: string, args: [], onResponse: (result: []) => void): Promise {

        const p: PromiseEx = new PromiseEx((resolve, reject) => {
        });

        p.method = method;
        p.args = args;
        p.onResponse = onResponse;

        if (this.connected)
            this.doInvoke(p);
        else
            this.queue.push(p);

        if (!this.conn) {
            setState("connecting");

            this.conn = HubConnection.create(API.url);
            this.conn.start()
                .then((xxx) => {
                    this.connected = true;
                    setState("connected");

                    this.queue.forEach(p => this.doInvoke(p));
                    this.queue.length = 0;
                })
                .catch((e: Object) => {
                    if (e && e.status === 0 && e.statusText === "")
                        e = new Error("Brak połączenia z serwerem");
                    this.conn = null;
                    this.connected = false;
                    setState("disconnected");
                    p.reject(e);
                });

            this.conn.onClosed = (e) => {
                this.conn = null;
                this.connected = false;
                setState("disconnected");
            };
        }


        return p;
    }

}


function setState(state: state) {
    SignalR.state = state;
    Events.WEB_API_STATUS.send(this, state);
}

