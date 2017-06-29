import {Field, Column, RepoConfig, Type, Repository, Record} from "../core/core";


//--------------------------------- Status ----------------------------------------------

export class RStatus extends Repository {

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = "key";
        c.required = true;
        c.unique = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
    });

    static VALUE: Column = new Column((c: Column) => {
        c.key = "value";
        c.name = "Wartość";
        c.type = "any";
    });

    static TYPE: Column = new Column((c: Column) => {
        c.key = "type";
        c.name = "Typ";
        c.type = "string";
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });

    static PARENT: Column = new Column((c: Column) => {
        c.key = "parent";
        c.name = "Rodzic";
        c.type = "key";
        c.foreign = () => R_STATUS;
    });

    static GROUP: Column = new Column((c: Column) => {
        c.key = "group";
        c.name = "Grupa";
        c.type = "boolean";
    });

    static COMMENT: Column = new Column((c: Column) => {
        c.key = "comment";
        c.name = "Komentarz";
        c.type = "string";
    });

    static COLOR: Column = new Column((c: Column) => {
        c.key = "color";
        c.name = "Kolor";
        c.type = "string";
    });

    static UPDATED: Column = new Column((c: Column) => {
        c.key = "updated";
        c.name = "Zaktualizowany";
        c.type = "timestamp";
    });

    static UPDATES: Column = new Column((c: Column) => {
        c.key = "updates";
        c.name = "Aktualizacji";
        c.type = "int";
    });

    static ATTRS: Column = new Column((c: Column) => {
        c.key = "attrs";
        c.name = "Atrybuty";
        c.type = "{string, any}";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "status";
            c.name = "Status";
            c.record = RStatusRecord;
            c.primaryKeyColumn = RStatus.KEY;
            c.displayNameColumn = RStatus.NAME;
            c.crude = "R";
            c.local = true;
            c.autoUpdate = true;
        });
    }

}

export class RStatusRecord extends Record {

    KEY: Field = new Field(RStatus.KEY, this);
    NAME: Field = new Field(RStatus.NAME, this);
    VALUE: Field = new Field(RStatus.VALUE, this);
    TYPE: Field = new Field(RStatus.TYPE, this);
    DESC: Field = new Field(RStatus.DESC, this);
    PARENT: Field = new Field(RStatus.PARENT, this);
    GROUP: Field = new Field(RStatus.GROUP, this);
    COMMENT: Field = new Field(RStatus.COMMENT, this);
    COLOR: Field = new Field(RStatus.COLOR, this);
    UPDATED: Field = new Field(RStatus.UPDATED, this);
    UPDATES: Field = new Field(RStatus.UPDATES, this);
    ATTRS: Field = new Field(RStatus.ATTRS, this);

}

//--------------------------------- Wątki ----------------------------------------------

export class RThreads extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "long";
        c.required = true;
        c.unique = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
    });

    static GROUP: Column = new Column((c: Column) => {
        c.key = "group";
        c.name = "Grupa";
        c.type = "string";
    });

    static STATE: Column = new Column((c: Column) => {
        c.key = "state";
        c.name = "Stan";
        c.type = "string";
    });

    static ALIVE: Column = new Column((c: Column) => {
        c.key = "alive";
        c.name = "Żyje";
        c.type = "boolean";
    });

    static DAEMON: Column = new Column((c: Column) => {
        c.key = "daemon";
        c.name = "Demon";
        c.type = "boolean";
    });

    static INTERRUPTED: Column = new Column((c: Column) => {
        c.key = "interrupted";
        c.name = "Przerwany";
        c.type = "boolean";
    });

    static PRIORITY: Column = new Column((c: Column) => {
        c.key = "priority";
        c.name = "Priorytet";
        c.type = "int";
    });

    static CPU_TIME: Column = new Column((c: Column) => {
        c.key = "cpuTime";
        c.name = "Czas procesora";
        c.type = "duration";
    });

    static USER_TIME: Column = new Column((c: Column) => {
        c.key = "userTime";
        c.name = "Czas użytkownika";
        c.type = "duration";
    });

    static ALLOC: Column = new Column((c: Column) => {
        c.key = "alloc";
        c.name = "Zaalokowano";
        c.type = "size";
    });

    static BLOCKED: Column = new Column((c: Column) => {
        c.key = "blocked";
        c.name = "Blokady";
        c.type = "int";
    });

    static WAITED: Column = new Column((c: Column) => {
        c.key = "waited";
        c.name = "Oczekiwania";
        c.type = "int";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "threads";
            c.name = "Wątki";
            c.record = RThreadsRecord;
            c.primaryKeyColumn = RThreads.ID;
            c.displayNameColumn = RThreads.NAME;
            c.crude = "R";
            c.local = true;
            c.autoUpdate = true;
        });
    }

}

