import {Cell, Column, RepoConfig, Repository, Record} from "../core/core";



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
        c.type = "{any}";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "status";
            c.name = "Status";
            c.group = "System";
            c.record = RStatusRecord;
            c.primaryKeyColumn = "key";
            c.displayNameColumn = "name";
            c.crude = "R";
            c.local = true;
        });
    }

}

export class RStatusRecord extends Record {

    KEY: Cell = new Cell(this, RStatus.KEY);
    NAME: Cell = new Cell(this, RStatus.NAME);
    VALUE: Cell = new Cell(this, RStatus.VALUE);
    TYPE: Cell = new Cell(this, RStatus.TYPE);
    DESC: Cell = new Cell(this, RStatus.DESC);
    PARENT: Cell = new Cell(this, RStatus.PARENT);
    GROUP: Cell = new Cell(this, RStatus.GROUP);
    COMMENT: Cell = new Cell(this, RStatus.COMMENT);
    COLOR: Cell = new Cell(this, RStatus.COLOR);
    UPDATED: Cell = new Cell(this, RStatus.UPDATED);
    UPDATES: Cell = new Cell(this, RStatus.UPDATES);
    ATTRS: Cell = new Cell(this, RStatus.ATTRS);

}

//--------------------------------- Konfiguracja ----------------------------------------------

export class RConfig extends Repository {

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = "key";
        c.required = true;
        c.unique = true;
    });

    static PARENT: Column = new Column((c: Column) => {
        c.key = "parent";
        c.name = "Rodzic";
        c.type = "key";
        c.foreign = () => R_CONFIG;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });

    static IS_DEF_VAL: Column = new Column((c: Column) => {
        c.key = "isDefVal";
        c.name = "Użyj wartości domyslnej";
        c.type = "boolean";
    });

    static USER_VALUE: Column = new Column((c: Column) => {
        c.key = "userValue";
        c.name = "Wartość użytkownika";
        c.type = "any";
    });

    static DEFAULT_VALUE: Column = new Column((c: Column) => {
        c.key = "defaultValue";
        c.name = "Wartość domyślna";
        c.type = "any";
    });

    static VARIABLE: Column = new Column((c: Column) => {
        c.key = "variable";
        c.name = "Zmienna";
        c.type = "string";
    });

    static ENABLED: Column = new Column((c: Column) => {
        c.key = "enabled";
        c.name = "Aktywne";
        c.type = "boolean";
    });

    static VISIBLE: Column = new Column((c: Column) => {
        c.key = "visible";
        c.name = "Widoczne";
        c.type = "boolean";
    });

    static READ_ONLY: Column = new Column((c: Column) => {
        c.key = "readOnly";
        c.name = "Tylko do odczytu";
        c.type = "boolean";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "configuration";
            c.name = "Konfiguracja";
            c.group = "System";
            c.record = RConfigRecord;
            c.primaryKeyColumn = "key";
            c.parentColumn = "parent";
            c.displayNameColumn = "name";
            c.crude = "RU";
        });
    }

}

export class RConfigRecord extends Record {

    KEY: Cell = new Cell(this, RConfig.KEY);
    PARENT: Cell = new Cell(this, RConfig.PARENT);
    NAME: Cell = new Cell(this, RConfig.NAME);
    DESC: Cell = new Cell(this, RConfig.DESC);
    IS_DEF_VAL: Cell = new Cell(this, RConfig.IS_DEF_VAL);
    USER_VALUE: Cell = new Cell(this, RConfig.USER_VALUE);
    DEFAULT_VALUE: Cell = new Cell(this, RConfig.DEFAULT_VALUE);
    VARIABLE: Cell = new Cell(this, RConfig.VARIABLE);
    ENABLED: Cell = new Cell(this, RConfig.ENABLED);
    VISIBLE: Cell = new Cell(this, RConfig.VISIBLE);
    READ_ONLY: Cell = new Cell(this, RConfig.READ_ONLY);

}

//--------------------------------- Historia zmian ----------------------------------------------

