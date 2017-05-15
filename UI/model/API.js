import {HubConnection} from "../core/webapi/SignalR/HubConnection";
import SignalR from "./SignalR";
import WebApi from "../core/webapi/WebApi";
import GrepApi from "./GrepApi";

export default class API {
    static url: string = location.origin + "/hubs/MainHub";

    static getTestClassess(onResponse: (result: []) => void): Promise {
        return SignalR.call("GetTestClassess", [], onResponse);
    }

    static login(login: string, password: string, onResponse: (result: []) => void): Promise {
        return SignalR.call("LogIn", [login, password], onResponse);
    }


    static grep() {

        gapi = gapi || new GrepApi(new WebApi("http://localhost/api"));

        gapi.test1({
                bool: true,
                int: 1234,
                str: "qqqqqqqqqqqq",
                object: {nazwa: "wartość"},
                array: [5, "a", false, null]
            },
            (e, f) => {
                debugger;
            }, (e, f) => {
                debugger
            });

    }

}


let gapi: GrepApi;

if (process && process.env && process.env.WEB_API_URL)
    API.url = process.env.WEB_API_URL;


