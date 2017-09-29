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
            c.record = EStatus;
            c.primaryKeyColumn = "key";
            c.displayNameColumn = "name";
            c.crude = "R";
            c.local = true;
            c.references = {
                status_parent: {
                    name: "Status",
                    repo: "status",
                    column: "parent"
                }
            };
        });
    }

}

export class EStatus extends Record {

    KEY: Cell = new Cell(this, RStatus.KEY); // "Klucz"
    NAME: Cell = new Cell(this, RStatus.NAME); // "Nazwa"
    VALUE: Cell = new Cell(this, RStatus.VALUE); // "Wartość"
    TYPE: Cell = new Cell(this, RStatus.TYPE); // "Typ"
    DESC: Cell = new Cell(this, RStatus.DESC); // "Opis"
    PARENT: Cell = new Cell(this, RStatus.PARENT); // "Rodzic"
    GROUP: Cell = new Cell(this, RStatus.GROUP); // "Grupa"
    COMMENT: Cell = new Cell(this, RStatus.COMMENT); // "Komentarz"
    COLOR: Cell = new Cell(this, RStatus.COLOR); // "Kolor"
    UPDATED: Cell = new Cell(this, RStatus.UPDATED); // "Zaktualizowany"
    UPDATES: Cell = new Cell(this, RStatus.UPDATES); // "Aktualizacji"
    ATTRS: Cell = new Cell(this, RStatus.ATTRS); // "Atrybuty"

    parentForeign = (context: any): EStatus => this._getForeign(context, RStatus.PARENT); // klucz obcy parent -> status.key

    status_parent = (context: any): EStatus[] => this._getReferences(context, RStatus.PARENT); // referencja status.parent -> key

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
            c.record = EConfig;
            c.primaryKeyColumn = "key";
            c.parentColumn = "parent";
            c.displayNameColumn = "name";
            c.crude = "RU";
            c.references = {
                configuration_parent: {
                    name: "Konfiguracja",
                    repo: "configuration",
                    column: "parent"
                }
            };
        });
    }

}

export class EConfig extends Record {

    KEY: Cell = new Cell(this, RConfig.KEY); // "Klucz"
    PARENT: Cell = new Cell(this, RConfig.PARENT); // "Rodzic"
    NAME: Cell = new Cell(this, RConfig.NAME); // "Nazwa"
    DESC: Cell = new Cell(this, RConfig.DESC); // "Opis"
    IS_DEF_VAL: Cell = new Cell(this, RConfig.IS_DEF_VAL); // "Użyj wartości domyslnej"
    USER_VALUE: Cell = new Cell(this, RConfig.USER_VALUE); // "Wartość użytkownika"
    DEFAULT_VALUE: Cell = new Cell(this, RConfig.DEFAULT_VALUE); // "Wartość domyślna"
    VARIABLE: Cell = new Cell(this, RConfig.VARIABLE); // "Zmienna"
    ENABLED: Cell = new Cell(this, RConfig.ENABLED); // "Aktywne"
    VISIBLE: Cell = new Cell(this, RConfig.VISIBLE); // "Widoczne"
    READ_ONLY: Cell = new Cell(this, RConfig.READ_ONLY); // "Tylko do odczytu"

    parentForeign = (context: any): EConfig => this._getForeign(context, RConfig.PARENT); // klucz obcy parent -> configuration.key

    configuration_parent = (context: any): EConfig[] => this._getReferences(context, RConfig.PARENT); // referencja configuration.parent -> key

}

//--------------------------------- Status repozytorium ----------------------------------------------

export class RRepoState extends Repository {

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
        c.value = true;
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
        c.name = "Zaawansowane informacje";
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
            c.record = ERepoState;
            c.primaryKeyColumn = "key";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class ERepoState extends Record {

    KEY: Cell = new Cell(this, RRepoState.KEY); // "Klucz"
    NAME: Cell = new Cell(this, RRepoState.NAME); // "Nazwa"
    GROUP: Cell = new Cell(this, RRepoState.GROUP); // "Grupa"
    DESC: Cell = new Cell(this, RRepoState.DESC); // "Opis"
    BROADCAST: Cell = new Cell(this, RRepoState.BROADCAST); // "Broadcast"
    ON_DEMAND: Cell = new Cell(this, RRepoState.ON_DEMAND); // "Na żądanie"
    ICON: Cell = new Cell(this, RRepoState.ICON); // "Ikona"
    CRUDE: Cell = new Cell(this, RRepoState.CRUDE); // "CRUDE"
    LAST_MODIFIED: Cell = new Cell(this, RRepoState.LAST_MODIFIED); // "Ostatnio zmodyfikowany"
    LAST_MODIFIED_BY: Cell = new Cell(this, RRepoState.LAST_MODIFIED_BY); // "Ostatnio zmodyfikowany przez"
    LAST_MOD_BY_ID: Cell = new Cell(this, RRepoState.LAST_MOD_BY_ID); // "Ostatnio zmodyfikowany przez"
    REVISION: Cell = new Cell(this, RRepoState.REVISION); // "Wersja"
    INFO: Cell = new Cell(this, RRepoState.INFO); // "Zaawansowane informacje"
    LIMIT: Cell = new Cell(this, RRepoState.LIMIT); // "Limit danych"

    lastModByIdForeign = (context: any): EUsers => this._getForeign(context, RRepoState.LAST_MOD_BY_ID); // klucz obcy lastModById -> users.id

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
            c.record = ERepoHistory;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "R";
            c.local = false;
        });
    }

}