export class RRepoHistory extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static DATE: Column = new Column((c: Column) => {
        c.key = "date";
        c.name = "Data";
        c.type = "timestamp";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
        c.readOnly = true;
        c.required = true;
    });

    static REPOSITORY: Column = new Column((c: Column) => {
        c.key = "repository";
        c.name = "Repozytorium";
        c.type = "string";
        c.readOnly = true;
        c.required = true;
    });

    static PRIMARY_KEY: Column = new Column((c: Column) => {
        c.key = "primaryKey";
        c.name = "Klucz główny";
        c.type = "string";
        c.readOnly = true;
        c.required = true;
    });

    static ACTION: Column = new Column((c: Column) => {
        c.key = "action";
        c.name = "Akcja";
        c.type = "enum";
        c.readOnly = true;
        c.required = true;
        c.enumerate = {
            create: "CREATE",
            read: "READ",
            update: "UPDATE",
            delete: "DELETE",
            execute: "EXECUTE"
        };
    });

    static CHANGES: Column = new Column((c: Column) => {
        c.key = "changes";
        c.name = "Zmiany";
        c.type = "{(string, string)}";
        c.readOnly = true;
        c.required = true;
    });

    static ADDRESS: Column = new Column((c: Column) => {
        c.key = "address";
        c.name = "Adres IP";
        c.type = "string";
        c.readOnly = true;
    });

    static SESSION: Column = new Column((c: Column) => {
        c.key = "session";
        c.name = "Sesja";
        c.type = "string";
        c.readOnly = true;
    });

    static USERNAME: Column = new Column((c: Column) => {
        c.key = "username";
        c.name = "Użytkownik";
        c.type = "string";
        c.readOnly = true;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "repoHistory";
            c.name = "Historia zmian";
            c.record = RRepoHistoryRecord;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "R";
            c.local = false;
        });
    }

}

export class RRepoHistoryRecord extends Record {

    ID: Cell = new Cell(this, RRepoHistory.ID);
    DATE: Cell = new Cell(this, RRepoHistory.DATE);
    NAME: Cell = new Cell(this, RRepoHistory.NAME);
    REPOSITORY: Cell = new Cell(this, RRepoHistory.REPOSITORY);
    PRIMARY_KEY: Cell = new Cell(this, RRepoHistory.PRIMARY_KEY);
    ACTION: Cell = new Cell(this, RRepoHistory.ACTION);
    CHANGES: Cell = new Cell(this, RRepoHistory.CHANGES);
    ADDRESS: Cell = new Cell(this, RRepoHistory.ADDRESS);
    SESSION: Cell = new Cell(this, RRepoHistory.SESSION);
    USERNAME: Cell = new Cell(this, RRepoHistory.USERNAME);

}

//--------------------------------- TEST ----------------------------------------------

