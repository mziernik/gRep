import {Record, Repository, Cell, Column, RepoConfig, Type, CRUDE, Field} from "../core.js";
import ConfigField from "./ConfigField";
import ConfigNode from "./ConfigNode";

// ---------------------------------------------- gałąź drzewa ---------------------------------------------------------

export class RConfigNode extends Repository {

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
        c.foreign = () => R_CONFIG_NODE;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = Type.STRING;
        c.readOnly = true;
        c.required = true;
    });

    static ADVANCED: Column = new Column((c: Column) => {
        c.key = "advanced";
        c.name = "Zaawansowane";
        c.type = Type.BOOLEAN;
    });

    constructor() {
        super((c: RepoConfig) => {
            c.key = "app.config.tree";
            c.name = "Drzewo";
            c.record = EConfigNode;
            c.primaryKeyColumn = RConfigNode.KEY;
            c.parentColumn = RConfigNode.PARENT;
            c.displayNameColumn = RConfigNode.NAME;
            c.crude = "R";
            c.group = "Konfiguracja";
        })
    }

    create(cn: ConfigNode): EConfigField {
        const rec: EConfigNode = this.createRecord("CONFIG", CRUDE.CREATE);
        rec.KEY.value = cn.key;
        rec.NAME.value = cn.name;
        // ToDo: Inicjalizacja zbiorcza wszystkich rekordów
        Repository.update("CONFIG", [rec]);
        return rec;
    }
}


export class EConfigNode extends Record {

    KEY: Cell = new Cell(this, RConfigNode.KEY);
    PARENT: Cell = new Cell(this, RConfigNode.PARENT);
    NAME: Cell = new Cell(this, RConfigNode.NAME);
    ADVANCED: Cell = new Cell(this, RConfigNode.ADVANCED);

}

export class EConfigGroup extends Record {

    KEY: Cell = new Cell(this, RConfigGroup.KEY);
    PARENT: Cell = new Cell(this, RConfigGroup.PARENT);
    NAME: Cell = new Cell(this, RConfigGroup.NAME);
    ADVANCED: Cell = new Cell(this, RConfigGroup.ADVANCED);

}

// ------------------------------------------- pole konfiguracji -----------------------------------------------------

export class RConfigField extends Repository {

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = Type.KEY;
        c.readOnly = true;
    });

    static NODE: Column = new Column((c: Column) => {
        c.key = "parent";
        c.name = "Rodzic";
        c.type = Type.KEY;
        c.readOnly = true;
        c.hidden = true;
        c.foreign = () => R_CONFIG_NODE;
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

    static ADVANCED: Column = new Column((c: Column) => {
        c.key = "advanced";
        c.name = "Zaawansowane";
        c.type = Type.BOOLEAN;
    });

    constructor() {
        super((c: RepoConfig) => {
            c.key = "app.config";
            c.name = "Elementy";
            c.description = "Konfiguracja usługi";
            c.record = EConfigField;
            c.primaryKeyColumn = RConfigField.KEY;
            c.parentColumn = RConfigField.PARENT;
            c.displayNameColumn = RConfigField.NAME;
            c.crude = "R";
            c.group = "Konfiguracja";
        })
    }

    create(cf: ConfigField): EConfigField {
        const field: Field = cf.field;
        const rec: EConfigField = this.createRecord("CONFIG", CRUDE.CREATE);
        rec.KEY.value = field.key;
        rec.TYPE.value = field.type.name;
        rec.NAME.value = field.name;
        rec.DEFAULT_VALUE.value = field.config.defaultValue;
        rec.REQUIRED.value = true;
        rec.LOCAL.value = true;
        // ToDo: Inicjalizacja zbiorcza wszystkich rekordów
        Repository.update("CONFIG", [rec]);
        return rec;
    }
}

export class EConfigField extends Record {

    KEY: Cell = new Cell(this, RConfigField.KEY);
    NODE: Cell = new Cell(this, RConfigField.NODE);
    NAME: Cell = new Cell(this, RConfigField.NAME);
    TYPE: Cell = new Cell(this, RConfigField.TYPE);
    REQUIRED: Cell = new Cell(this, RConfigField.REQUIRED);
    VALUE: Cell = new Cell(this, RConfigField.VALUE);
    DEFAULT_VALUE: Cell = new Cell(this, RConfigField.DEFAULT_VALUE);
    DESC: Cell = new Cell(this, RConfigField.DESC);
    LOCAL: Cell = new Cell(this, RConfigField.LOCAL);
    ADVANCED: Cell = new Cell(this, RConfigField.ADVANCED);

}

//----------------------------------------------------------------------------------------------------------------------

export const R_CONFIG_NODE: RConfigNode = Repository.register(new RConfigNode());
export const R_CONFIG_FIELD: RConfigField = Repository.register(new RConfigField());

R_CONFIG_FIELD.storage = null;
R_CONFIG_FIELD.confirmReadyState();
R_CONFIG_NODE.storage = null;
R_CONFIG_NODE.confirmReadyState();
