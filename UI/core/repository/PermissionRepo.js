//FixMe importy


import Repository, {DATA_TYPE as DT_REPOSITORY, RepoConfig} from "./Repository";
import Record, {RecordConfig} from "./Record";
import Field, {FieldConfig} from "./Field";
import Permission from "../application/Permission";
import * as Utils from "../utils/Utils";
import Action from "./Action";
import Debug from "../Debug";
import {Type} from  "../core";
import * as CRUDE from "./CRUDE";

export default class PermissionsRepo extends Repository {

    constructor() {
        super((rc: RepoConfig) => {
            rc.key = "permissions";
            rc.name = "Uprawnienia";
            rc.primaryKeyColumn = "id";
            rc.recordClass = PermissionRecord;
        });

        Object.preventExtensions(this);
        this.isLocal = true;
    }

    refresh() {
        this._update(this, Utils.forEach(Permission.all, (p: Permission) => p.record ? undefined
            : new PermissionRecord(this, p.id, p.name, p.getCrude(), p)), false);
        this.isReady = true;
    }
}


export class PermissionRecord extends Record {

    ID: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "id";
        fc.name = "ID";
        fc.unique = true;
        fc.required = true;
        fc.readOnly = true;
    });

    NAME: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "name";
        fc.name = "Nazwa";
    });

    CREATE: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.BOOLEAN;
        fc.key = "create";
        fc.name = "Tworzenie";
        fc.required = true;
    });

    READ: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.BOOLEAN;
        fc.key = "read";
        fc.name = "Odczyt";
        fc.required = true;
    });

    UPDATE: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.BOOLEAN;
        fc.key = "update";
        fc.name = "Aktualizacja";
        fc.required = true;
    });

    DELETE: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.BOOLEAN;
        fc.key = "delete";
        fc.name = "Usuwanie";
        fc.required = true;
    });

    EXECUTE: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.BOOLEAN;
        fc.key = "execute";
        fc.name = "Wykonanie";
        fc.required = true;
    });

    permission: ?Permission = null;

    constructor(repo: PermissionsRepo, id: string, name: string, crude: ?string, permission: ?Permission) {
        super(repo);

        this.permission = permission;
        this.ID.set(id);
        this.NAME.set(name);
        this._action = CRUDE.UPDATE;

        this.fieldChanged.listen(this, (field: Field, prev: ?any) => {
            if (this._editContext && this._temporary && prev !== null)
                Repository.submit(this, [this]);
        });

        if (crude) {
            crude = (crude || "").toUpperCase();
            this.CREATE.set(crude.indexOf("C") !== -1);
            this.READ.set(crude.indexOf("R") !== -1);
            this.UPDATE.set(crude.indexOf("U") !== -1);
            this.DELETE.set(crude.indexOf("D") !== -1);
            this.EXECUTE.set(crude.indexOf("E") !== -1);
        }

        this.init();
    }

    _update(context: any, action: Action, source: Record): Record {
        super._update(context, action, source);
        if (!source.permission)
            return;
        source.permission.record = this;
        this.permission = source.permission;

        const crude = this.permission.getCrude();

        this.permission.create(this.CREATE.value);
        this.permission.read(this.READ.value);
        this.permission.update(this.UPDATE.value);
        this.permission.delete(this.DELETE.value);
        this.permission.execute(this.EXECUTE.value);

        if (crude !== this.permission.getCrude())
            Debug.log(this, `Aktualizacja uprawnień  ${this.permission.id}: ${crude} -> ${this.permission.getCrude()}`);
    }

    beginEdit(context: any): Record {
        const result: PermissionsRepo = super.beginEdit(context);
        result.permission = this.permission;
        return result;
    }

    static create(id: string, crude: string): PermissionRecord {
        return PermissionsRepo.instance.add(new PermissionRecord(name, crude));
    }

    hasRight(action: string): boolean {

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

export const PERMISSIONS: PermissionsRepo = Repository.register(new PermissionsRepo());