import {DataType} from "../repository/Type";
import {Utils, Field, CRUDE, Column, Repository} from "../core";
import * as Bootstrap from "../Bootstrap";

export const FIELDS: ConfigField[] = [];


export default class ConfigField {

    field: Field;
    record: EConfig;

    static create(type: DataType, key: string, name: string, value: any): ConfigField {
        return new ConfigField((c: Column) => {
            c.type = type;
            c.key = key;
            c.name = name;
            c.defaultValue = value;
        });
    }

    constructor(config: (c: Column) => void) {

        Bootstrap.onCoreReady(mod => {
            this.field = new Field(config);
            FIELDS.push(this.field);

            const RCONFIG = require("./ConfigRepo").RCONFIG;

            this.record = RCONFIG.createRecord("CONFIG", CRUDE.CREATE);
            this.record.KEY.value = this.field.key;
            this.record.TYPE.value = this.field.type.name;
            this.record.NAME.value = this.field.name;
            this.record.DEFAULT_VALUE.value = this.field.config.defaultValue;
            this.record.REQUIRED.value = true;
            this.record.LOCAL.value = true;
            Repository.update("CONFIG", [this.record]);
        });
    }

    get value(): any {
        return this.field.value;
    }

    set value(value: any) {
        this.field.value = value;
    }

    toString() {
        return Utils.toString(this.value);
    }

}





