import {Record, Repository, Field, Column, RepoConfig, Dev, Utils, CRUDE, Ready} from "../core.js";
import {Icon} from "../components.js";

/**
 * Demonstracyjne repozytoria
 */


let dataGenerated = false;

export class ROccupations extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.required = true;
        c.unique = true;
    });

    static NAME: Column = new Column((c: Column) => {
        c.key = "name";
        c.name = "Nazwa";
        c.type = "string";
        c.required = true;
        c.unique = true;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "demo-occup";
            c.name = "Zawody";
            c.description = "Słownik zawodów";
            c.record = ROccupation;
            c.primaryKeyColumn = ROccupations.ID;
            c.displayNameColumn = ROccupations.NAME;
            c.crude = "CRUD";
            c.group = "Demo";
            //          c.local = false;
//            c.icon = "fa fa-users";
        })
    }
}


export class ROccupation extends Record {
    ID: Field = new Field(ROccupations.ID, this);
    NAME: Field = new Field(ROccupations.NAME, this);
}


//-----------------------------------------------------------------------------

export class RAddresses extends Repository {

    static ID: Column = new Column((c: Column) => {
        c.key = "id";
        c.name = "ID";
        c.type = "int";
        c.autoGenerated = true;
        c.required = true;
        c.unique = true;
    });

    static USER: Column = new Column((c: Column) => {
        c.key = "user";
        c.name = "Użytkownik";
        c.type = "int";
        c.required = true;
        c.foreign = () => RUSERS;
    });

    static TYPE: Column = new Column((c: Column) => {
        c.key = "type";
        c.name = "Typ";
        c.type = "char";
        c.required = true;
        c.enumerate = {
            "C": "Korespondencyjny",
            'L': "Zamieszkania",
            "M": "Zameldowania",
        }
    });

    static CITY: Column = new Column((c: Column) => {
        c.key = "city";
        c.name = "Miejscowość";
        c.type = "string";
        c.required = true;
    });

    static STREET: Column = new Column((c: Column) => {
        c.key = "street";
        c.name = "Ulica";
        c.type = "string";
    });

    static HOME: Column = new Column((c: Column) => {
        c.key = "home";
        c.name = "Nr domu / mieszkania";
        c.type = "string";
        c.required = true;
    });

    static POST_CODE: Column = new Column((c: Column) => {
        c.key = "postCode";
        c.name = "Kod pocztowy";
        c.type = "string";
        c.required = true;
    });


    constructor() {
        super((c: RepoConfig) => {
            c.key = "demo-addr";
            c.name = "Adresy użytkowników";
            c.description = "Adresy użytkowników / pracowników";
            c.record = RAddress;
            c.primaryKeyColumn = RAddresses.ID;
            c.crude = "CRUD";
            c.group = "Demo";
            //          c.local = false;
//            c.icon = "fa fa-users";
        })
    }

    createRecord(context: any, crude: CRUDE): Record {
        const result: RAddress = super.createRecord(context, crude);
        if (!dataGenerated || crude !== CRUDE.CREATE)
            return result;

        result.TYPE.value = ["C", "L", "M"].random();
        result.CITY.value = Dev.CITIES.random();
        result.POST_CODE.value = Dev.randomPostCode();
        result.STREET.value = Dev.STREETS.random();
        result.HOME.value = Math.round(Math.random() * 500);

        return result;
    }


}

export class RAddress extends Record {
    ID: Field = new Field(RAddresses.ID, this);
    USER: Field = new Field(RAddresses.USER, this);
    TYPE: Field = new Field(RAddresses.TYPE, this);
    CITY: Field = new Field(RAddresses.CITY, this);
    STREET: Field = new Field(RAddresses.STREET, this);
    HOME: Field = new Field(RAddresses.HOME, this);
    POST_CODE: Field = new Field(RAddresses.POST_CODE, this);


    get displayValue() {
        return this.STREET.value + " " + this.HOME.value + ", " + this.POST_CODE.value + " " + this.CITY.value;
    }
}

