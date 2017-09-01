import {Column, Record} from "../core";
import ConfigNode from "./ConfigNode";
import {Utils, Check} from "../$utils";
import Field from "../repository/Field";
import * as Bootstrap from "../Bootstrap";


export const FIELDS: ConfigField[] = [];

export class ConfigFieldData extends Column {

    local: boolean = true;
    user: boolean = false;
    group: ?string = null;

}

export default class ConfigField {

    field: Field;

    node: ConfigNode;

    constructor(node: ConfigNode, config: (c: Column) => void) {
        this.node = Check.instanceOf(node, [ConfigNode]);
        node.fields.push(this);
        this.field = new Field(new ConfigFieldData(config));
        this.field.config.key = (node ? node.fullId + "." : "") + this.field.key;
        FIELDS.push(this.field);
        Bootstrap.onLoad(() => require("./ConfigRepositories").R_CONFIG_FIELD.create(this));
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