export class ERepoHistory extends Record {

    ID: Cell = new Cell(this, RRepoHistory.ID); // "ID"
    DATE: Cell = new Cell(this, RRepoHistory.DATE); // "Data"
    NAME: Cell = new Cell(this, RRepoHistory.NAME); // "Nazwa"
    REPOSITORY: Cell = new Cell(this, RRepoHistory.REPOSITORY); // "Repozytorium"
    PRIMARY_KEY: Cell = new Cell(this, RRepoHistory.PRIMARY_KEY); // "Klucz główny"
    ACTION: Cell = new Cell(this, RRepoHistory.ACTION); // "Akcja"
    CHANGES: Cell = new Cell(this, RRepoHistory.CHANGES); // "Zmiany"
    ADDRESS: Cell = new Cell(this, RRepoHistory.ADDRESS); // "Adres IP"
    SESSION: Cell = new Cell(this, RRepoHistory.SESSION); // "Sesja"
    USERNAME: Cell = new Cell(this, RRepoHistory.USERNAME); // "Użytkownik"

}

//--------------------------------- Demo 1 ----------------------------------------------

export class RDemo1 extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static FILE: Column = new Column((c: Column) => {
        c.key = "file";
        c.name = "Plik";
        c.type = "file";
        c.required = true;
    });

    static IMAGE: Column = new Column((c: Column) => {
        c.key = "image";
        c.name = "Obrazek";
        c.type = "image";
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
            fileName: "fileName",
            filePath: "filePath",
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
        c.value = "";
        c.readOnly = true;
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
        c.required = true;
    });

    static KEY: Column = new Column((c: Column) => {
        c.key = "key";
        c.name = "Klucz";
        c.type = "key";
        c.unique = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
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
        c.required = false;
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "demo1";
            c.name = "Demo 1";
            c.group = "Demo";
            c.record = EDemo1;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.callbacks = "CEV";
            c.actions = {
                addR: {record: false, name: "Dodaj", confirm: null, type: "primary", icon: "plus"},
                remR: {record: false, name: "Usuń", confirm: null, type: "warning", icon: "trash"},
                raddR: {record: true, name: "Dodaj", confirm: null, type: "primary", icon: "plus"},
                rremR: {record: true, name: "Usuń", confirm: null, type: "primary", icon: "trash"}
            };
        });
    }

    addR = (params: ?Object = null) => this._execute('addR', params); // akcja "Dodaj"
    remR = (params: ?Object = null) => this._execute('remR', params); // akcja "Usuń"

}

export class EDemo1 extends Record {

    ID: Cell = new Cell(this, RDemo1.ID); // "ID"
    FILE: Cell = new Cell(this, RDemo1.FILE); // "Plik"
    IMAGE: Cell = new Cell(this, RDemo1.IMAGE); // "Obrazek"
    ON_DEMAND: Cell = new Cell(this, RDemo1.ON_DEMAND); // "Na żądanie"
    ONE_OF: Cell = new Cell(this, RDemo1.ONE_OF); // "Jeden format"
    SOME_OF: Cell = new Cell(this, RDemo1.SOME_OF); // "Kilka formatów"
    PAIR: Cell = new Cell(this, RDemo1.PAIR); // "Para"
    TRIPLE: Cell = new Cell(this, RDemo1.TRIPLE); // "Potrójny"
    QUAD: Cell = new Cell(this, RDemo1.QUAD); // "Poczwórny"
    PAIR_LIST: Cell = new Cell(this, RDemo1.PAIR_LIST); // "Lista par"
    TRIPLE_LIST: Cell = new Cell(this, RDemo1.TRIPLE_LIST); // "Lista potrójnych"
    QUAD_LIST: Cell = new Cell(this, RDemo1.QUAD_LIST); // "Lista poczwórnych"
    TYPE: Cell = new Cell(this, RDemo1.TYPE); // "Typ danych"
    TEST: Cell = new Cell(this, RDemo1.TEST); // "Test"
    UID: Cell = new Cell(this, RDemo1.UID); // "UID"
    CREATED: Cell = new Cell(this, RDemo1.CREATED); // "Utworzono"
    KEY: Cell = new Cell(this, RDemo1.KEY); // "Klucz"
    NAME: Cell = new Cell(this, RDemo1.NAME); // "Nazwa"
    REQUIRED: Cell = new Cell(this, RDemo1.REQUIRED); // "Wymagane"
    ICON: Cell = new Cell(this, RDemo1.ICON); // "Ikona"
    DESC: Cell = new Cell(this, RDemo1.DESC); // "Opis"