export class RThreadsRecord extends Record {

    ID: Field = new Field(RThreads.ID, this);
    NAME: Field = new Field(RThreads.NAME, this);
    GROUP: Field = new Field(RThreads.GROUP, this);
    STATE: Field = new Field(RThreads.STATE, this);
    ALIVE: Field = new Field(RThreads.ALIVE, this);
    DAEMON: Field = new Field(RThreads.DAEMON, this);
    INTERRUPTED: Field = new Field(RThreads.INTERRUPTED, this);
    PRIORITY: Field = new Field(RThreads.PRIORITY, this);
    CPU_TIME: Field = new Field(RThreads.CPU_TIME, this);
    USER_TIME: Field = new Field(RThreads.USER_TIME, this);
    ALLOC: Field = new Field(RThreads.ALLOC, this);
    BLOCKED: Field = new Field(RThreads.BLOCKED, this);
    WAITED: Field = new Field(RThreads.WAITED, this);

}

//--------------------------------- Atrybut ----------------------------------------------

export class RAttribute extends Repository {

    static TEST: Column = new Column((c: Column) => {
        c.key = "test";
        c.name = "Test";
        c.type = "string";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
    });

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static UID: Column = new Column((c: Column) => {
        c.key = "uid";
        c.name = "UID";
        c.type = "uid";
        c.autoGenerated = true;
        c.hidden = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static CREATED: Column = new Column((c: Column) => {
        c.key = "created";
        c.name = "Utworzono";
        c.type = "timestamp";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
    });

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = "key";
        c.required = true;
        c.unique = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
        c.required = true;
    });

    static PARENT: Column = new Column((c: Column) => {
        c.key = "parent";
        c.name = "Rodzic";
        c.type = "int";
        c.foreign = () => R_CATEGORY;
    });

    static ELEMENTS: Column = new Column((c: Column) => {
        c.key = "elements";
        c.name = "Elementy";
        c.type = "int[]";
        c.foreign = () => R_ATTRIBUTE_ELEMENT;
        c.required = true;
    });

    static DEF_VAL: Column = new Column((c: Column) => {
        c.key = "defVal";
        c.name = "Wartość domyślna";
        c.type = "string[]";
    });

    static REQUIRED: Column = new Column((c: Column) => {
        c.key = "required";
        c.name = "Wymagane";
        c.type = "boolean[]";
    });

    static ICON: Column = new Column((c: Column) => {
        c.key = "icon";
        c.name = "Ikona";
        c.type = "string";
        c.defaultValue = true;
        c.required = true;
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "attribute";
            c.name = "Atrybut";
            c.record = RAttributeRecord;
            c.primaryKeyColumn = RAttribute.ID;
            c.displayNameColumn = RAttribute.NAME;
            c.crude = "CRUD";
            c.local = false;
            c.autoUpdate = true;
        });
    }

}

export class RAttributeRecord extends Record {

