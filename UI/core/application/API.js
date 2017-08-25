/**
 * Klasa definiuje metody zewnętrznego API
 */

import WebApi from "../webapi/WebApi";
import {EError, Repository, Check, Field, Record, Is} from "../core";
import WebApiResponse from "../webapi/Response";
import Alert from "../component/alert/Alert";
import WebApiRequest from "../webapi/Request";

type OnSuccess = (data: ?any, response: WebApiResponse) => void;
type OnError = (error: Object, response: WebApiResponse) => void;

let api;
let wApi: WebApi;
let methods;


export default class API {

    static get instance(): Object {
        return api;
    }

    static downloadFile(field: Field, onSuccess: OnSuccess, onError: OnError): WebApiRequest {
        if (!methods || !field) return;
        const obj = field.value || {};
        const rec: Record = Check.instanceOf(field.record, [Record], new Error("Pole nie posiada przypisanego rekordu"));
        return methods.downloadFile({
            repo: rec.repo.key,
            pk: rec.pk,
            column: field.key,
            fileKey: obj.key
        }, (data, resp) => {

            let href: string = data.href;

            if (!href.contains("://"))
                href = wApi.httpUrl + href;

            if (onSuccess) {
                data.hrefFrmt = href;
                onSuccess(data, resp);
                return;
            }


            if (data.preview === true || obj.preview) {
                const win: Window = window.open(href);
                win.focus();
                return;
            }

            const link = document.createElement("a");
            link.download = data.name || obj.name || field.name;
            link.href = href;
            link.click();
        }, onError);


    }

    static uploadFile(field: Field) {

    }


    static repoList(onSuccess: OnSuccess, onError: OnError): WebApiRequest {
        return methods ? methods.list(onSuccess, onError) : null;
    }

    static repoGet(data: Object, onSuccess: OnSuccess, onError: OnError): WebApiRequest {
        return methods ? methods.get(data, onSuccess, onError) : null;
    }

    static repoAction(data: Object, onSuccess: OnSuccess, onError: OnError): WebApiRequest {
        return methods ? methods.action(data, onSuccess, onError) : null;
    }

    static repoEdit(data: Object, onSuccess: OnSuccess, onError: OnError): WebApiRequest {
        return methods ? methods.edit(data, onSuccess, onError) : null;
    }

    static authorizeUser(login: string, password: string, onSuccess: OnSuccess, onError: OnError): WebApiRequest {
        if (!api) return;
        return api.login(login || "", password || "", onSuccess, onError);
    }


    static set(_api, repoMethodsObject: Object) {
        api = _api;
        if (!api) return;
        wApi = Check.instanceOf(api.api, [WebApi]);

        methods = repoMethodsObject || _api;

        wApi.onError = (error: EError, response: WebApiResponse, handled: boolean) => {
            if (!handled)
                Alert.error(this, error.message);
        };

        wApi.onEvent.listen("API", obj => {
            switch (obj.source) {
                case "repository":
                    Repository.update(obj.response, obj.data);
                    return;
            }
        });

    }

}