export class RTest extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static ON_DEMAND: Column = new Column((c: Column) => {
        c.key = "onDemand";
        c.name = "Na żądanie";
        c.type = "enum";
        c.enumerate = {
            DOC: "DOC",
            PDF: "PDF",
            HTML: "HTML",
            CSS: "CSS",
            JS: "JS",
            XML: "XML",
            JSON: "JSON"
        };
    });

    static ONE_OF: Column = new Column((c: Column) => {
        c.key = "oneOf";
        c.name = "Jeden format";
        c.type = "enum";
        c.enumerate = {
            DOC: "DOC",
            PDF: "PDF",
            HTML: "HTML",
            CSS: "CSS",
            JS: "JS",
            XML: "XML",
            JSON: "JSON"
        };
    });

    static SOME_OF: Column = new Column((c: Column) => {
        c.key = "someOf";
        c.name = "Kilka formatów";
        c.type = "enums";
        c.enumerate = {
            DOC: "DOC",
            PDF: "PDF",
            HTML: "HTML",
            CSS: "CSS",
            JS: "JS",
            XML: "XML",
            JSON: "JSON"
        };
    });

    static PAIR: Column = new Column((c: Column) => {
        c.key = "pair";
        c.name = "Para";
        c.type = "(boolean, string)";
    });

    static TRIPLE: Column = new Column((c: Column) => {
        c.key = "triple";
        c.name = "Potrójny";
        c.type = "(boolean, string, int)";
    });

    static QUAD: Column = new Column((c: Column) => {
        c.key = "quad";
        c.name = "Poczwórny";
        c.type = "(boolean, string, int, string)";
    });

    static PAIR_LIST: Column = new Column((c: Column) => {
        c.key = "pairList";
        c.name = "Lista par";
        c.type = "(boolean, string)[]";
    });

    static TRIPLE_LIST: Column = new Column((c: Column) => {
        c.key = "tripleList";
        c.name = "Lista potrójnych";
        c.type = "(boolean, string, int)[]";
    });

    static QUAD_LIST: Column = new Column((c: Column) => {
        c.key = "quadList";
        c.name = "Lista poczwórnych";
        c.type = "(boolean, string, int, string)[]";
    });

    static TYPE: Column = new Column((c: Column) => {
        c.key = "type";
        c.name = "Typ danych";
        c.type = "enum";
        c.enumerate = {
            any: "Dowolny typ",
            boolean: "boolean",
            string: "string",
            key: "key",
            email: "email",
            file_name: "file_name",
            password: "password",
            memo: "Tekst wielo liniowy",
            regex: "Wyrażenie regularne",
            byte: "Wartość -128...127",
            short: "Wartość -32768...32767",
            int: "Wartość 0x80000000...0x7fffffff",
            long: "long",
            float: "float",
            double: "double",
            percent: "Wartość procentowa",
            size: "Zapis wielkości binarnej (bajty)",
            uid: "Unikalny identyfikator (GUID)",
            date: "Data (dzień, miesiąc, rok",
            time: "Godzina (godzina, minuta, sekundy, milisekundy",
            timestamp: "Znacznik czasu - data i godzina",
            duration: "Upływ czasu",
            list: "list",
            map: "map",
            json: "json",
            xml: "xml",
            csv: "csv",
            hex: "Wartość binarna zakodowana w postaci szesnastkowej",
            "base64": "Wartość binarna zakodowana w postaci Base64",
            uri: "Adres URI/URL",
            html: "html"
        };
    });

    static TEST: Column = new Column((c: Column) => {
        c.key = "test";
        c.name = "Test";
        c.type = "string";
        c.autoGenerated = true;
        c.defaultValue = "";
        c.readOnly = true;
        c.required = true;
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

    static REQUIRED: Column = new Column((c: Column) => {
        c.key = "required";
        c.name = "Wymagane";
        c.type = "boolean[]";
    });

    static ICON: Column = new Column((c: Column) => {
        c.key = "icon";
        c.name = "Ikona";
        c.type = "enum";
        c.defaultValue = "ADJUST";
        c.required = true;
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "test";
            c.name = "TEST";
            c.group = "Test";
            c.record = RTestRecord;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.actions = {
                addR: {record: false, name: "Dodaj", confirm: null, type: "primary", icon: "fa fa-plus"},
                remR: {record: false, name: "Usuń", confirm: null, type: "warning", icon: "fa fa-trash"},
                raddR: {record: true, name: "Dodaj", confirm: null, type: "primary", icon: "fa fa-plus"},
                rremR: {record: true, name: "Usuń", confirm: null, type: "primary", icon: "fa fa-trash"}
            };
        });
    }

}

export class RTestRecord extends Record {

    ID: Cell = new Cell(this, RTest.ID);
    ON_DEMAND: Cell = new Cell(this, RTest.ON_DEMAND);
    ONE_OF: Cell = new Cell(this, RTest.ONE_OF);
    SOME_OF: Cell = new Cell(this, RTest.SOME_OF);
    PAIR: Cell = new Cell(this, RTest.PAIR);
    TRIPLE: Cell = new Cell(this, RTest.TRIPLE);
    QUAD: Cell = new Cell(this, RTest.QUAD);
    PAIR_LIST: Cell = new Cell(this, RTest.PAIR_LIST);
    TRIPLE_LIST: Cell = new Cell(this, RTest.TRIPLE_LIST);
    QUAD_LIST: Cell = new Cell(this, RTest.QUAD_LIST);
    TYPE: Cell = new Cell(this, RTest.TYPE);
    TEST: Cell = new Cell(this, RTest.TEST);
    UID: Cell = new Cell(this, RTest.UID);
    CREATED: Cell = new Cell(this, RTest.CREATED);
    KEY: Cell = new Cell(this, RTest.KEY);
    NAME: Cell = new Cell(this, RTest.NAME);
    REQUIRED: Cell = new Cell(this, RTest.REQUIRED);
    ICON: Cell = new Cell(this, RTest.ICON);
    DESC: Cell = new Cell(this, RTest.DESC);

}

//--------------------------------- Użytkownicy ----------------------------------------------

