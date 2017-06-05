import * as Check from "../utils/Check";
export type SimpleType = "boolean" | "number" | "string" | "object" | "array";

export default class DataType {

    simpleType: SimpleType;
    parser: (value: any) => any;
    name: string;
    enumerate: ?{} = null;
    multiple: boolean = false;
    units: {};

    constructor(name: string, simpleType: SimpleType, parser: (value: any) => any) {
        this.name = name;
        this.parser = Check.isFunction(parser);
        this.simpleType = Check.instanceOf(simpleType, ["boolean", "number", "string", "object", "array"]);
    }

    getDisplayValue(value: any) {
        return "" + value;
    }

    parse(value: any): any {
        return this.parser(value);
    }

    /** @private */
    setEnumerate(enumerate: {}, multiple: boolean = false): DataType {
        this.enumerate = enumerate;
        this.multiple = multiple;
        return this;
    }

    /** @private */
    setUnits(units: {}): DataType {
        this.units = units;
        return this;
    }

    static BOOLEAN = new DataType("boolean", "boolean", val => {
        if (val === null || val === undefined) return val;
        return val ? true : false;
    });
    static STRING = new DataType("string", "string", val => val);
    static PASSWORD = new DataType("password", "string", val => val);
    static INT = new DataType("int", "number", val => {
        if (val === null || val === undefined) return val;
        return parseInt(val);
    });
    static LENGTH = new DataType("length", "number", val => {
        if (val === null || val === undefined) return val;
        return parseInt(val);
    });// rozmiar danych w bajtach
    static DOUBLE = new DataType("double", "number", val => {
        if (val === null || val === undefined) return val;
        return parseFloat(val);
    });
    static DATE = new DataType("date", "string", val => {
        if (val === null || val === undefined) return val;
        const date = new Date(val);
        if (isNaN(date)) throw new Error('Nieprawidłowa wartość daty');
        return date;
    });
    static TIME = new DataType("time", "string", val => {
        if (val === null || val === undefined) return val;
        const date = new Date(val);
        if (isNaN(date)) throw new Error('Nieprawidłowa wartość czasu');
        return date;
    });
    static TIMESTAMP = new DataType("timestamp", "string", val => {
        if (val === null || val === undefined) return val;
        const date = new Date(val);
        if (isNaN(date)) throw new Error('Nieprawidłowa wartość czasu');
        return date;
    });
    // select
    static ENUM = new DataType("enum", "object", val => {
        if (val === null || val === undefined) return val;
        return Check.isArray(val);
    });

    // multiselect
    static ENUMS = new DataType("enums", "object", val => {
        if (val === null || val === undefined) return val;
        return Check.isArray(val);
    });

    static OBJECT = new DataType("object", "object", val => {
        if (val === null || val === undefined) return val;
        return Check.isObject(val);
    });

    static ARRAY = new DataType("array", "array", val => {
        if (val === null || val === undefined) return val;
        return Check.isArray(val);
    });
}