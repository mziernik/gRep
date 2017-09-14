import {
    Record,
    Repository,
    Cell,
    Column,
    RepoConfig,
    Dev,
    Utils,
    CRUDE,
    Ready,
    Type,
    AppEvent
} from "../core.js";
import {Icon} from "../components.js";


export class RWebApi extends Repository {

    static PK: Column = new Column((c: Column) => {
        c.key = "pk";
        c.name = "#";
        c.type = Type.INT;
        c.autoGenerated = true;
        c.required = true;
        c.unique = true;
        c.disabled = true;
    });

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = Type.STRING;
    });

    static REQUEST: Column = new Column((c: Column) => {
        c.key = "request";
        c.name = "^";
        c.hint = "Żądanie / odpowiedź";
        c.type = Type.BOOLEAN;
        c.enumIcons = {
            true: Icon.ARROW_UP,
            false: Icon.ARROW_DOWN
        };
        c.enumerate = {
            true: "Żądanie",
            false: "Odpowiedź"
        };
    });

    static EVENT: Column = new Column((c: Column) => {
        c.key = "event";
        c.name = "Zdarzenie";
        c.type = Type.BOOLEAN;
    });

    static DATE: Column = new Column((c: Column) => {
        c.key = "date";
        c.name = "Data";
        c.type = Type.TIMESTAMP;
    });

    static METHOD: Column = new Column((c: Column) => {
        c.key = "method";
        c.name = "Metoda";
        c.type = Type.STRING;
    });

    static TYPE: Column = new Column((c: Column) => {
        c.key = "type";
        c.name = "Typ";
        c.type = Type.STRING;
    });

    static SIZE: Column = new Column((c: Column) => {
        c.key = "size";
        c.name = "Rozmiar";
        c.type = Type.SIZE;
        c.writable = false;
    });

    static DATA: Column = new Column((c: Column) => {
        c.key = "data";
        c.name = "Dane";
        c.type = Type.JSON;
        c.writable = false;
    });

    constructor() {
        super((c: RepoConfig) => {
            c.key = "webapi";
            c.name = "WebApi";
            c.description = "Komunikacja WebApi";
            c.record = EWebApi;
            c.primaryKeyColumn = RWebApi.PK;
            c.crude = "R";
            c.group = "Narzędzia";
        })
    }
}

export class EWebApi extends Record {
    PK: Cell = new Cell(this, RWebApi.PK);
    ID: Cell = new Cell(this, RWebApi.ID);
    REQUEST: Cell = new Cell(this, RWebApi.REQUEST);
    EVENT: Cell = new Cell(this, RWebApi.EVENT);
    TYPE: Cell = new Cell(this, RWebApi.TYPE);
    DATE: Cell = new Cell(this, RWebApi.DATE);
    METHOD: Cell = new Cell(this, RWebApi.METHOD);
    SIZE: Cell = new Cell(this, RWebApi.SIZE);
    DATA: Cell = new Cell(this, RWebApi.DATA);
}


export const RWEBAPI: RWebApi = Repository.register(new RWebApi());

RWEBAPI.storage = null;
RWEBAPI.isReady = true;
Ready.confirm("WebApiRepo", RWEBAPI);

AppEvent.WEB_API_ACTION.listen("WebApiRepo", data => {

    const rec: EWebApi = RWEBAPI.createRecord("WebApiRepo", CRUDE.CREATE);
    rec.PK.value = RWEBAPI.max(RWebApi.PK, 0) + 1;
    rec.ID.value = data.id;
    rec.REQUEST.value = data.request;
    rec.EVENT.value = data.request ? null : data.event;
    rec.TYPE.value = data.type;
    rec.DATE.value = data.ts;
    rec.METHOD.value = data.method;
    rec.DATA.value = data.data || data.params;
    rec.SIZE.value = data.size || rec.DATA.value !== null ? JSON.stringify(rec.DATA.value).length : 0;

    Repository.commit("WebApiRepo", [rec]);
});
