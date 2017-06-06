import * as Check from "../utils/Check";
export type SimpleType = "boolean" | "number" | "string" | "object" | "array";

export default class DataType {

    simpleType: SimpleType;
    parser: (value: any) => any;
    name: string;
    enumerate: ?{} = null;
    multiple: boolean = false;
    units: Map<String, String>;

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
    setUnits(units: Map<String, String>): DataType {
        this.units = units;
        return this;
    }

    static BOOLEAN = new DataType("boolean", "boolean", val => {
        return val ? true : false;
    });

    static STRING = new DataType("string", "string", val => "" + val);

    static PASSWORD = new DataType("password", "string", val => "" + val);

    // problem parseInt("10abc"), parseInt([]);
    static INT = new DataType("int", "number", val => parseNumber(val, parseInt(Number(val))));

    static LENGTH = new DataType("length", "number", val =>  parseNumber(val, parseInt(Number(val)))); // rozmiar danych w bajtach

    static DOUBLE = new DataType("double", "number", val =>  parseNumber(val, parseFloat(Number(val))));

    static DATE = new DataType("date", "string", val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość daty');
        return date;
    });

    static TIME = new DataType("time", "string", val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość czasu');
        return date;
    });

    static TIMESTAMP = new DataType("timestamp", "string", val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość czasu');
        return date;
    });

    static OBJECT = new DataType("object", "object", val => {
        return Check.isObject(val);
    });

    static ARRAY = new DataType("array", "array", val => {
        return Check.isArray(val);
    });
}

function parseNumber(value: any, parsed: number) {
    // parseInt(Number("10abc"))
    if (isNaN(value) || isNaN(parsed))
        throw new Error('Nieprawidłowa wartość czasu');
    return parsed;
}