    raddR = (params: ?Object = null) => this._execute('raddR', params); // akcja "Dodaj"
    rremR = (params: ?Object = null) => this._execute('rremR', params); // akcja "Usuń"

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
        c.value = false;
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
            c.record = EUsers;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "login";
            c.crude = "CRU";
            c.local = false;
             c.actions = {
                add: {record: true, name: "Dodaj", confirm: null, type: "primary", icon: "user-plus"},
                rem: {record: true, name: "Usuń", confirm: "Czy na pewno usunąć?", type: "danger", icon: "user-times"},
                editRandom: {record: false, name: "Modyfikuj losowy", confirm: null, type: "primary", icon: "user-secret"},
                addRandom: {record: false, name: "Dodaj losowy", confirm: null, type: "primary", icon: "user-plus"},
                removeRandom: {record: false, name: "Usuń losowy", confirm: null, type: "danger", icon: "user-times"}
            };
        });
    }

    editRandom = (params: ?Object = null) => this._execute('editRandom', params); // akcja "Modyfikuj losowy"
    addRandom = (params: ?Object = null) => this._execute('addRandom', params); // akcja "Dodaj losowy"
    removeRandom = (params: ?Object = null) => this._execute('removeRandom', params); // akcja "Usuń losowy"

}

export class EUsers extends Record {

    ID: Cell = new Cell(this, RUsers.ID); // "ID"
    TOKEN: Cell = new Cell(this, RUsers.TOKEN); // "Zewnętrzny token"
    LOGIN: Cell = new Cell(this, RUsers.LOGIN); // "Login"
    PASS: Cell = new Cell(this, RUsers.PASS); // "Hasło"
    LDAP: Cell = new Cell(this, RUsers.LDAP); // "Autoryzacja LDAP"
    FIRST_NAME: Cell = new Cell(this, RUsers.FIRST_NAME); // "Imię 2222"
    LAST_NAME: Cell = new Cell(this, RUsers.LAST_NAME); // "Nazwisko 222"
    DISPLAY_NAME: Cell = new Cell(this, RUsers.DISPLAY_NAME); // "Nazwa wyświetlana"
    EMAIL: Cell = new Cell(this, RUsers.EMAIL); // "e-mail"
    LAST_LOGIN: Cell = new Cell(this, RUsers.LAST_LOGIN); // "Ostatnio zalogowany"

    add = (params: ?Object = null) => this._execute('add', params); // akcja "Dodaj"
    rem = (params: ?Object = null) => this._execute('rem', params); // akcja "Usuń"

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
            c.record = EThreads;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "R";
            c.local = true;
            c.actions = {
                term: {record: true, name: "Zatrzymaj", confirm: "Czy na pewno zatrzymać wątek ${id} \"${name}\"?", type: "warning", icon: "times"}
            };
        });
    }


}

export class EThreads extends Record {

    ID: Cell = new Cell(this, RThreads.ID); // "ID"
    NAME: Cell = new Cell(this, RThreads.NAME); // "Nazwa"
    GROUP: Cell = new Cell(this, RThreads.GROUP); // "Grupa"
    STATE: Cell = new Cell(this, RThreads.STATE); // "Stan"
    ALIVE: Cell = new Cell(this, RThreads.ALIVE); // "Żyje"
    DAEMON: Cell = new Cell(this, RThreads.DAEMON); // "Demon"
    INTERRUPTED: Cell = new Cell(this, RThreads.INTERRUPTED); // "Przerwany"
    PRIORITY: Cell = new Cell(this, RThreads.PRIORITY); // "Priorytet"
    CPU_TIME: Cell = new Cell(this, RThreads.CPU_TIME); // "Czas procesora"
    USER_TIME: Cell = new Cell(this, RThreads.USER_TIME); // "Czas użytkownika"
    ALLOC: Cell = new Cell(this, RThreads.ALLOC); // "Zaalokowano"
    BLOCKED: Cell = new Cell(this, RThreads.BLOCKED); // "Blokady"
    WAITED: Cell = new Cell(this, RThreads.WAITED); // "Oczekiwania"

    term = (params: ?Object = null) => this._execute('term', params); // akcja "Zatrzymaj"

}

//--------------------------------- Atrybut ----------------------------------------------