export class RUsers extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.required = true;
        c.unique = true;
    });

    static TOKEN: Column = new Column((c: Column) => {
        c.key = "token";
        c.name = "Zewnętrzny token";
        c.type = "uid";
        c.hidden = true;
    });

    static LOGIN: Column = new Column((c: Column) => {
        c.key = "login";
        c.name = "Login";
        c.type = "string";
        c.required = true;
        c.unique = true;
    });

    static PASS: Column = new Column((c: Column) => {
        c.key = "pass";
        c.name = "Hasło";
        c.type = "password";
        c.hidden = true;
    });

    static LDAP: Column = new Column((c: Column) => {
        c.key = "ldap";
        c.name = "Autoryzacja LDAP";
        c.type = "boolean";
        c.defaultValue = false;
    });

    static FIRST_NAME: Column = new Column((c: Column) => {
        c.key = "firstName";
        c.name = "Imię 2222";
        c.type = "string";
    });

    static LAST_NAME: Column = new Column((c: Column) => {
        c.key = "lastName";
        c.name = "Nazwisko 222";
        c.type = "string";
    });

    static DISPLAY_NAME: Column = new Column((c: Column) => {
        c.key = "displayName";
        c.name = "Nazwa wyświetlana";
        c.type = "string";
        c.required = true;
    });

    static EMAIL: Column = new Column((c: Column) => {
        c.key = "email";
        c.name = "e-mail";
        c.type = "email";
    });

    static LAST_LOGIN: Column = new Column((c: Column) => {
        c.key = "lastLogin";
        c.name = "Ostatnio zalogowany";
        c.type = "timestamp";
        c.autoGenerated = true;
        c.readOnly = true;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "users";
            c.name = "Użytkownicy";
            c.record = RUsersRecord;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "login";
            c.crude = "CRU";
            c.local = false;
            c.icon = "fa fa-users";
            c.actions = {
                add: {record: true, name: "Dodaj", confirm: null, type: "primary", icon: "fa fa-user-plus"},
                rem: {record: true, name: "Usuń", confirm: "Czy na pewno usunąć?", type: "danger", icon: "fa fa-user-times"},
                editRandom: {record: false, name: "Modyfikuj losowy", confirm: null, type: "primary", icon: "fa fa-user-secret"},
                addRandom: {record: false, name: "Dodaj losowy", confirm: null, type: "primary", icon: "fa fa-user-plus"},
                removeRandom: {record: false, name: "Usuń losowy", confirm: null, type: "danger", icon: "fa fa-user-times"}
            };
        });
    }

}

export class RUsersRecord extends Record {

    ID: Cell = new Cell(this, RUsers.ID);
    TOKEN: Cell = new Cell(this, RUsers.TOKEN);
    LOGIN: Cell = new Cell(this, RUsers.LOGIN);
    PASS: Cell = new Cell(this, RUsers.PASS);
    LDAP: Cell = new Cell(this, RUsers.LDAP);
    FIRST_NAME: Cell = new Cell(this, RUsers.FIRST_NAME);
    LAST_NAME: Cell = new Cell(this, RUsers.LAST_NAME);
    DISPLAY_NAME: Cell = new Cell(this, RUsers.DISPLAY_NAME);
    EMAIL: Cell = new Cell(this, RUsers.EMAIL);
    LAST_LOGIN: Cell = new Cell(this, RUsers.LAST_LOGIN);

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
            c.group = "System";
            c.record = RThreadsRecord;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "R";
            c.local = true;
            c.actions = {
                term: {record: true, name: "Zatrzymaj", confirm: "Czy na pewno zatrzymać wątek ${id} \"${name}\"?", type: "warning", icon: "fa fa-times"}
            };
        });
    }

}

export class RThreadsRecord extends Record {

    ID: Cell = new Cell(this, RThreads.ID);
    NAME: Cell = new Cell(this, RThreads.NAME);
    GROUP: Cell = new Cell(this, RThreads.GROUP);
    STATE: Cell = new Cell(this, RThreads.STATE);
    ALIVE: Cell = new Cell(this, RThreads.ALIVE);
    DAEMON: Cell = new Cell(this, RThreads.DAEMON);
    INTERRUPTED: Cell = new Cell(this, RThreads.INTERRUPTED);
    PRIORITY: Cell = new Cell(this, RThreads.PRIORITY);
    CPU_TIME: Cell = new Cell(this, RThreads.CPU_TIME);
    USER_TIME: Cell = new Cell(this, RThreads.USER_TIME);
    ALLOC: Cell = new Cell(this, RThreads.ALLOC);
    BLOCKED: Cell = new Cell(this, RThreads.BLOCKED);
    WAITED: Cell = new Cell(this, RThreads.WAITED);

}

//--------------------------------- Atrybut ----------------------------------------------

