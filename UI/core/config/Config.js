import {DataType} from "../repository/Type";
import {EConfig, RCONFIG} from "./ConfigRepo";
import {Column, Field, CRUDE, Repository} from "../core";

export const FIELDS: ConfigField[] = [];

export default class ConfigField {

    field: Field;
    record: EConfig;

    constructor(type: DataType, key: string, name: string, value: any) {
        this.field = new Field((c: Column) => {
            c.type = type;
            c.key = key;
            c.name = name;
            c.defaultValue = value;
        });

        FIELDS.push(this.field);
        this.record = RCONFIG.createRecord("CONFIG", CRUDE.CREATE);
        this.record.KEY.value = key;
        this.record.TYPE.value = this.field.type.name;
        this.record.NAME.value = name;
        this.record.REQUIRED.value = true;
        this.record.LOCAL.value = true;
        Repository.update("CONFIG", [this.record]);
    }

}