export class RAttribute extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.hidden = true;
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
        c.hidden = true;
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
        c.hidden = true;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "attribute";
            c.name = "Atrybut";
            c.group = "Atrybuty";
            c.record = EAttribute;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
            c.references = {
                attrElm_attr: {
                    name: "Element atrybutu",
                    repo: "attrElm",
                    column: "attr"
                },
                category_attr: {
                    name: "Kategoria",
                    repo: "category",
                    column: "attr"
                },
                categoryAttr_attr: {
                    name: "Atrybut kategorii",
                    repo: "categoryAttr",
                    column: "attr"
                },
                catalog_attributes: {
                    name: "Katalog",
                    repo: "catalog",
                    column: "attributes"
                },
                catalogAttr_attr: {
                    name: "Atrybut katalogu",
                    repo: "catalogAttr",
                    column: "attr"
                }
            };
        });
    }

}

export class EAttribute extends Record {

    ID: Cell = new Cell(this, RAttribute.ID); // "ID"
    UID: Cell = new Cell(this, RAttribute.UID); // "UID"
    CREATED: Cell = new Cell(this, RAttribute.CREATED); // "Utworzono"
    KEY: Cell = new Cell(this, RAttribute.KEY); // "Klucz"
    NAME: Cell = new Cell(this, RAttribute.NAME); // "Nazwa"
    MASK: Cell = new Cell(this, RAttribute.MASK); // "Maska"
    PARENT: Cell = new Cell(this, RAttribute.PARENT); // "Rodzic"
    ICON: Cell = new Cell(this, RAttribute.ICON); // "Ikona"
    DESC: Cell = new Cell(this, RAttribute.DESC); // "Opis"

    parentForeign = (context: any): ECategory => this._getForeign(context, RAttribute.PARENT); // klucz obcy parent -> category.id

    attrElm_attr = (context: any): EAttributeElement[] => this._getReferences(context, RAttributeElement.ATTR); // referencja attrElm.attr -> id
    category_attr = (context: any): ECategory[] => this._getReferences(context, RCategory.ATTR); // referencja category.attr -> id
    categoryAttr_attr = (context: any): ECategoryAttribute[] => this._getReferences(context, RCategoryAttribute.ATTR); // referencja categoryAttr.attr -> id
    catalog_attributes = (context: any): ECatalog[] => this._getReferences(context, RCatalog.ATTRIBUTES); // referencja catalog.attributes -> id
    catalogAttr_attr = (context: any): ECatalogAttribute[] => this._getReferences(context, RCatalogAttribute.ATTR); // referencja catalogAttr.attr -> id

}

//--------------------------------- Element atrybutu ----------------------------------------------

export class RElement extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.hidden = true;
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
        c.hidden = true;
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
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
        c.hidden = true;
    });

    static REQUIRED: Column = new Column((c: Column) => {
        c.key = "required";
        c.name = "Wymagany";
        c.type = "boolean";
    });

    static DEF_VAL: Column = new Column((c: Column) => {
        c.key = "defVal";
        c.name = "Wartość domyślna";
        c.type = "json";
        c.hidden = true;
    });

    static MIN: Column = new Column((c: Column) => {
        c.key = "min";
        c.name = "Minimum";
        c.type = "int";
        c.hidden = true;
    });

    static MAX: Column = new Column((c: Column) => {
        c.key = "max";
        c.name = "Maksimum";
        c.type = "int";
        c.hidden = true;
    });

    static REGEX: Column = new Column((c: Column) => {
        c.key = "regex";
        c.name = "Wyrażenie sprawdzające";
        c.type = "regex";
        c.hidden = true;
    });

    static FOREIGN_ELM: Column = new Column((c: Column) => {
        c.key = "foreignElm";
        c.name = "Element zewnętrzny";
        c.type = "int";
        c.hidden = true;
        c.foreign = () => R_ELEMENT;
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
        c.hidden = true;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "element";
            c.name = "Element atrybutu";
            c.group = "Atrybuty";
            c.record = EElement;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
            c.references = {
                element_foreignElm: {
                    name: "Element atrybutu",
                    repo: "element",
                    column: "foreignElm"
                },
                attrElm_elm: {
                    name: "Element atrybutu",
                    repo: "attrElm",
                    column: "elm"
                }
            };
        });
    }

}

export class EElement extends Record {