export class RAttribute extends Repository {

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

    static MASK: Column = new Column((c: Column) => {
        c.key = "mask";
        c.name = "Maska";
        c.type = "string";
        c.hidden = true;
    });

    static PARENT: Column = new Column((c: Column) => {
        c.key = "parent";
        c.name = "Rodzic";
        c.type = "int";
        c.foreign = () => R_CATEGORY;
    });

    static ICON: Column = new Column((c: Column) => {
        c.key = "icon";
        c.name = "Ikona";
        c.type = "enum";
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
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RAttributeRecord extends Record {

    ID: Cell = new Cell(this, RAttribute.ID);
    UID: Cell = new Cell(this, RAttribute.UID);
    CREATED: Cell = new Cell(this, RAttribute.CREATED);
    KEY: Cell = new Cell(this, RAttribute.KEY);
    NAME: Cell = new Cell(this, RAttribute.NAME);
    MASK: Cell = new Cell(this, RAttribute.MASK);
    PARENT: Cell = new Cell(this, RAttribute.PARENT);
    ICON: Cell = new Cell(this, RAttribute.ICON);
    DESC: Cell = new Cell(this, RAttribute.DESC);

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
        c.type = "enum";
        c.enumerate = {
            any: "Dowolny typ",
            boolean: "boolean",
            string: "string",
            key: "key",
            email: "email",
            file_name: "file_name",
            password: "password",
            memo: "Tekst wielo liniowy",
            regex: "Wyrażenie regularne",
            byte: "Wartość -128...127",
            short: "Wartość -32768...32767",
            int: "Wartość 0x80000000...0x7fffffff",
            long: "long",
            float: "float",
            double: "double",
            percent: "Wartość procentowa",
            size: "Zapis wielkości binarnej (bajty)",
            uid: "Unikalny identyfikator (GUID)",
            date: "Data (dzień, miesiąc, rok",
            time: "Godzina (godzina, minuta, sekundy, milisekundy",
            timestamp: "Znacznik czasu - data i godzina",
            duration: "Upływ czasu",
            list: "list",
            map: "map"
        };
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
        c.foreign = () => R_ATTRIBUTE_ELEMENT;
    });

    static ENCRYPTED: Column = new Column((c: Column) => {
        c.key = "encrypted";
        c.name = "Zaszyfrowany";
        c.type = "boolean";
    });

    static ENUMERATE: Column = new Column((c: Column) => {
        c.key = "enumerate";
        c.name = "Enumerata";
        c.type = "{string}";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "attrElm";
            c.name = "Element atrybutu";
            c.record = RAttributeElementRecord;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RAttributeElementRecord extends Record {

    ID: Cell = new Cell(this, RAttributeElement.ID);
    UID: Cell = new Cell(this, RAttributeElement.UID);
    CREATED: Cell = new Cell(this, RAttributeElement.CREATED);
    KEY: Cell = new Cell(this, RAttributeElement.KEY);
    NAME: Cell = new Cell(this, RAttributeElement.NAME);
    TYPE: Cell = new Cell(this, RAttributeElement.TYPE);
    DESC: Cell = new Cell(this, RAttributeElement.DESC);
    REQUIRED: Cell = new Cell(this, RAttributeElement.REQUIRED);
    DEF_VAL: Cell = new Cell(this, RAttributeElement.DEF_VAL);
    MIN: Cell = new Cell(this, RAttributeElement.MIN);
    MAX: Cell = new Cell(this, RAttributeElement.MAX);
    REGEX: Cell = new Cell(this, RAttributeElement.REGEX);
    FOREIGN_ELM: Cell = new Cell(this, RAttributeElement.FOREIGN_ELM);
    ENCRYPTED: Cell = new Cell(this, RAttributeElement.ENCRYPTED);
    ENUMERATE: Cell = new Cell(this, RAttributeElement.ENUMERATE);

}

//--------------------------------- Atrybut ----------------------------------------------

export class RAttributeElements extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static ATTR: Column = new Column((c: Column) => {
        c.key = "attr";
        c.name = "Atrybut";
        c.type = "int";
        c.required = true;
        c.foreign = () => R_ATTRIBUTE;
    });

    static ELM: Column = new Column((c: Column) => {
        c.key = "elm";
        c.name = "Element";
        c.type = "int";
        c.required = true;
        c.foreign = () => R_ATTRIBUTE_ELEMENT;
    });

    static DEF_VAL: Column = new Column((c: Column) => {
        c.key = "defVal";
        c.name = "Wartość domyslna";
        c.type = "json";
    });

    static REQUIRED: Column = new Column((c: Column) => {
        c.key = "required";
        c.name = "Wymagane";
        c.type = "boolean";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "attrElms";
            c.name = "Atrybut";
            c.record = RAttributeElementsRecord;
            c.primaryKeyColumn = "id";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RAttributeElementsRecord extends Record {

    ID: Cell = new Cell(this, RAttributeElements.ID);
    ATTR: Cell = new Cell(this, RAttributeElements.ATTR);
    ELM: Cell = new Cell(this, RAttributeElements.ELM);
    DEF_VAL: Cell = new Cell(this, RAttributeElements.DEF_VAL);
    REQUIRED: Cell = new Cell(this, RAttributeElements.REQUIRED);

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
        c.type = "enum";
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
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RCategoryRecord extends Record {

    ID: Cell = new Cell(this, RCategory.ID);
    UID: Cell = new Cell(this, RCategory.UID);
    KEY: Cell = new Cell(this, RCategory.KEY);
    NAME: Cell = new Cell(this, RCategory.NAME);
    CREATED: Cell = new Cell(this, RCategory.CREATED);
    DESC: Cell = new Cell(this, RCategory.DESC);
    ICON: Cell = new Cell(this, RCategory.ICON);
    CATS: Cell = new Cell(this, RCategory.CATS);
    ATTR: Cell = new Cell(this, RCategory.ATTR);

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
            c.primaryKeyColumn = "id";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RCategoryAttributeRecord extends Record {

    ID: Cell = new Cell(this, RCategoryAttribute.ID);
    UID: Cell = new Cell(this, RCategoryAttribute.UID);
    CAT: Cell = new Cell(this, RCategoryAttribute.CAT);
    ATTR: Cell = new Cell(this, RCategoryAttribute.ATTR);
    MASK: Cell = new Cell(this, RCategoryAttribute.MASK);
    REQUIRED: Cell = new Cell(this, RCategoryAttribute.REQUIRED);
    MULTIPLE: Cell = new Cell(this, RCategoryAttribute.MULTIPLE);
    UNIQUE: Cell = new Cell(this, RCategoryAttribute.UNIQUE);
    ABSTRACT: Cell = new Cell(this, RCategoryAttribute.ABSTRACT);

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
        c.name = "Atrybuty";
        c.type = "int[]";
        c.foreign = () => R_ATTRIBUTE;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "catalog";
            c.name = "Katalog";
            c.record = RCatalogRecord;
            c.primaryKeyColumn = "id";
            c.parentColumn = "parent";
            c.orderColumn = "order";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
            c.references = {
                resource: {
                    name: "Zasób",
                    repo: "resource",
                    column: "cat"
                }
            };
        });
    }

}

export class RCatalogRecord extends Record {

    ID: Cell = new Cell(this, RCatalog.ID);
    UID: Cell = new Cell(this, RCatalog.UID);
    NAME: Cell = new Cell(this, RCatalog.NAME);
    ORDER: Cell = new Cell(this, RCatalog.ORDER);
    CATEGORY: Cell = new Cell(this, RCatalog.CATEGORY);
    CREATED: Cell = new Cell(this, RCatalog.CREATED);
    DESC: Cell = new Cell(this, RCatalog.DESC);
    ABSTRACT: Cell = new Cell(this, RCatalog.ABSTRACT);
    PARENT: Cell = new Cell(this, RCatalog.PARENT);
    ATTRIBUTES: Cell = new Cell(this, RCatalog.ATTRIBUTES);

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
        c.foreign = () => R_CATALOG;
    });

    static ATTR: Column = new Column((c: Column) => {
        c.key = "attr";
        c.name = "Atrybut";
        c.type = "int";
        c.foreign = () => R_ATTRIBUTE;
    });

    static ORDER: Column = new Column((c: Column) => {
        c.key = "order";
        c.name = "Kolejność";
        c.type = "int";
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
            c.primaryKeyColumn = "id";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RCatalogAttributeRecord extends Record {

    ID: Cell = new Cell(this, RCatalogAttribute.ID);
    UID: Cell = new Cell(this, RCatalogAttribute.UID);
    CREATED: Cell = new Cell(this, RCatalogAttribute.CREATED);
    CAT: Cell = new Cell(this, RCatalogAttribute.CAT);
    ATTR: Cell = new Cell(this, RCatalogAttribute.ATTR);
    ORDER: Cell = new Cell(this, RCatalogAttribute.ORDER);
    NOTES: Cell = new Cell(this, RCatalogAttribute.NOTES);

}

//--------------------------------- Wartości atrybutu katalogu ----------------------------------------------

export class RCatalogAttributeValues extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static CAT_ATTR: Column = new Column((c: Column) => {
        c.key = "catAttr";
        c.name = "Katalog";
        c.type = "int";
        c.foreign = () => R_CATALOG_ATTRIBUTE;
    });

    static ATTR_ELM: Column = new Column((c: Column) => {
        c.key = "attrElm";
        c.name = "Element";
        c.type = "int";
        c.foreign = () => R_ATTRIBUTE_ELEMENT;
    });

    static VALUE: Column = new Column((c: Column) => {
        c.key = "value";
        c.name = "Wartość";
        c.type = "json";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "catalogAttrValues";
            c.name = "Wartości atrybutu katalogu";
            c.record = RCatalogAttributeValuesRecord;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "value";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RCatalogAttributeValuesRecord extends Record {

    ID: Cell = new Cell(this, RCatalogAttributeValues.ID);
    CAT_ATTR: Cell = new Cell(this, RCatalogAttributeValues.CAT_ATTR);
    ATTR_ELM: Cell = new Cell(this, RCatalogAttributeValues.ATTR_ELM);
    VALUE: Cell = new Cell(this, RCatalogAttributeValues.VALUE);

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
        c.type = "enum";
        c.enumerate = {
            Text: "Text",
            Markdown: "Markdown",
            DOC: "DOC",
            PDF: "PDF",
            HTML: "HTML",
            CSS: "CSS",
            JS: "JS",
            XML: "XML",
            JSON: "JSON",
            Java: "Java"
        };
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
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RResourceRecord extends Record {

    ID: Cell = new Cell(this, RResource.ID);
    UID: Cell = new Cell(this, RResource.UID);
    CREATED: Cell = new Cell(this, RResource.CREATED);
    TYPE: Cell = new Cell(this, RResource.TYPE);
    NAME: Cell = new Cell(this, RResource.NAME);
    DESC: Cell = new Cell(this, RResource.DESC);
    VALUE: Cell = new Cell(this, RResource.VALUE);
    FORMAT: Cell = new Cell(this, RResource.FORMAT);
    CAT: Cell = new Cell(this, RResource.CAT);
    FILE: Cell = new Cell(this, RResource.FILE);
    SIZE: Cell = new Cell(this, RResource.SIZE);
    MD5: Cell = new Cell(this, RResource.MD5);
    CRYPT_KEY: Cell = new Cell(this, RResource.CRYPT_KEY);
    TAGS: Cell = new Cell(this, RResource.TAGS);

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

    static USER_ID: Column = new Column((c: Column) => {
        c.key = "userId";
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
            c.primaryKeyColumn = "id";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RCryptKeyRecord extends Record {

    ID: Cell = new Cell(this, RCryptKey.ID);
    UID: Cell = new Cell(this, RCryptKey.UID);
    CREATED: Cell = new Cell(this, RCryptKey.CREATED);
    USER_ID: Cell = new Cell(this, RCryptKey.USER_ID);
    SVR_KEY: Cell = new Cell(this, RCryptKey.SVR_KEY);
    USER_KEY: Cell = new Cell(this, RCryptKey.USER_KEY);
    MD5: Cell = new Cell(this, RCryptKey.MD5);

}

//--------------------------------- Status repozytorium ----------------------------------------------

export class RRepoSate extends Repository {

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = "key";
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
        c.required = true;
    });

    static GROUP: Column = new Column((c: Column) => {
        c.key = "group";
        c.name = "Grupa";
        c.type = "string";
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });

    static BROADCAST: Column = new Column((c: Column) => {
        c.key = "broadcast";
        c.name = "Broadcast";
        c.type = "boolean";
        c.defaultValue = true;
        c.required = true;
    });

    static ON_DEMAND: Column = new Column((c: Column) => {
        c.key = "onDemand";
        c.name = "Na żądanie";
        c.type = "boolean";
        c.required = true;
    });

    static ICON: Column = new Column((c: Column) => {
        c.key = "icon";
        c.name = "Ikona";
        c.type = "enum";
    });

    static CRUDE: Column = new Column((c: Column) => {
        c.key = "crude";
        c.name = "CRUDE";
        c.type = "enums";
        c.required = true;
        c.enumerate = {
            C: "Tworzenie",
            R: "Odczyt",
            U: "Modyfikacja",
            D: "Usunięcie",
            E: "Wykonanie"
        };
    });

    static LAST_MODIFIED: Column = new Column((c: Column) => {
        c.key = "lastModified";
        c.name = "Ostatnio zmodyfikowany";
        c.type = "timestamp";
        c.readOnly = true;
    });

    static LAST_MODIFIED_BY: Column = new Column((c: Column) => {
        c.key = "lastModifiedBy";
        c.name = "Ostatnio zmodyfikowany przez";
        c.type = "string";
        c.readOnly = true;
    });

    static LAST_MOD_BY_ID: Column = new Column((c: Column) => {
        c.key = "lastModById";
        c.name = "Ostatnio zmodyfikowany przez";
        c.type = "int";
        c.readOnly = true;
        c.foreign = () => R_USERS;
    });

    static REVISION: Column = new Column((c: Column) => {
        c.key = "revision";
        c.name = "Wersja";
        c.type = "int";
        c.readOnly = true;
        c.required = true;
    });

    static INFO: Column = new Column((c: Column) => {
        c.key = "info";
        c.name = "Zaawanoswane informacje";
        c.type = "(string, string)[]";
    });

    static LIMIT: Column = new Column((c: Column) => {
        c.key = "limit";
        c.name = "Limit danych";
        c.type = "int";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "repoState";
            c.name = "Status repozytorium";
            c.group = "System";
            c.record = RRepoSateRecord;
            c.primaryKeyColumn = "key";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class RRepoSateRecord extends Record {

    KEY: Cell = new Cell(this, RRepoSate.KEY);
    NAME: Cell = new Cell(this, RRepoSate.NAME);
    GROUP: Cell = new Cell(this, RRepoSate.GROUP);
    DESC: Cell = new Cell(this, RRepoSate.DESC);
    BROADCAST: Cell = new Cell(this, RRepoSate.BROADCAST);
    ON_DEMAND: Cell = new Cell(this, RRepoSate.ON_DEMAND);
    ICON: Cell = new Cell(this, RRepoSate.ICON);
    CRUDE: Cell = new Cell(this, RRepoSate.CRUDE);
    LAST_MODIFIED: Cell = new Cell(this, RRepoSate.LAST_MODIFIED);
    LAST_MODIFIED_BY: Cell = new Cell(this, RRepoSate.LAST_MODIFIED_BY);
    LAST_MOD_BY_ID: Cell = new Cell(this, RRepoSate.LAST_MOD_BY_ID);
    REVISION: Cell = new Cell(this, RRepoSate.REVISION);
    INFO: Cell = new Cell(this, RRepoSate.INFO);
    LIMIT: Cell = new Cell(this, RRepoSate.LIMIT);

}

export const R_STATUS: RStatus = Repository.register(new RStatus());
export const R_CONFIG: RConfig = Repository.register(new RConfig());
export const R_REPO_HISTORY: RRepoHistory = Repository.register(new RRepoHistory());
export const R_TEST: RTest = Repository.register(new RTest());
export const R_USERS: RUsers = Repository.register(new RUsers());
export const R_THREADS: RThreads = Repository.register(new RThreads());
export const R_ATTRIBUTE: RAttribute = Repository.register(new RAttribute());
export const R_ATTRIBUTE_ELEMENT: RAttributeElement = Repository.register(new RAttributeElement());
export const R_ATTRIBUTE_ELEMENTS: RAttributeElements = Repository.register(new RAttributeElements());
export const R_CATEGORY: RCategory = Repository.register(new RCategory());
export const R_CATEGORY_ATTRIBUTE: RCategoryAttribute = Repository.register(new RCategoryAttribute());
export const R_CATALOG: RCatalog = Repository.register(new RCatalog());
export const R_CATALOG_ATTRIBUTE: RCatalogAttribute = Repository.register(new RCatalogAttribute());
export const R_CATALOG_ATTRIBUTE_VALUES: RCatalogAttributeValues = Repository.register(new RCatalogAttributeValues());
export const R_RESOURCE: RResource = Repository.register(new RResource());
export const R_CRYPT_KEY: RCryptKey = Repository.register(new RCryptKey());
export const R_REPO_SATE: RRepoSate = Repository.register(new RRepoSate());