    TEST: Field = new Field(RAttribute.TEST, this);
    ID: Field = new Field(RAttribute.ID, this);
    UID: Field = new Field(RAttribute.UID, this);
    CREATED: Field = new Field(RAttribute.CREATED, this);
    KEY: Field = new Field(RAttribute.KEY, this);
    NAME: Field = new Field(RAttribute.NAME, this);
    PARENT: Field = new Field(RAttribute.PARENT, this);
    ELEMENTS: Field = new Field(RAttribute.ELEMENTS, this);
    DEF_VAL: Field = new Field(RAttribute.DEF_VAL, this);
    REQUIRED: Field = new Field(RAttribute.REQUIRED, this);
    ICON: Field = new Field(RAttribute.ICON, this);
    DESC: Field = new Field(RAttribute.DESC, this);

}

//--------------------------------- Element atrybutu ----------------------------------------------

export class RAttributeElement extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static UID: Column = new Column((c: Column) => {
        c.key = "uid";
        c.name = "UIID";
        c.type = "uid";
        c.autoGenerated = true;
        c.hidden = true;
        c.readOnly = true;
    });

    static CREATED: Column = new Column((c: Column) => {
        c.key = "created";
        c.name = "Utworzono";
        c.type = "timestamp";
        c.autoGenerated = true;
        c.readOnly = true;
    });

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = "key";
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
        c.required = true;
    });

    static TYPE: Column = new Column((c: Column) => {
        c.key = "type";
        c.name = "Typ";
        c.type = "string";
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });

    static REQUIRED: Column = new Column((c: Column) => {
        c.key = "required";
        c.name = "Wymagany";
        c.type = "boolean";
    });

    static DEF_VAL: Column = new Column((c: Column) => {
        c.key = "defVal";
        c.name = "Wartość domyślna";
        c.type = "string[]";
    });

    static MIN: Column = new Column((c: Column) => {
        c.key = "min";
        c.name = "Minimum";
        c.type = "int";
    });

    static MAX: Column = new Column((c: Column) => {
        c.key = "max";
        c.name = "Maksimum";
        c.type = "int";
    });

    static REGEX: Column = new Column((c: Column) => {
        c.key = "regex";
        c.name = "Wyrażenie sprawdzające";
        c.type = "regex";
    });

    static FOREIGN_ELM: Column = new Column((c: Column) => {
        c.key = "foreignElm";
        c.name = "Element zewnętrzny";
        c.type = "int";
    });

    static ENCRYPTED: Column = new Column((c: Column) => {
        c.key = "encrypted";
        c.name = "Zaszyfrowany";
        c.type = "boolean";
    });

    static ENUMERATE: Column = new Column((c: Column) => {
        c.key = "enumerate";
        c.name = "Enumerata";
        c.type = "{string, string}";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "attrElm";
            c.name = "Element atrybutu";
            c.record = RAttributeElementRecord;
            c.primaryKeyColumn = RAttributeElement.ID;
            c.displayNameColumn = RAttributeElement.NAME;
            c.crude = "CRUD";
            c.local = false;
            c.autoUpdate = true;
        });
    }

}

export class RAttributeElementRecord extends Record {

    ID: Field = new Field(RAttributeElement.ID, this);
    UID: Field = new Field(RAttributeElement.UID, this);
    CREATED: Field = new Field(RAttributeElement.CREATED, this);
    KEY: Field = new Field(RAttributeElement.KEY, this);
    NAME: Field = new Field(RAttributeElement.NAME, this);
    TYPE: Field = new Field(RAttributeElement.TYPE, this);
    DESC: Field = new Field(RAttributeElement.DESC, this);
    REQUIRED: Field = new Field(RAttributeElement.REQUIRED, this);
    DEF_VAL: Field = new Field(RAttributeElement.DEF_VAL, this);
    MIN: Field = new Field(RAttributeElement.MIN, this);
    MAX: Field = new Field(RAttributeElement.MAX, this);
    REGEX: Field = new Field(RAttributeElement.REGEX, this);
    FOREIGN_ELM: Field = new Field(RAttributeElement.FOREIGN_ELM, this);
    ENCRYPTED: Field = new Field(RAttributeElement.ENCRYPTED, this);
    ENUMERATE: Field = new Field(RAttributeElement.ENUMERATE, this);

}

//--------------------------------- Katalog ----------------------------------------------