    ID: Cell = new Cell(this, RElement.ID); // "ID"
    UID: Cell = new Cell(this, RElement.UID); // "UIID"
    CREATED: Cell = new Cell(this, RElement.CREATED); // "Utworzono"
    KEY: Cell = new Cell(this, RElement.KEY); // "Klucz"
    NAME: Cell = new Cell(this, RElement.NAME); // "Nazwa"
    TYPE: Cell = new Cell(this, RElement.TYPE); // "Typ"
    DESC: Cell = new Cell(this, RElement.DESC); // "Opis"
    REQUIRED: Cell = new Cell(this, RElement.REQUIRED); // "Wymagany"
    DEF_VAL: Cell = new Cell(this, RElement.DEF_VAL); // "Wartość domyślna"
    MIN: Cell = new Cell(this, RElement.MIN); // "Minimum"
    MAX: Cell = new Cell(this, RElement.MAX); // "Maksimum"
    REGEX: Cell = new Cell(this, RElement.REGEX); // "Wyrażenie sprawdzające"
    FOREIGN_ELM: Cell = new Cell(this, RElement.FOREIGN_ELM); // "Element zewnętrzny"
    ENCRYPTED: Cell = new Cell(this, RElement.ENCRYPTED); // "Zaszyfrowany"
    ENUMERATE: Cell = new Cell(this, RElement.ENUMERATE); // "Enumerata"

    foreignElmForeign = (context: any): EElement => this._getForeign(context, RElement.FOREIGN_ELM); // klucz obcy foreignElm -> element.id

    element_foreignElm = (context: any): EElement[] => this._getReferences(context, RElement.FOREIGN_ELM); // referencja element.foreignElm -> id
    attrElm_elm = (context: any): EAttributeElement[] => this._getReferences(context, RAttributeElement.ELM); // referencja attrElm.elm -> id

}

//--------------------------------- Element atrybutu ----------------------------------------------

export class RAttributeElement extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.hidden = true;
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
        c.foreign = () => R_ELEMENT;
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
            c.key = "attrElm";
            c.name = "Element atrybutu";
            c.group = "Atrybuty";
            c.record = EAttributeElement;
            c.primaryKeyColumn = "id";
            c.displayMask = "${attr} - ${elm}";
            c.crude = "CRUD";
            c.local = false;
            c.references = {
                catalogAttrValue_attrElm: {
                    name: "Wartość atrybutu katalogu",
                    repo: "catalogAttrValue",
                    column: "attrElm"
                }
            };
        });
    }

}

export class EAttributeElement extends Record {

    ID: Cell = new Cell(this, RAttributeElement.ID); // "ID"
    ATTR: Cell = new Cell(this, RAttributeElement.ATTR); // "Atrybut"
    ELM: Cell = new Cell(this, RAttributeElement.ELM); // "Element"
    DEF_VAL: Cell = new Cell(this, RAttributeElement.DEF_VAL); // "Wartość domyslna"
    REQUIRED: Cell = new Cell(this, RAttributeElement.REQUIRED); // "Wymagane"

    attrForeign = (context: any): EAttribute => this._getForeign(context, RAttributeElement.ATTR); // klucz obcy attr -> attribute.id
    elmForeign = (context: any): EElement => this._getForeign(context, RAttributeElement.ELM); // klucz obcy elm -> element.id

    catalogAttrValue_attrElm = (context: any): ECatalogAttributeValue[] => this._getReferences(context, RCatalogAttributeValue.ATTR_ELM); // referencja catalogAttrValue.attrElm -> id

}

//--------------------------------- Kategoria ----------------------------------------------

export class RCategory extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.hidden = true;
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
        c.hidden = true;
        c.required = true;
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
        c.hidden = true;
    });

    static ICON: Column = new Column((c: Column) => {
        c.key = "icon";
        c.name = "Ikona";
        c.type = "enum";
    });

    static CATS: Column = new Column((c: Column) => {
        c.key = "cats";
        c.name = "Dozwolone kategorie";
        c.type = "int[]";
        c.hidden = true;
        c.foreign = () => R_CATEGORY;
    });

    static ATTR: Column = new Column((c: Column) => {
        c.key = "attr";
        c.name = "Dozwolone atrybuty";
        c.type = "int[]";
        c.hidden = true;
        c.foreign = () => R_ATTRIBUTE;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "category";
            c.name = "Kategoria";
            c.group = "Kategorie";
            c.record = ECategory;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
            c.references = {
                attribute_parent: {
                    name: "Atrybut",
                    repo: "attribute",
                    column: "parent"
                },
                category_cats: {
                    name: "Kategoria",
                    repo: "category",
                    column: "cats"
                },
                categoryAttr_cat: {
                    name: "Atrybut kategorii",
                    repo: "categoryAttr",
                    column: "cat"
                }
            };
        });
    }

}

export class ECategory extends Record {

    ID: Cell = new Cell(this, RCategory.ID); // "ID"
    UID: Cell = new Cell(this, RCategory.UID); // "UID"
    KEY: Cell = new Cell(this, RCategory.KEY); // "Klucz"
    NAME: Cell = new Cell(this, RCategory.NAME); // "Nazwa"
    CREATED: Cell = new Cell(this, RCategory.CREATED); // "Utworzono"
    DESC: Cell = new Cell(this, RCategory.DESC); // "Opis"
    ICON: Cell = new Cell(this, RCategory.ICON); // "Ikona"
    CATS: Cell = new Cell(this, RCategory.CATS); // "Dozwolone kategorie"
    ATTR: Cell = new Cell(this, RCategory.ATTR); // "Dozwolone atrybuty"

