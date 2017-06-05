/**
 * Rola w systemie (funkcjonalność)
 */
export type Action = "create" | "read" | "update" | "delete" | "execute";

export default class Permission {
    static all = {};

    id: string;
    name: ?string;

    _create: boolean = false;
    _read: boolean = false;
    _update: boolean = false;
    _delete: boolean = false;
    _execute: boolean = false;
    _context: any;
    record: ?Object = null; // PermisionRecord;

    constructor(context: any, id: string, name: string, crude: string = "CRUDE") {
        this._context = context;
        this.id = id;
        this.name = name;
        this.setCrude(crude);
        if (Permission.all[id])
            throw new Error("Uprawnienie " + JSON.stringify(id) + " już istnieje");
        Permission.all[id] = this;
        Object.preventExtensions(this);
    }


    setCrude(crude: string = "CRUDE") {
        crude = (crude || "").toUpperCase();
        this.create(crude.indexOf("C") !== -1);
        this.read(crude.indexOf("R") !== -1);
        this.update(crude.indexOf("U") !== -1);
        this.delete(crude.indexOf("D") !== -1);
        this.execute(crude.indexOf("E") !== -1);
    }

    getCrude() {
        return (this._create ? "C" : "")
            + (this._read ? "R" : "")
            + (this._update ? "U" : "")
            + (this._delete ? "D" : "")
            + (this._execute ? "E" : "");
    }

    create(state: boolean): Permission {
        this._create = state;
        return this;
    }

    read(state: boolean): Permission {
        this._read = state;
        return this;
    }

    update(state: boolean): Permission {
        this._update = state;
        return this;
    }

    delete(state: boolean): Permission {
        this._delete = state;
        return this;
    }

    execute(state: boolean): Permission {
        this._execute = state;
        return this;
    }


    hasRight(action: Action): boolean {

        switch ((action || "").toLowerCase()) {

            case "create":
            case "c":
                return this._create;

            case "read":
            case "r":
                return this._read;

            case "update":
            case "u":
                return this._update;

            case "delete":
            case "d":
                return this._delete;

            case "execute":
            case "e":
                return this._execute;
        }

    }


}