export class RCatalog extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static UID: Column = new Column((c: Column) => {
        c.key = "uid";
        c.name = "UID";
        c.type = "uid";
        c.autoGenerated = true;
        c.hidden = true;
        c.readOnly = true;
        c.unique = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
        c.required = true;
    });

    static ORDER: Column = new Column((c: Column) => {
        c.key = "order";
        c.name = "Kolejność";
        c.type = "int";
    });

    static CATEGORY: Column = new Column((c: Column) => {
        c.key = "category";
        c.name = "Definicja";
        c.type = "int";
        c.foreign = () => R_CATALOG;
    });

    static CREATED: Column = new Column((c: Column) => {
        c.key = "created";
        c.name = "Utworzono";
        c.type = "timestamp";
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });

    static ABSTRACT: Column = new Column((c: Column) => {
        c.key = "abstract";
        c.name = "Abstrakcyjne";
        c.type = "boolean";
    });

    static PARENT: Column = new Column((c: Column) => {
        c.key = "parent";
        c.name = "Rodzic";
        c.type = "int";
        c.foreign = () => R_CATALOG;
    });

    static ATTRIBUTES: Column = new Column((c: Column) => {
        c.key = "attributes";
        c.name = "Dozwolone atrybuty";
        c.type = "int[]";
        c.foreign = () => R_ATTRIBUTE;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "catalog";
            c.name = "Katalog";
            c.record = RCatalogRecord;
            c.primaryKeyColumn = RCatalog.ID;
            c.displayNameColumn = RCatalog.NAME;
            c.crude = "CRUD";
            c.local = false;
            c.autoUpdate = true;
        });
    }

}

export class RCatalogRecord extends Record {

    ID: Field = new Field(RCatalog.ID, this);
    UID: Field = new Field(RCatalog.UID, this);
    NAME: Field = new Field(RCatalog.NAME, this);
    ORDER: Field = new Field(RCatalog.ORDER, this);
    CATEGORY: Field = new Field(RCatalog.CATEGORY, this);
    CREATED: Field = new Field(RCatalog.CREATED, this);
    DESC: Field = new Field(RCatalog.DESC, this);
    ABSTRACT: Field = new Field(RCatalog.ABSTRACT, this);
    PARENT: Field = new Field(RCatalog.PARENT, this);
    ATTRIBUTES: Field = new Field(RCatalog.ATTRIBUTES, this);

}

//--------------------------------- Atrybut katalogu ----------------------------------------------

export class RCatalogAttribute extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static UID: Column = new Column((c: Column) => {
        c.key = "uid";
        c.name = "UID";
        c.type = "uid";
        c.autoGenerated = true;
        c.hidden = true;
        c.readOnly = true;
        c.unique = true;
    });

    static CREATED: Column = new Column((c: Column) => {
        c.key = "created";
        c.name = "Utworzono";
        c.type = "timestamp";
        c.autoGenerated = true;
        c.readOnly = true;
    });

    static CAT: Column = new Column((c: Column) => {
        c.key = "cat";
        c.name = "Katalog";
        c.type = "int";
        c.foreign = () => R_CATALOG_ATTRIBUTE;
    });

    static ATTR: Column = new Column((c: Column) => {
        c.key = "attr";
        c.name = "Atrybut";
        c.type = "int";
        c.foreign = () => R_CATALOG_ATTRIBUTE;
    });

    static VALUE: Column = new Column((c: Column) => {
        c.key = "value";
        c.name = "Wartość";
        c.type = "string[]";
    });

    static ORDER: Column = new Column((c: Column) => {
        c.key = "order";
        c.name = "Kolejność";
        c.type = "int";
    });

    static CRYPT_KEY: Column = new Column((c: Column) => {
        c.key = "cryptKey";
        c.name = "Klucz";
        c.type = "int[]";
        c.foreign = () => R_CRYPT_KEY;
    });

    static NOTES: Column = new Column((c: Column) => {
        c.key = "notes";
        c.name = "Notatki";
        c.type = "memo";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "catalogAttr";
            c.name = "Atrybut katalogu";
            c.record = RCatalogAttributeRecord;
            c.primaryKeyColumn = RCatalogAttribute.ID;
            c.displayNameColumn = RCatalogAttribute.VALUE;
            c.crude = "CRUD";
            c.local = false;
            c.autoUpdate = true;
        });
    }

}