//-------------------------------------------------------------------------------


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

    static ACTIVE: Column = new Column((c: Column) => {
        c.key = "active";
        c.name = "Aktywny";
        c.type = "boolean";
        c.defaultValue = true;
    });

    static OCCUPATION: Column = new Column((c: Column) => {
        c.key = "job";
        c.name = "Stanowisko";
        c.type = "int";
        c.foreign = () => ROCCUPATIONS;
    });

    static SPECIALIZATIONS: Column = new Column((c: Column) => {
        c.key = "specializations";
        c.name = "Specjalizacje";
        c.type = "int[]";
        c.foreign = () => ROCCUPATIONS;
    });


    static SEX: Column = new Column((c: Column) => {
        c.key = "sex";
        c.name = "Płeć";
        c.type = "enum";
        c.enumerate = {
            "M": "Mężczyzna",
            "F": "Kobieta"
        };
        c.enumIcons = {
            "M": Icon.MARS,
            "F": Icon.VENUS,
        };
        c.enumStyles = {
            "M": {color: "blue"},
            "F": {color: "red"},
        }
    });

    static FIRST_NAME: Column = new Column((c: Column) => {
        c.key = "firstName";
        c.name = "Imię";
        c.type = "string";
    });

    static LAST_NAME: Column = new Column((c: Column) => {
        c.key = "lastName";
        c.name = "Nazwisko";
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


    constructor() {
        super((c: RepoConfig) => {
            c.key = "demo-users";
            c.name = "Użytkownicy";
            c.description = "Wszystko co związane z użytkownikami";
            c.record = RUsersRecord;
            c.primaryKeyColumn = RUsers.ID;
            c.displayNameColumn = RUsers.DISPLAY_NAME;
            c.crude = "CRU";
            c.group = "Demo";
            c.local = false;
            c.references = {
                address: {
                    name: "Adres",
                    repo: "demo-addr",
                    column: "user"
                }
            };
            c.actions = {
                add: {record: true, name: "Dodaj", confirm: null, type: "primary", icon: "fa fa-user-plus"},
                rem: {
                    record: true,
                    name: "Usuń",
                    confirm: "Czy na pewno usunąć?",
                    type: "danger",
                    icon: "fa fa-user-times"
                },
                edit: {
                    record: true,
                    name: "Edytuj",
                    type: "primary",
                    icon: "fa fa-user-times"
                },
                addRandom: {
                    record: false,
                    name: "Dodaj losowy",
                    confirm: null,
                    type: "primary",
                    icon: "fa fa-user-plus"
                },
                removeRandom: {
                    record: false,
                    name: "Usuń losowy",
                    confirm: null,
                    type: "danger",
                    icon: "fa fa-user-times"
                }
            };
        });
    }

    addRandom(count: number = 1) {
        const recs = [];
        let maxAddrId = RADDRESSES.max(RAddresses.ID, 0);

        for (let i = 0; i < count; i++) {
            const urec: RUsersRecord = RUSERS.createRecord("DEMO", CRUDE.CREATE);
            const usr = Dev.randomUser();
            urec.ID.value = RUSERS.max(RUsers.ID, 0) + 1 + i;

            urec.FIRST_NAME.value = usr.firstName;
            urec.LAST_NAME.value = usr.lastName;
            urec.DISPLAY_NAME.value = usr.firstName[0] + ". " + usr.lastName;
            urec.LOGIN.value = usr.firstName.toLowerCase() + "." + usr.lastName.toLowerCase();
            urec.EMAIL.value = urec.LOGIN.value + "@email.com";
            urec.ACTIVE.value = Math.random() > 0.5;
            urec.SEX.value = usr.male ? "M" : "F";

            const arr = [];
            for (let j = 1; j < Math.random() * 4; j++)
                arr.push(Utils.randomOfRange(0, Dev.OCCUPATIONS.length));
            urec.SPECIALIZATIONS.value = arr;
            urec.OCCUPATION.value = Utils.randomOfRange(0, Dev.OCCUPATIONS.length);
            recs.push(urec);

            for (let j = 0; j < Math.random() * 8; j++) {
                const arec: RAddress = RADDRESSES.createRecord("DEMO", CRUDE.CREATE);
                arec.ID.value = ++maxAddrId;
                arec.USER.value = urec.ID.value;
                arec.TYPE.value = ["C", "L", "M"].random();
                arec.CITY.value = Dev.CITIES.random();
                arec.POST_CODE.value = Dev.randomPostCode();
                arec.STREET.value = Dev.STREETS.random();
                arec.HOME.value = Math.round(Math.random() * 500);
                recs.push(arec);
            }
        }
        Repository.update("DEMO", recs);
    }

    editRandom() {
        const rec: RUsersRecord = RUSERS.get(this, Utils.forEach(RUSERS.rows, (v, k) => k).random(), true);
        rec.action = CRUDE.UPDATE;

        const usr = Dev.randomUser();

        rec.FIRST_NAME.value = usr.firstName;
        rec.LAST_NAME.value = usr.lastName;
        rec.DISPLAY_NAME.value = usr.firstName[0] + ". " + usr.lastName;
        rec.EMAIL.value = rec.LOGIN.value + "@new.email.com";
        rec.ACTIVE.value = Math.random() > 0.5;
        rec.SEX.value = usr.male ? "M" : "F";

        Repository.update('DEMO', [rec]);
    }


}

export class RUsersRecord extends Record {

    ID: Field = new Field(RUsers.ID, this);
    TOKEN: Field = new Field(RUsers.TOKEN, this);
    LOGIN: Field = new Field(RUsers.LOGIN, this);
    PASS: Field = new Field(RUsers.PASS, this);
    ACTIVE: Field = new Field(RUsers.ACTIVE, this);
    SEX: Field = new Field(RUsers.SEX, this);
    FIRST_NAME: Field = new Field(RUsers.FIRST_NAME, this);
    LAST_NAME: Field = new Field(RUsers.LAST_NAME, this);
    DISPLAY_NAME: Field = new Field(RUsers.DISPLAY_NAME, this);
    EMAIL: Field = new Field(RUsers.EMAIL, this);
    OCCUPATION: Field = new Field(RUsers.OCCUPATION, this);
    SPECIALIZATIONS: Field = new Field(RUsers.SPECIALIZATIONS, this);
}

const ROCCUPATIONS: ROccupations = Repository.register(new ROccupations());
const RUSERS: RUsers = Repository.register(new RUsers());
const RADDRESSES: RAddresses = Repository.register(new RAddresses());

Utils.forEach([ROCCUPATIONS, RUSERS, RADDRESSES], (repo: Repository) => {
    repo.storage = null;
    repo.isReady = true;
    Ready.confirm(Repository, repo);
});

window.addEventListener("load", () => {

    const recs = [];
    Utils.forEach(Dev.OCCUPATIONS, (name, idx) => {
        const rec: ROccupation = ROCCUPATIONS.createRecord("DEMO", CRUDE.CREATE);
        rec.ID.value = idx;
        rec.NAME.value = name;
        recs.push(rec);
    });

    Repository.update("DEMO", recs);

    RUSERS.addRandom(10);

    dataGenerated = true;
});