    catsForeign = (context: any): ECategory[] => this._getForeign(context, RCategory.CATS); // klucz obcy cats -> category.id
    attrForeign = (context: any): EAttribute[] => this._getForeign(context, RCategory.ATTR); // klucz obcy attr -> attribute.id

    attribute_parent = (context: any): EAttribute[] => this._getReferences(context, RAttribute.PARENT); // referencja attribute.parent -> id
    category_cats = (context: any): ECategory[] => this._getReferences(context, RCategory.CATS); // referencja category.cats -> id
    categoryAttr_cat = (context: any): ECategoryAttribute[] => this._getReferences(context, RCategoryAttribute.CAT); // referencja categoryAttr.cat -> id

}

//--------------------------------- Atrybut kategorii ----------------------------------------------

export class RCategoryAttribute extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.hidden = true;
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
        c.hidden = true;
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
            c.group = "Kategorie";
            c.record = ECategoryAttribute;
            c.primaryKeyColumn = "id";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class ECategoryAttribute extends Record {

    ID: Cell = new Cell(this, RCategoryAttribute.ID); // "ID"
    UID: Cell = new Cell(this, RCategoryAttribute.UID); // "UID"
    CAT: Cell = new Cell(this, RCategoryAttribute.CAT); // "Kategoria"
    ATTR: Cell = new Cell(this, RCategoryAttribute.ATTR); // "Atrybut"
    MASK: Cell = new Cell(this, RCategoryAttribute.MASK); // "Maska wyświetlania"
    REQUIRED: Cell = new Cell(this, RCategoryAttribute.REQUIRED); // "Wymagane"
    MULTIPLE: Cell = new Cell(this, RCategoryAttribute.MULTIPLE); // "Wielokrotne"
    UNIQUE: Cell = new Cell(this, RCategoryAttribute.UNIQUE); // "Unikalny"
    ABSTRACT: Cell = new Cell(this, RCategoryAttribute.ABSTRACT); // "Abstrakcyjny"

    catForeign = (context: any): ECategory => this._getForeign(context, RCategoryAttribute.CAT); // klucz obcy cat -> category.id
    attrForeign = (context: any): EAttribute => this._getForeign(context, RCategoryAttribute.ATTR); // klucz obcy attr -> attribute.id

}

//--------------------------------- Katalog ----------------------------------------------

export class RCatalog extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.hidden = true;
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
        c.hidden = true;
    });

    static DESC: Column = new Column((c: Column) => {
        c.key = "desc";
        c.name = "Opis";
        c.type = "memo";
        c.hidden = true;
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
        c.hidden = true;
        c.foreign = () => R_ATTRIBUTE;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "catalog";
            c.name = "Katalog";
            c.group = "Katalogi";
            c.record = ECatalog;
            c.primaryKeyColumn = "id";
            c.parentColumn = "parent";
            c.orderColumn = "order";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
            c.references = {
                catalog_category: {
                    name: "Katalog",
                    repo: "catalog",
                    column: "category"
                },
                catalog_parent: {
                    name: "Katalog",
                    repo: "catalog",
                    column: "parent"
                },
                catalogAttr_cat: {
                    name: "Atrybut katalogu",
                    repo: "catalogAttr",
                    column: "cat"
                },
                resource_cat: {
                    name: "Zasób",
                    repo: "resource",
                    column: "cat"
                }
            };
        });
    }

}

export class ECatalog extends Record {

    ID: Cell = new Cell(this, RCatalog.ID); // "ID"
    UID: Cell = new Cell(this, RCatalog.UID); // "UID"
    NAME: Cell = new Cell(this, RCatalog.NAME); // "Nazwa"
    ORDER: Cell = new Cell(this, RCatalog.ORDER); // "Kolejność"
    CATEGORY: Cell = new Cell(this, RCatalog.CATEGORY); // "Definicja"
    CREATED: Cell = new Cell(this, RCatalog.CREATED); // "Utworzono"
    DESC: Cell = new Cell(this, RCatalog.DESC); // "Opis"
    ABSTRACT: Cell = new Cell(this, RCatalog.ABSTRACT); // "Abstrakcyjne"
    PARENT: Cell = new Cell(this, RCatalog.PARENT); // "Rodzic"
    ATTRIBUTES: Cell = new Cell(this, RCatalog.ATTRIBUTES); // "Atrybuty"