export class RCatalogAttributeRecord extends Record {

    ID: Field = new Field(RCatalogAttribute.ID, this);
    UID: Field = new Field(RCatalogAttribute.UID, this);
    CREATED: Field = new Field(RCatalogAttribute.CREATED, this);
    CAT: Field = new Field(RCatalogAttribute.CAT, this);
    ATTR: Field = new Field(RCatalogAttribute.ATTR, this);
    VALUE: Field = new Field(RCatalogAttribute.VALUE, this);
    ORDER: Field = new Field(RCatalogAttribute.ORDER, this);
    CRYPT_KEY: Field = new Field(RCatalogAttribute.CRYPT_KEY, this);
    NOTES: Field = new Field(RCatalogAttribute.NOTES, this);

}

//--------------------------------- Kategoria ----------------------------------------------

export class RCategory extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static UID: Column = new Column((c: Column) => {
        c.key = "uid";
        c.name = "UID";
        c.type = "uid";
        c.autoGenerated = true;
        c.hidden = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = "key";
        c.required = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
        c.required = true;
    });

    static CREATED: Column = new Column((c: Column) => {
        c.key = "created";
        c.name = "Utworzono";
        c.type = "timestamp";
        c.autoGenerated = true;
        c.required = true;
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });

    static ICON: Column = new Column((c: Column) => {
        c.key = "icon";
        c.name = "Ikona";
        c.type = "int";
    });

    static CATS: Column = new Column((c: Column) => {
        c.key = "cats";
        c.name = "Kategorie";
        c.type = "int[]";
        c.foreign = () => R_CATEGORY;
    });

    static ATTR: Column = new Column((c: Column) => {
        c.key = "attr";
        c.name = "Dozwolone atrybuty";
        c.type = "int";
        c.foreign = () => R_ATTRIBUTE;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "category";
            c.name = "Kategoria";
            c.record = RCategoryRecord;
            c.primaryKeyColumn = RCategory.ID;
            c.displayNameColumn = RCategory.NAME;
            c.crude = "CRUD";
            c.local = false;
            c.autoUpdate = true;
        });
    }

}

export class RCategoryRecord extends Record {

    ID: Field = new Field(RCategory.ID, this);
    UID: Field = new Field(RCategory.UID, this);
    KEY: Field = new Field(RCategory.KEY, this);
    NAME: Field = new Field(RCategory.NAME, this);
    CREATED: Field = new Field(RCategory.CREATED, this);
    DESC: Field = new Field(RCategory.DESC, this);
    ICON: Field = new Field(RCategory.ICON, this);
    CATS: Field = new Field(RCategory.CATS, this);
    ATTR: Field = new Field(RCategory.ATTR, this);

}

//--------------------------------- Atrybut kategorii ----------------------------------------------

export class RCategoryAttribute extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.required = true;
        c.unique = true;
    });

    static UID: Column = new Column((c: Column) => {
        c.key = "uid";
        c.name = "UID";
        c.type = "uid";
        c.autoGenerated = true;
        c.hidden = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static CAT: Column = new Column((c: Column) => {
        c.key = "cat";
        c.name = "Kategoria";
        c.type = "int";
        c.foreign = () => R_CATEGORY;
    });

    static ATTR: Column = new Column((c: Column) => {
        c.key = "attr";
        c.name = "Atrybut";
        c.type = "int";
        c.foreign = () => R_ATTRIBUTE;
    });

    static MASK: Column = new Column((c: Column) => {
        c.key = "mask";
        c.name = "Maska wyświetlania";
        c.type = "string";
    });

    static DEF_VAL: Column = new Column((c: Column) => {
        c.key = "defVal";
        c.name = "Wartość domyślna";
        c.type = "string[]";
    });

    static REQUIRED: Column = new Column((c: Column) => {
        c.key = "required";
        c.name = "Wymagane";
        c.type = "boolean";
    });

    static MULTIPLE: Column = new Column((c: Column) => {
        c.key = "multiple";
        c.name = "Wielokrotne";
        c.type = "boolean";
    });

    static UNIQUE: Column = new Column((c: Column) => {
        c.key = "unique";
        c.name = "Unikalny";
        c.type = "boolean";
    });

    static ABSTRACT: Column = new Column((c: Column) => {
        c.key = "abstract";
        c.name = "Abstrakcyjny";
        c.type = "boolean";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "categoryAttr";
            c.name = "Atrybut kategorii";
            c.record = RCategoryAttributeRecord;
            c.primaryKeyColumn = RCategoryAttribute.ID;
            c.crude = "CRUD";
            c.local = false;
            c.autoUpdate = true;
        });
    }

}

