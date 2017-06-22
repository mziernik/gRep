import * as Check from "../utils/Check";
import Repository from "./Repository";
import Record from "./Record";
import * as Utils from "../utils/Utils";
import * as If from "../utils/If";
export type SimpleType = "any" | "boolean" | "number" | "string" | "object" | "array";

const all = {};

export class DataType {

    simpleType: SimpleType;
    parser: (value: any) => any;
    serializer: (value: any) => any;
    formatter: (value: any) => string;
    name: string;
    single: boolean;

    enumerate: ?[] = null; // np.: [['tekst',{wartość}],['tekst2',{wartość2}],...]

    units: ?[] = null; // [klucz, nazwa, mnożnik]

    constructor(config: (dt: DataType) => void, single: boolean = true) {
        Check.isFunction(config);
        config(this);
        this.single = single;

        if (single) {
            if (all[this.name]) throw new Error("Typ danych " + JSON.stringify(this.name) + " już istnieje");
            all[this.name] = this;
        }

        //  name: string, simpleType: SimpleType, parser: (value: any) => any)
        Check.isFunction(this.parser);
        Check.instanceOf(this.simpleType, ["any", "boolean", "number", "string", "object", "array"]);
    }

    formatValue(value: any): string {
        return this.formatter ? this.formatter(value) : Utils.toString(value);
    }

    clone(): DataType {
        const result = new this.constructor(this.name, this.simpleType, this.parser);
        Utils.clone(this, result);
        return result;
    }

    parse(value: ?any): any {
        return value === null || value === undefined ? value : this.parser(value);
    }

    serialize(value: ?any): any {
        return value === null || value === undefined ? value : this.serializer ? this.serializer(value) : value;
    }

    get isList(): boolean {
        return this instanceof ListDataType;
    }

    get isMultiple(): boolean {
        return this instanceof MultipleDataType;
    }


    // /** @private */
    // setEnumerate(enumerate: [], multiple: boolean = false): DataType {
    //     this.enumerate = enumerate;
    //     this.multiple = multiple;
    //     return this;
    // }
    //
    // /** @private */
    // setUnits(units: Map<string, String>): DataType {
    //     this.units = units;
    //     return this;
    // }

    //==================================================================================================================

    //--------------------- CellsDataType ---------------------

    //static BOOL_STRING = new CellsDataType("boolStr", [DataType.BOOLEAN, DataType.STRING], val => val);
}


export function get(name: string): DataType {

    let result: DataType = all[name];
    if (result)
        return result;

    if (name.endsWith("[]"))
        return new ListDataType(get(name.substring(0, name.length - 2)));

    if (name.startsWith("{") && name.endsWith("}")) {
        const names = name.substring(1, name.length - 1).split(",");
        if (names.length !== 2)
            throw new Error("Nieprawidłowa ilość elementów mapy: " + JSON.stringify(name));
        return new MapDataType(get(names[0].trim()), get(names[1].trim()));
    }

    if (name.startsWith("[") && name.endsWith("]")) {
        const names = name.substring(1, name.length - 1).split(",");
        return new SetDataType(names.map(name => get(name.trim())));
    }

    if (name.startsWith("<") && name.endsWith(">")) {
        const names = name.substring(1, name.length - 1).split(",");
        return new MultipleDataType(names.map(name => get(name.trim())));
    }


    throw new Error("Nieznany typ danych " + JSON.stringify(name));
}


export class SetDataType extends DataType {

    type: DataType;

    constructor(type: DataType) {
        super((dt: DataType) => {
            dt.name = "[" + type.name + "]";
            dt.simpleType = "array";
            dt.parser = value => {
                Check.isArray(value);
                value = Utils.forEach(value, elm => this.type.parse(elm));
                return value;
            }
        }, false);
        this.type = Check.instanceOf(type, [DataType]);
    }

}

export class ListDataType extends DataType {

    type: DataType;

    constructor(type: DataType) {
        super((dt: DataType) => {
            dt.name = type.name + "[]";
            dt.simpleType = "array";
            dt.parser = value => {
                Check.isArray(value);
                value = Utils.forEach(value, elm => this.type.parse(elm));
                return value;
            }
        }, false);
        this.type = Check.instanceOf(type, [DataType]);
    }

}

export class MapDataType extends DataType {

    keyType: DataType;
    valueType: DataType;
    types: DataType[];

    constructor(key: DataType, value: DataType) {
        super((dt: DataType) => {
            dt.name = "{" + key.name + ", " + value.name + "}";
            dt.simpleType = "object";
            dt.parser = value => {
                Check.isObject(value);
                const result: Map = new Map();
                Utils.forEach(value, (val, key) => {
                    if (value instanceof Array) {
                        key = val instanceof Array ? val[0] : null;
                        val = val instanceof Array ? val[1] : null;
                    }

                    result.set(this.keyType.parse(key), this.valueType.parse(val));
                });
                return result;
            }
        }, false);

        this.keyType = key;
        this.valueType = value;
        this.types = [key, value];
    }

}

export class MultipleDataType extends DataType {

