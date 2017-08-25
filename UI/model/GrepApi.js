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
        api.hash = 'bxh31Q';

    }
    data: Object = {
    };

    repository: Object = {
        action: (params: {repo: string, action: string, pk: any, params: Object}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("repository/action", '8aErEw', params, onSuccess, onError)
        ,
        /** Pobierz plik z repozytorium */
        downloadFile: (params: {repo: string, pk: any, column: string, fileKey: ?string}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("repository/downloadFile", 'reKA4g', params, onSuccess, onError)
        ,
        edit: (params: {data: Object}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("repository/edit", 'yVVCCw', params, onSuccess, onError)
        ,
        export: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("repository/export", 'bVJXCg', null, onSuccess, onError)
        ,
        /** Zwraca dane z wielu tabel */
        get: (params: {repositories: ?jcollection}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("repository/get", 'gybJTQ', params, onSuccess, onError)
        ,
        /** Lista wszystkich rekordów w cache */
        list: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("repository/list", 'DVEReg', null, onSuccess, onError)
        ,
        /** Inicjalizacja procesu wysyłania pliku */
        uploadFile: (params: {repo: string, pk: any, column: string, name: string, size: number}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
            this.api.call("repository/uploadFile", 'PaZorg', params, onSuccess, onError)

    };

    service: Object = {
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
            register: (params: {sources: string[]}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/notifications/register", 'SJsxbQ', params, onSuccess, onError)

        },
        repository: {
            action: (params: {repo: string, action: string, pk: any, params: Object}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/repository/action", '8aErEw', params, onSuccess, onError)
            ,
            /** Pobierz plik z repozytorium */
            downloadFile: (params: {repo: string, pk: any, column: string, fileKey: ?string}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/repository/downloadFile", 'reKA4g', params, onSuccess, onError)
            ,
            edit: (params: {data: Object}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/repository/edit", 'yVVCCw', params, onSuccess, onError)
            ,
            export: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/repository/export", 'bVJXCg', null, onSuccess, onError)
            ,
            /** Zwraca dane z wielu tabel */
            get: (params: {repositories: ?jcollection}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/repository/get", 'gybJTQ', params, onSuccess, onError)
            ,
            /** Lista wszystkich rekordów w cache */
            list: (onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/repository/list", 'DVEReg', null, onSuccess, onError)
            ,
            /** Inicjalizacja procesu wysyłania pliku */
            uploadFile: (params: {repo: string, pk: any, column: string, name: string, size: number}, onSuccess: ?OnSuccess = null, onError: ?OnError = null): WebApiRequest =>
                this.api.call("service/repository/uploadFile", 'PaZorg', params, onSuccess, onError)

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