export class RCategoryAttributeRecord extends Record {

    ID: Field = new Field(RCategoryAttribute.ID, this);
    UID: Field = new Field(RCategoryAttribute.UID, this);
    CAT: Field = new Field(RCategoryAttribute.CAT, this);
    ATTR: Field = new Field(RCategoryAttribute.ATTR, this);
    MASK: Field = new Field(RCategoryAttribute.MASK, this);
    DEF_VAL: Field = new Field(RCategoryAttribute.DEF_VAL, this);
    REQUIRED: Field = new Field(RCategoryAttribute.REQUIRED, this);
    MULTIPLE: Field = new Field(RCategoryAttribute.MULTIPLE, this);
    UNIQUE: Field = new Field(RCategoryAttribute.UNIQUE, this);
    ABSTRACT: Field = new Field(RCategoryAttribute.ABSTRACT, this);

}

//--------------------------------- Zasób ----------------------------------------------

export class RResource extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static UID: Column = new Column((c: Column) => {
        c.key = "uid";
        c.name = "UID";
        c.type = "uid";
        c.autoGenerated = true;
        c.hidden = true;
        c.readOnly = true;
        c.unique = true;
    });

    static CREATED: Column = new Column((c: Column) => {
        c.key = "created";
        c.name = "Utworzono";
        c.type = "timestamp";
        c.autoGenerated = true;
        c.readOnly = true;
    });

    static TYPE: Column = new Column((c: Column) => {
        c.key = "type";
        c.name = "Typ";
        c.type = "enum";
        c.required = true;
        c.enumerate = {
            D: "Tekst",
            F: "Plik",
            I: "Obraz"
        };
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
        c.required = true;
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });

    static VALUE: Column = new Column((c: Column) => {
        c.key = "value";
        c.name = "Wartość";
        c.type = "memo";
    });

    static FORMAT: Column = new Column((c: Column) => {
        c.key = "format";
        c.name = "Format";
        c.type = "string";
        c.enumerate = ["Text", "Markdown", "DOC", "PDF", "HTML", "CSS", "JS", "XML", "JSON", "Java"];
    });

    static CAT: Column = new Column((c: Column) => {
        c.key = "cat";
        c.name = "Katalog";
        c.type = "int";
        c.required = true;
        c.foreign = () => R_CATALOG;
    });

    static FILE: Column = new Column((c: Column) => {
        c.key = "file";
        c.name = "Plik";
        c.type = "file_name";
    });

    static SIZE: Column = new Column((c: Column) => {
        c.key = "size";
        c.name = "Rozmiar";
        c.type = "size";
    });

    static MD5: Column = new Column((c: Column) => {
        c.key = "md5";
        c.name = "MD5";
        c.type = "string";
        c.autoGenerated = true;
        c.readOnly = true;
    });

    static CRYPT_KEY: Column = new Column((c: Column) => {
        c.key = "cryptKey";
        c.name = "Klucz";
        c.type = "int";
        c.foreign = () => R_CRYPT_KEY;
    });

    static TAGS: Column = new Column((c: Column) => {
        c.key = "tags";
        c.name = "Tagi";
        c.type = "string[]";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "resource";
            c.name = "Zasób";
            c.record = RResourceRecord;
            c.primaryKeyColumn = RResource.ID;
            c.displayNameColumn = RResource.NAME;
            c.crude = "CRUD";
            c.local = false;
            c.autoUpdate = true;
        });
    }

}

