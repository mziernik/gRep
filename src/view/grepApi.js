function GrepApi(api) {
    "use strict";

    this.api = api;
    api.httpUrl = api.httpUrl || "http://localhost/api";
    api.wsUrl = api.wsUrl || "ws://localhost/api";
    api.hash = '8txD1A';

    this.data = {
    };

    this.model = {
        edit: function (data) {
            return api.call("model/edit", 'k5hbfQ', 'CRUD', data, {
                "": ["object", true],
                table: ["string", true],
                key: [null, false]
            });
        },
        editMultiple: function (data) {
            return api.call("model/editMultiple", 'irw3RQ', 'CRUD', data, {
                "": ["array", true]
            });
        },
        export: function (data) {
            return api.call("model/export", 'bVJXCg', 'CRUD', data, {});
        },
        getAll: function (data) { // Zwraca dane z wielu tabel
            return api.call("model/getAll", 'iwFzYg', 'CRUD', data, {
                "": ["array", true]
            });
        },
        list: function (data) { // Lista wszystkich rekordów w cache
            return api.call("model/list", 'DVEReg', 'CRUD', data, {});
        },
        remove: function (data) {
            return api.call("model/remove", 'Bzba3A', 'CRUD', data, {
                table: ["string", true],
                key: [null, true]
            });
        }
    };

    this.service = {
        dbModel: {
            edit: function (data) {
                return api.call("service/dbModel/edit", 'k5hbfQ', 'CRUD', data, {
                    "": ["object", true],
                    table: ["string", true],
                    key: [null, false]
                });
            },
            editMultiple: function (data) {
                return api.call("service/dbModel/editMultiple", 'irw3RQ', 'CRUD', data, {
                    "": ["array", true]
                });
            },
            export: function (data) {
                return api.call("service/dbModel/export", 'bVJXCg', 'CRUD', data, {});
            },
            getAll: function (data) { // Zwraca dane z wielu tabel
                return api.call("service/dbModel/getAll", 'iwFzYg', 'CRUD', data, {
                    "": ["array", true]
                });
            },
            list: function (data) { // Lista wszystkich rekordów w cache
                return api.call("service/dbModel/list", 'DVEReg', 'CRUD', data, {});
            },
            remove: function (data) {
                return api.call("service/dbModel/remove", 'Bzba3A', 'CRUD', data, {
                    table: ["string", true],
                    key: [null, true]
                });
            }
        },
        httpSession: {
            getAll: function (data) {
                return api.call("service/httpSession/getAll", 'u4EVMA', 'CRUD', data, {});
            }
        },
        notifications: {
            getPatterns: function (data) {
                return api.call("service/notifications/getPatterns", 'ISk94w', 'CRUD', data, {});
            },
            getSources: function (data) {
                return api.call("service/notifications/getSources", 'aTzqHw', 'CRUD', data, {});
            },
            hashChange: function (data) {
                return api.call("service/notifications/hashChange", 'qHTEcg', 'CRUD', data, {
                    hash: ["string", true]
                });
            },
            log: function (data) {
                return api.call("service/notifications/log", '2vFHMg', 'CRUD', data, {
                    "": ["object", true],
                    type: ["string", true],
                    value: ["string", true]
                });
            },
            register: function (data) {
                return api.call("service/notifications/register", 'SbXo2Q', 'CRUD', data, {
                    "": ["object", true]
                });
            }
        },
        session: {
            authorize: function (data) {
                return api.call("service/session/authorize", 'MVfGRQ', 'CRUD', data, {
                    "": ["json", true],
                    username: ["string", true]
                });
            },
            getCurrentSession: function (data) {
                return api.call("service/session/getCurrentSession", 'F9SuFg', 'CRUD', data, {});
            },
            getCurrentUser: function (data) {
                return api.call("service/session/getCurrentUser", 'XPeYNg', 'CRUD', data, {});
            }
        },
        getData: function (data) { // Zwraca wszystko co może się przydać
            return api.call("service/getData", 'VxzWSg', 'CRUD', data, {
                "": ["array", true]
            });
        }
    };

    this.export_ = function (data) {
        return api.call("export_", 'ijnFQQ', 'CRUD', data, {});
    };

    this.test1 = function (data) {
        return api.call("test1", 'V53vnw', 'CRUD', data, {
            bool: ["boolean", true],
            int: ["number", true],
            str: ["string", false],
            object: ["object", true],
            array: ["array", true]
        });
    };

    api.initImpl(this);

}