    categoryForeign = (context: any): ECatalog => this._getForeign(context, RCatalog.CATEGORY); // klucz obcy category -> catalog.id
    parentForeign = (context: any): ECatalog => this._getForeign(context, RCatalog.PARENT); // klucz obcy parent -> catalog.id
    attributesForeign = (context: any): EAttribute[] => this._getForeign(context, RCatalog.ATTRIBUTES); // klucz obcy attributes -> attribute.id

    catalog_category = (context: any): ECatalog[] => this._getReferences(context, RCatalog.CATEGORY); // referencja catalog.category -> id
    catalog_parent = (context: any): ECatalog[] => this._getReferences(context, RCatalog.PARENT); // referencja catalog.parent -> id
    catalogAttr_cat = (context: any): ECatalogAttribute[] => this._getReferences(context, RCatalogAttribute.CAT); // referencja catalogAttr.cat -> id
    resource_cat = (context: any): EResource[] => this._getReferences(context, RResource.CAT); // referencja resource.cat -> id

}

//--------------------------------- Atrybut katalogu ----------------------------------------------

export class RCatalogAttribute extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.hidden = true;
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
        c.hidden = true;
        c.readOnly = true;
    });

    static CAT: Column = new Column((c: Column) => {
        c.key = "cat";
        c.name = "Katalog";
        c.type = "int";
        c.required = true;
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
        c.hidden = true;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "catalogAttr";
            c.name = "Atrybut katalogu";
            c.group = "Katalogi";
            c.record = ECatalogAttribute;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "attr";
            c.crude = "CRUD";
            c.local = false;
            c.references = {
                catalogAttrValue_catAttr: {
                    name: "Wartość atrybutu katalogu",
                    repo: "catalogAttrValue",
                    column: "catAttr"
                }
            };
        });
    }

}

export class ECatalogAttribute extends Record {

    ID: Cell = new Cell(this, RCatalogAttribute.ID); // "ID"
    UID: Cell = new Cell(this, RCatalogAttribute.UID); // "UID"
    CREATED: Cell = new Cell(this, RCatalogAttribute.CREATED); // "Utworzono"
    CAT: Cell = new Cell(this, RCatalogAttribute.CAT); // "Katalog"
    ATTR: Cell = new Cell(this, RCatalogAttribute.ATTR); // "Atrybut"
    ORDER: Cell = new Cell(this, RCatalogAttribute.ORDER); // "Kolejność"
    NOTES: Cell = new Cell(this, RCatalogAttribute.NOTES); // "Notatki"

    catForeign = (context: any): ECatalog => this._getForeign(context, RCatalogAttribute.CAT); // klucz obcy cat -> catalog.id
    attrForeign = (context: any): EAttribute => this._getForeign(context, RCatalogAttribute.ATTR); // klucz obcy attr -> attribute.id

    catalogAttrValue_catAttr = (context: any): ECatalogAttributeValue[] => this._getReferences(context, RCatalogAttributeValue.CAT_ATTR); // referencja catalogAttrValue.catAttr -> id

}

//--------------------------------- Wartość atrybutu katalogu ----------------------------------------------

export class RCatalogAttributeValue extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.hidden = true;
        c.readOnly = true;
        c.required = true;
        c.unique = true;
    });

    static CAT_ATTR: Column = new Column((c: Column) => {
        c.key = "catAttr";
        c.name = "Atrybut katalogu";
        c.type = "int";
        c.required = true;
        c.foreign = () => R_CATALOG_ATTRIBUTE;
    });

    static ATTR_ELM: Column = new Column((c: Column) => {
        c.key = "attrElm";
        c.name = "Element atrybutu";
        c.type = "int";
        c.required = true;
        c.foreign = () => R_ATTRIBUTE_ELEMENT;
    });

    static VALUE: Column = new Column((c: Column) => {
        c.key = "value";
        c.name = "Wartość";
        c.type = "json";
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "catalogAttrValue";
            c.name = "Wartość atrybutu katalogu";
            c.group = "Katalogi";
            c.record = ECatalogAttributeValue;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "value";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class ECatalogAttributeValue extends Record {

    ID: Cell = new Cell(this, RCatalogAttributeValue.ID); // "ID"
    CAT_ATTR: Cell = new Cell(this, RCatalogAttributeValue.CAT_ATTR); // "Atrybut katalogu"
    ATTR_ELM: Cell = new Cell(this, RCatalogAttributeValue.ATTR_ELM); // "Element atrybutu"
    VALUE: Cell = new Cell(this, RCatalogAttributeValue.VALUE); // "Wartość"

    catAttrForeign = (context: any): ECatalogAttribute => this._getForeign(context, RCatalogAttributeValue.CAT_ATTR); // klucz obcy catAttr -> catalogAttr.id
    attrElmForeign = (context: any): EAttributeElement => this._getForeign(context, RCatalogAttributeValue.ATTR_ELM); // klucz obcy attrElm -> attrElm.id

}

//--------------------------------- Zasób ----------------------------------------------

export class RResource extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.hidden = true;
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
        c.hidden = true;
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
        c.hidden = true;
    });

    static VALUE: Column = new Column((c: Column) => {
        c.key = "value";
        c.name = "Wartość";
        c.type = "memo";
        c.hidden = true;
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
        c.type = "fileName";
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
        c.hidden = true;
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
        c.hidden = true;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "resource";
            c.name = "Zasób";
            c.record = EResource;
            c.primaryKeyColumn = "id";
            c.displayNameColumn = "name";
            c.crude = "CRUD";
            c.local = false;
        });
    }

}