export class RResourceRecord extends Record {

    ID: Field = new Field(RResource.ID, this);
    UID: Field = new Field(RResource.UID, this);
    CREATED: Field = new Field(RResource.CREATED, this);
    TYPE: Field = new Field(RResource.TYPE, this);
    NAME: Field = new Field(RResource.NAME, this);
    DESC: Field = new Field(RResource.DESC, this);
    VALUE: Field = new Field(RResource.VALUE, this);
    FORMAT: Field = new Field(RResource.FORMAT, this);
    CAT: Field = new Field(RResource.CAT, this);
    FILE: Field = new Field(RResource.FILE, this);
    SIZE: Field = new Field(RResource.SIZE, this);
    MD5: Field = new Field(RResource.MD5, this);
    CRYPT_KEY: Field = new Field(RResource.CRYPT_KEY, this);
    TAGS: Field = new Field(RResource.TAGS, this);

}

//--------------------------------- Klucz szyfrujący ----------------------------------------------

export class RCryptKey extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static UID: Column = new Column((c: Column) => {
        c.key = "uid";
        c.name = "UID";
        c.type = "uid";
        c.autoGenerated = true;
        c.hidden = true;
        c.required = true;
        c.unique = true;
    });

    static CREATED: Column = new Column((c: Column) => {
        c.key = "created";
        c.name = "Utworzono";
        c.type = "timestamp";
        c.autoGenerated = true;
        c.readOnly = true;
    });

    static USER: Column = new Column((c: Column) => {
        c.key = "user";
        c.name = "Użytkownik";
        c.type = "int";
    });

    static SVR_KEY: Column = new Column((c: Column) => {
        c.key = "svrKey";
        c.name = "Klucz usługi";
        c.type = "password";
    });

    static USER_KEY: Column = new Column((c: Column) => {
        c.key = "userKey";
        c.name = "Klucz użytkownika";
        c.type = "password";
    });

    static MD5: Column = new Column((c: Column) => {
        c.key = "md5";
        c.name = "MD5";
        c.type = "string";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "cryptKey";
            c.name = "Klucz szyfrujący";
            c.record = RCryptKeyRecord;
            c.primaryKeyColumn = RCryptKey.ID;
            c.crude = "CRUD";
            c.local = false;
            c.autoUpdate = true;
        });
    }

}

export class RCryptKeyRecord extends Record {

    ID: Field = new Field(RCryptKey.ID, this);
    UID: Field = new Field(RCryptKey.UID, this);
    CREATED: Field = new Field(RCryptKey.CREATED, this);
    USER: Field = new Field(RCryptKey.USER, this);
    SVR_KEY: Field = new Field(RCryptKey.SVR_KEY, this);
    USER_KEY: Field = new Field(RCryptKey.USER_KEY, this);
    MD5: Field = new Field(RCryptKey.MD5, this);

}

export const R_STATUS: RStatus = Repository.register(new RStatus());
export const R_THREADS: RThreads = Repository.register(new RThreads());
export const R_ATTRIBUTE: RAttribute = Repository.register(new RAttribute());
export const R_ATTRIBUTE_ELEMENT: RAttributeElement = Repository.register(new RAttributeElement());
export const R_CATALOG: RCatalog = Repository.register(new RCatalog());
export const R_CATALOG_ATTRIBUTE: RCatalogAttribute = Repository.register(new RCatalogAttribute());
export const R_CATEGORY: RCategory = Repository.register(new RCategory());
export const R_CATEGORY_ATTRIBUTE: RCategoryAttribute = Repository.register(new RCategoryAttribute());
export const R_RESOURCE: RResource = Repository.register(new RResource());
export const R_CRYPT_KEY: RCryptKey = Repository.register(new RCryptKey());