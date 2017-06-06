// @flow
'use strict';

import WebApi from "../core/webapi/WebApi";
import WebApiRequest from "../core/webapi/Request";
import WebApiResponse from "../core/webapi/Response";

type OnSuccess = (data: ?any, response: WebApiResponse) => void;
type OnError = (error: Object, response: WebApiResponse) => void;

export default class GrepApi {

    api: WebApi;

    constructor(api: WebApi) {
        this.api = api;
        api.httpUrl = api.httpUrl || "http://localhost/api";
        api.wsUrl = api.wsUrl || "ws://localhost/api";
        api.hash = 'puKl8g';

    }
    data: Object = {
    };

    model: Object = {
        edit: (params: {table: string, key: ?any}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("model/edit", 'k5hbfQ', params, onSuccess, onError)
        ,
        editMultiple: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("model/editMultiple", 'irw3RQ', null, onSuccess, onError)
        ,
        export: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("model/export", 'bVJXCg', null, onSuccess, onError)
        ,
        /** Zwraca dane z wielu tabel */
        getAll: (params: {repositories: string[]}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("model/getAll", '9shFmw', params, onSuccess, onError)
        ,
        /** Lista wszystkich rekordów w cache */
        list: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("model/list", 'DVEReg', null, onSuccess, onError)
        ,
        remove: (params: {table: string, key: any}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("model/remove", 'Bzba3A', params, onSuccess, onError)

    };

    service: Object = {
        dbModel: {
            edit: (params: {table: string, key: ?any}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/dbModel/edit", 'k5hbfQ', params, onSuccess, onError)
            ,
            editMultiple: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/dbModel/editMultiple", 'irw3RQ', null, onSuccess, onError)
            ,
            export: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/dbModel/export", 'bVJXCg', null, onSuccess, onError)
            ,
            /** Zwraca dane z wielu tabel */
            getAll: (params: {repositories: string[]}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/dbModel/getAll", '9shFmw', params, onSuccess, onError)
            ,
            /** Lista wszystkich rekordów w cache */
            list: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/dbModel/list", 'DVEReg', null, onSuccess, onError)
            ,
            remove: (params: {table: string, key: any}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/dbModel/remove", 'Bzba3A', params, onSuccess, onError)

        },
        httpSession: {
            getAll: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/httpSession/getAll", 'u4EVMA', null, onSuccess, onError)

        },
        notifications: {
            getPatterns: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/notifications/getPatterns", 'ISk94w', null, onSuccess, onError)
            ,
            getSources: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/notifications/getSources", 'aTzqHw', null, onSuccess, onError)
            ,
            hashChange: (params: {hash: string}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/notifications/hashChange", 'qHTEcg', params, onSuccess, onError)
            ,
            log: (params: {type: string, value: string}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/notifications/log", '2vFHMg', params, onSuccess, onError)
            ,
            register: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/notifications/register", 'SbXo2Q', null, onSuccess, onError)

        },
        session: {
            authorize: (params: {username: string}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/session/authorize", 'MVfGRQ', params, onSuccess, onError)
            ,
            getCurrentSession: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/session/getCurrentSession", 'F9SuFg', null, onSuccess, onError)
            ,
            getCurrentUser: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/session/getCurrentUser", 'XPeYNg', null, onSuccess, onError)

        },
        /** Zwraca wszystko co może się przydać */
        getData: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("service/getData", 'VxzWSg', null, onSuccess, onError)

    };

    export_: Object = (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
        this.api.call("export_", 'ijnFQQ', null, onSuccess, onError)
    ;

    test1: Object = (params: {bool: boolean, int: number, str: ?string, object: Object, array: Array}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
        this.api.call("test1", 'V53vnw', params, onSuccess, onError)
    ;

}