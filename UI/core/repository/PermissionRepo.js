//FixMe importy

import Repository, {DATA_TYPE as DT_REPOSITORY} from "./Repository";
import Record from "./Record";
import Field from "./Field";
import Permission from "../application/Permission";
import * as Utils from "../utils/Utils";
import Action from "./Action";
import Debug from "../Debug";
import DataType from "./DataType";

export default class PermissionsRepo extends Repository {

    constructor() {
        super("permissions", "Uprawnienia", DataType.STRING, PermissionRecord);
        Object.preventExtensions(this);
    }

    refresh() {
        this._update(this, Utils.forEachMap(Permission.all, (p: Permission) => p.record ? undefined
            : new PermissionRecord(this, p.id, p.name, p.getCrude(), p)), false);
    }
}


export class PermissionRecord extends Record {

    ID: Field = new Field(DataType.STRING).primaryKey();
    NAME: Field = new Field(DataType.STRING).required();
    CREATE: Field = new Field(DataType.BOOLEAN).required();
    READ: Field = new Field(DataType.BOOLEAN).required();
    UPDATE: Field = new Field(DataType.BOOLEAN).required();
    DELETE: Field = new Field(DataType.BOOLEAN).required();
    EXECUTE: Field = new Field(DataType.BOOLEAN).required();
    permission: ?Permission = null;

    constructor(repo: PermissionsRepo, id: string, name: string, crude: ?string, permission: ?Permission) {
        super(repo);

        this.permission = permission;
        this.ID.set(id);
        this.NAME.set(name);

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

        Object.preventExtensions(this);
    }

    _update(context: any, action: Action, source: Record): Record {
        super._update(context, action, source);
        if (!source.permission)
            return;
        source.permission.record = this;
        this.permission = source.permission;

        const crude = this.permission.getCrude();

        this.permission.create(this.CREATE.get());
        this.permission.read(this.READ.get());
        this.permission.update(this.UPDATE.get());
        this.permission.delete(this.DELETE.get());
        this.permission.execute(this.EXECUTE.get());

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