    types: DataType[];

    constructor(types: DataType[]) {
        super((dt: DataType) => {
            dt.name = "<" + types.map(c => c.name).join(", ") + ">";
            dt.simpleType = "array";
            dt.parser = value => {
                debugger;

                return value;
            }
        }, false);
        this.types = types;
    }

}


function parseNumber(value: any, parsed: number) {
    if (value instanceof Array || isNaN(value) || isNaN(parsed))
        throw new Error('Nieprawidłowa wartość numeryczna: ' + JSON.stringify(value));
    return parsed;
}


export const BOOLEAN: DataType = new DataType((dt: DataType) => {
    dt.name = "boolean";
    dt.simpleType = "boolean";
    dt.parser = val => {
        return val ? true : false;
    }
});

export const STRING: DataType = new DataType((dt: DataType) => {
    dt.name = "string";
    dt.simpleType = "string";
    dt.parser = val => "" + val;
});


export const UUID: DataType = new DataType((dt: DataType) => {
    dt.name = "uid";
    dt.simpleType = "string";
    dt.parser = val => {
        if (!val.match("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"))
            throw new Error(JSON.stringify(val) + " nie jest prawidłowym identyfikatorem UUID");
        return val;
    }
});

export const REGEX: DataType = new DataType((dt: DataType) => {
    dt.name = "regex";
    dt.simpleType = "string";
    dt.parser = val => val;
});

export const FILE_NAME: DataType = new DataType((dt: DataType) => {
    dt.name = "file_name";
    dt.simpleType = "string";
    dt.parser = val => val;
});

export const PASSWORD: DataType = new DataType((dt: DataType) => {
    dt.name = "password";
    dt.simpleType = "string";
    dt.parser = val => "" + val;
});

export const KEY: DataType = new DataType((dt: DataType) => {
    dt.name = "key";
    dt.simpleType = "string";
    dt.parser = val => "" + val;
});

// textarea
export const MEMO: DataType = new DataType((dt: DataType) => {
    dt.name = "memo";
    dt.simpleType = "string";
    dt.parser = val => "" + val;
});

export const BYTE: DataType = new DataType((dt: DataType) => {
    dt.name = "byte";
    dt.simpleType = "number";
    dt.parser = val => parseNumber(val, parseInt(Number(val)));
});

export const SHORT: DataType = new DataType((dt: DataType) => {
        dt.name = "short";
        dt.simpleType = "number";
        dt.parser = val => parseNumber(val, parseInt(Number(val)));
    }
);
export const INT: DataType = new DataType((dt: DataType) => {
        dt.name = "int";
        dt.simpleType = "number";
        dt.parser = val => parseNumber(val, parseInt(Number(val)));
    }
);

export const LONG: DataType = new DataType((dt: DataType) => {
        dt.name = "long";
        dt.simpleType = "number";
        dt.parser = val => parseNumber(val, parseInt(Number(val)));
    }
);

// rozmiar danych w bajtach
export const SIZE: DataType = new DataType((dt: DataType) => {
    dt.name = "size";
    dt.simpleType = "number";
    dt.parser = val => parseNumber(val, parseInt(Number(val)));
    dt.units = [
        ["b", "B", 1],
        ["kb", "KB", 1024],
        ["mb", "MB", 1024 * 1024],
        ["gb", "GB", 1024 * 1024 * 1024],
    ];
    dt.formatter = (val: number) => Utils.formatFileSize(val);
});

export const FLOAT: DataType = new DataType((dt: DataType) => {
    dt.name = "float";
    dt.simpleType = "number";
    dt.parser = val => parseNumber(val, parseFloat(Number(val)))
});

export const DOUBLE: DataType = new DataType((dt: DataType) => {
    dt.name = "double";
    dt.simpleType = "number";
    dt.parser = val => parseNumber(val, parseFloat(Number(val)))
});

export const DATE: DataType = new DataType((dt: DataType) => {
    dt.name = "date";
    dt.simpleType = "string";
    dt.parser = val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość daty');
        return date;
    }
});

export const TIME: DataType = new DataType((dt: DataType) => {
    dt.name = "time";
    dt.simpleType = "string";
    dt.parser = val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość czasu');
        return date;
    }
});

export const TIMESTAMP: DataType = new DataType((dt: DataType) => {
    dt.name = "timestamp";
    dt.simpleType = "string";
    dt.parser = val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość czasu');
        return date;
    };
    dt.serializer = (val: Date) => val.getTime();
});

//ToDo: Wojtek: Obsługa w FieldComponent
// upływ czasu (milisekundy)
export const DURATION: DataType = new DataType((dt: DataType) => {
    dt.name = "duration";
    dt.simpleType = "number";
    dt.parser = val => {
        //ToDo: dopisać
        return val;
    };
    dt.units = [
        ["ms", "ms", 1],
        ["s", "s", 1000],
        ["m", "m", 1000 * 60],
        ["h", "h", 1000 * 60 * 60],
        ["d", "d", 1000 * 60 * 60 * 24]
    ];
});