export class EResource extends Record {

    ID: Cell = new Cell(this, RResource.ID); // "ID"
    UID: Cell = new Cell(this, RResource.UID); // "UID"
    CREATED: Cell = new Cell(this, RResource.CREATED); // "Utworzono"
    TYPE: Cell = new Cell(this, RResource.TYPE); // "Typ"
    NAME: Cell = new Cell(this, RResource.NAME); // "Nazwa"
    DESC: Cell = new Cell(this, RResource.DESC); // "Opis"
    VALUE: Cell = new Cell(this, RResource.VALUE); // "Wartość"
    FORMAT: Cell = new Cell(this, RResource.FORMAT); // "Format"
    CAT: Cell = new Cell(this, RResource.CAT); // "Katalog"
    FILE: Cell = new Cell(this, RResource.FILE); // "Plik"
    SIZE: Cell = new Cell(this, RResource.SIZE); // "Rozmiar"
    MD5: Cell = new Cell(this, RResource.MD5); // "MD5"
    CRYPT_KEY: Cell = new Cell(this, RResource.CRYPT_KEY); // "Klucz"
    TAGS: Cell = new Cell(this, RResource.TAGS); // "Tagi"

    catForeign = (context: any): ECatalog => this._getForeign(context, RResource.CAT); // klucz obcy cat -> catalog.id
    cryptKeyForeign = (context: any): ECryptKey => this._getForeign(context, RResource.CRYPT_KEY); // klucz obcy cryptKey -> cryptKey.id

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
            c.record = ECryptKey;
            c.primaryKeyColumn = "id";
            c.crude = "CRUD";
            c.local = false;
            c.references = {
                resource_cryptKey: {
                    name: "Zasób",
                    repo: "resource",
                    column: "cryptKey"
                }
            };
        });
    }

}

export class ECryptKey extends Record {

    ID: Cell = new Cell(this, RCryptKey.ID); // "ID"
    UID: Cell = new Cell(this, RCryptKey.UID); // "UID"
    CREATED: Cell = new Cell(this, RCryptKey.CREATED); // "Utworzono"
    USER_ID: Cell = new Cell(this, RCryptKey.USER_ID); // "Użytkownik"
    SVR_KEY: Cell = new Cell(this, RCryptKey.SVR_KEY); // "Klucz usługi"
    USER_KEY: Cell = new Cell(this, RCryptKey.USER_KEY); // "Klucz użytkownika"
    MD5: Cell = new Cell(this, RCryptKey.MD5); // "MD5"

    resource_cryptKey = (context: any): EResource[] => this._getReferences(context, RResource.CRYPT_KEY); // referencja resource.cryptKey -> id

}

export const R_STATUS: RStatus = Repository.register(new RStatus());
export const R_CONFIG: RConfig = Repository.register(new RConfig());
export const R_REPO_STATE: RRepoState = Repository.register(new RRepoState());
export const R_REPO_HISTORY: RRepoHistory = Repository.register(new RRepoHistory());
export const R_DEMO1: RDemo1 = Repository.register(new RDemo1());
export const R_USERS: RUsers = Repository.register(new RUsers());
export const R_THREADS: RThreads = Repository.register(new RThreads());
export const R_ATTRIBUTE: RAttribute = Repository.register(new RAttribute());
export const R_ELEMENT: RElement = Repository.register(new RElement());
export const R_ATTRIBUTE_ELEMENT: RAttributeElement = Repository.register(new RAttributeElement());
export const R_CATEGORY: RCategory = Repository.register(new RCategory());
export const R_CATEGORY_ATTRIBUTE: RCategoryAttribute = Repository.register(new RCategoryAttribute());
export const R_CATALOG: RCatalog = Repository.register(new RCatalog());
export const R_CATALOG_ATTRIBUTE: RCatalogAttribute = Repository.register(new RCatalogAttribute());
export const R_CATALOG_ATTRIBUTE_VALUE: RCatalogAttributeValue = Repository.register(new RCatalogAttributeValue());
export const R_RESOURCE: RResource = Repository.register(new RResource());
export const R_CRYPT_KEY: RCryptKey = Repository.register(new RCryptKey());