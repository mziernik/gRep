import {Record, Repository, Cell, Column, RepoConfig, Type} from "../core.js";

export class RConfig extends Repository {

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = Type.KEY;
        c.readOnly = true;
    });

    static PARENT: Column = new Column((c: Column) => {
        c.key = "parent";
        c.name = "Rodzic";
        c.type = Type.KEY;
        c.readOnly = true;
        c.hidden = true;
        c.foreign = () => RCONFIG;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = Type.STRING;
        c.readOnly = true;
    });

    static TYPE: Column = new Column((c: Column) => {
        c.key = "type";
        c.name = "Typ";
        c.type = Type.DATA_TYPE;
        c.readOnly = true;
        c.hidden = true;
    });

    static REQUIRED: Column = new Column((c: Column) => {
        c.key = "required";
        c.name = "Wymagane";
        c.type = Type.BOOLEAN;
        c.readOnly = true;
        c.hidden = true;
    });

    static VALUE: Column = new Column((c: Column) => {
        c.key = "value";
        c.name = "Wartość";
        c.type = Type.JSON;
    });

    static DEFAULT_VALUE: Column = new Column((c: Column) => {
        c.key = "defVAL";
        c.name = "Wartość domyślna";
        c.type = Type.JSON;
        c.readOnly = true;
        c.hidden = true;
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = Type.MEMO;
        c.hidden = true;
    });

    static LOCAL: Column = new Column((c: Column) => {
        c.key = "local";
        c.name = "Lokalne";
        c.type = Type.BOOLEAN;
        c.readOnly = true;
        c.hidden = true;
        c.description = "Czy wartość zostanie zapisana tylko lokalnie";
    });

    constructor() {
        super((c: RepoConfig) => {
            c.key = "app.config";
            c.name = "Konfiguracja";
            c.description = "Komunikacja usługi";
            c.record = EConfig;
            c.primaryKeyColumn = RConfig.KEY;
            c.parentColumn = RConfig.PARENT;
            c.crude = "R";
            c.group = "Narzędzia";
        })
    }
}

export class EConfig extends Record {
    KEY: Cell = new Cell(this, RConfig.KEY);
    PARENT: Cell = new Cell(this, RConfig.PARENT);
    NAME: Cell = new Cell(this, RConfig.NAME);
    TYPE: Cell = new Cell(this, RConfig.TYPE);
    REQUIRED: Cell = new Cell(this, RConfig.REQUIRED);
    VALUE: Cell = new Cell(this, RConfig.VALUE);
    DEFAULT_VALUE: Cell = new Cell(this, RConfig.DEFAULT_VALUE);
    DESC: Cell = new Cell(this, RConfig.DESC);
    LOCAL: Cell = new Cell(this, RConfig.LOCAL);

}


export const RCONFIG: RConfig = Repository.register(new RConfig());
RCONFIG.storage = null;
RCONFIG.confirmReadyState();

