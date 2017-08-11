import * as Check from "../utils/Check";
import Repository from "./Repository";
import Record from "./Record";
import * as Utils from "../utils/Utils";
import * as If from "../utils/Is";
import Icon from "../component/glyph/Icon";

export type SimpleType = "any" | "boolean" | "number" | "string" | "object" | "array";

const all = {};

export class DataType {

    simpleType: SimpleType;
    parser: (value: any) => any;
    serializer: (value: any) => any;
    formatter: (value: any, enumerate: Map) => string;
    name: string;
    single: boolean;
    description: string;
    /** Ikony poszczególnych pozycji enumeraty wyświetlane w trybie inline*/
    enumIcons: ?Object = null;
    enumStyles: ?Object = null;

    enumerate: ?[] = null; // np.: [['tekst',{wartość}],['tekst2',{wartość2}],...]

    units: ?[] = null; // [klucz, nazwa, mnożnik]

    constructor(config: (dt: DataType) => void, single: boolean = true) {
        Check.isFunction(config);
        config(this);
        this.single = single;

        if (single) {
            if (all[this.name]) throw new Error("Typ danych " + Utils.escape(this.name) + " już istnieje");
            all[this.name] = this;
        }

        //  name: string, simpleType: SimpleType, parser: (value: any) => any)
        Check.isFunction(this.parser);
        Check.instanceOf(this.simpleType, ["any", "boolean", "number", "string", "object", "array"]);
    }

    get isList(): boolean {
        return this instanceof ListDataType;
    }

    get isMultiple(): boolean {
        return this instanceof MultipleDataType;
    }

    /** Formatuje dane enumeraty z mapy, obiektu lub tablicy do postaci funkcji zwrotnej */
    static getMap(source: any): () => Map {
        if (!source) return null;

        return () => {
            if (If.func(source))
                source = source();

            if (source instanceof Map)
                return source;

            const map = new Map();
            Utils.forEach(source, (v, k) => map.set(k, v));
            return map;
        };
    }

    /** Zwraca wartość wyświetlaną */
    formatDisplayValue(value: any, enumerate: ?Map): string {

        enumerate = enumerate || this.enumerate;

        if (enumerate) enumerate = DataType.getMap(enumerate)();

        if (this.formatter)
            return this.formatter(value, enumerate);

        return Utils.toString(Utils.coalesce(enumerate ? enumerate.get(value) : null, value));
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


export function get (name: string): DataType {

    let result: DataType = all[name];
    if (result)
        return result;

    if (name.endsWith("[]"))
        return new ListDataType(get(name.substring(0, name.length - 2).trim()));

    if (name.startsWith("{") && name.endsWith("}"))
        return new MapDataType(get(name.substring(1, name.length - 1).trim()));


    if (name.startsWith("(") && name.endsWith(")")) {
        const names = name.substring(1, name.length - 1).split(",");
        return new MultipleDataType(names.map(name => get(name.trim())));
    }

    throw new Error("Nieznany typ danych " + Utils.escape(name));
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
            };
            dt.formatter = (val, map) => Utils.forEach(val, v => this.type.formatDisplayValue(v, map)).join(", ");

        }, false);
        this.type = Check.instanceOf(type, [DataType]);
    }

}

export class MapDataType extends DataType {

    type: DataType;
    types: DataType[];

    constructor(type: DataType) {
        super((dt: DataType) => {
            dt.name = "{" + type.name + "}";
            dt.simpleType = "object";
            dt.parser = value => {
                Check.isObject(value);
                const result: Map = new Map();
                Utils.forEach(value, (val, key) => {
                    if (value instanceof Array) {
                        key = val instanceof Array ? val[0] : null;
                        val = val instanceof Array ? val[1] : null;
                    }

                    result.set(Utils.toString(key).trim(), this.type.parse(val));
                });
                return result;
            };
            dt.formatter = (val: Map) => Utils.forEach(val, (v, k) => Utils.toString(k) + ": " + this.type.formatDisplayValue(v)).join(",\n");

        }, false);

        this.type = type;
        this.types = [STRING, type];
    }

}

export class MultipleDataType extends DataType {

    types: DataType[];

    constructor(types: DataType[]) {
        super((dt: DataType) => {
            dt.name = "(" + types.map(c => c.name).join(", ") + ")";
            dt.simpleType = "array";
            dt.parser = value => {
                // debugger;
                return value;
            }
        }, false);
        this.types = types;
    }
}


function parseNumber(value: any, parsed: number) {
    if (value instanceof Array || isNaN(value) || isNaN(parsed))
        throw new Error('Nieprawidłowa wartość numeryczna: ' + Utils.escape(value));
    return parsed;
}

export const ANY: DataType = new DataType((dt: DataType) => {
    dt.name = "any";
    dt.simpleType = "any";
    dt.parser = val => val;
    dt.formatter = val => Utils.escape(val);
});

export const JSON: DataType = new DataType((dt: DataType) => {
    dt.name = "json";
    dt.simpleType = "any";
    dt.parser = val => val;
    dt.formatter = val => Utils.escape(val);
});

export const BOOLEAN: DataType = new DataType((dt: DataType) => {
    dt.name = "boolean";
    dt.simpleType = "boolean";
    dt.parser = val => {
        return !!val;
    };
    dt.formatter = (value: boolean) => value ? "Tak" : "Nie";
    dt.enumIcons = {
        true: Icon.CHECK,
        false: Icon.TIMES,
    }
});

export const STRING: DataType = new DataType((dt: DataType) => {
    dt.name = "string";
    dt.simpleType = "string";
    dt.parser = val => "" + val;
});

export const CHAR: DataType = new DataType((dt: DataType) => {
    dt.name = "char";
    dt.simpleType = "string";
    dt.parser = val => val ? Utils.toString(val)[0] : val;
});


export const UUID: DataType = new DataType((dt: DataType) => {
    dt.name = "uid";
    dt.simpleType = "string";
    dt.parser = val => {
        if (!If.string(val) || !val.match("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"))
            throw new Error(Utils.escape(val) + " nie jest prawidłowym identyfikatorem UUID");
        return val;
    }
});

export const GUID: DataType = new DataType((dt: DataType) => {
    dt.name = "guid";
    dt.simpleType = UUID.simpleType;
    dt.parser = UUID.parser;
});

export const REGEX: DataType = new DataType((dt: DataType) => {
    dt.name = "regex";
    dt.simpleType = "string";
    dt.parser = val => val;
});

export const FILE_NAME: DataType = new DataType((dt: DataType) => {
    dt.name = "fileName";
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

export const EMAIL: DataType = new DataType((dt: DataType) => {
    dt.name = "email";
    dt.simpleType = "email";
    dt.description = "Adres e-mail";
    //ToDo: walidacja emaila
    dt.parser = val => {
        return val;
    };
});

export const IMAGE: DataType = new DataType((dt: DataType) => {
    dt.name = "image";
    dt.simpleType = "string";
    dt.description = "Obrazek";
    dt.parser = val => {
        return val;
    };
});

export const PHONE: DataType = new DataType((dt: DataType) => {
    dt.name = "phone";
    dt.simpleType = "string";
    dt.description = "Numer telefonu";
    dt.parser = val => {
        return val;
    };
});


export const ICON: DataType = new DataType((dt: DataType) => {
    dt.name = "icon";
    dt.simpleType = "string";
    dt.description = "Ikona"; //FontAwesome
    dt.parser = val => {
        return val;
    };
    dt.enumerate = {};
    dt.enumIcons = {};

    Icon.ALL.forEach((icon: Icon) => {
        dt.enumIcons[icon.name] = icon;
        dt.enumerate[icon.name] = icon.name;
    });


    dt.enumIcons = {
        true: Icon.CHECK,
        false: Icon.TIMES,
    }


});


export const DATA_TYPE: DataType = new DataType((dt: DataType) => {
    dt.name = "dataType";
    dt.simpleType = "string";
    dt.description = "Typ danych";
    dt.enumerate = () => {
        const map = new Map();
        Utils.forEach(all, (d: DataType) => map.set(d.name, d.name));
        return map;
    };
    dt.parser = val => {
        return val;
    };
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
    dt.simpleType = "number";
    dt.parser = val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość daty');
        return date;
    };
    dt.formatter = (val: Date) => val.toLocaleString();
    dt.serializer = (val: Date) => val.getTime();
});

export const TIME: DataType = new DataType((dt: DataType) => {
    dt.name = "time";
    dt.simpleType = "number";
    dt.parser = val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość czasu');
        return date;
    }
});

export const TIMESTAMP: DataType = new DataType((dt: DataType) => {
    dt.name = "timestamp";
    dt.simpleType = "number";
    dt.parser = val => {
        const date = new Date(val);
        if (isNaN(date))
            throw new Error('Nieprawidłowa wartość czasu');
        return date;
    };
    dt.formatter = (val: Date) => val.toLocaleString();
    dt.serializer = (val: Date) => val.getTime();
});

// upływ czasu (milisekundy)
export const DURATION: DataType = new DataType((dt: DataType) => {
    dt.name = "duration";
    dt.simpleType = "number";
    dt.parser = val => {
        //ToDo: dopisać
        return val;
    };
    dt.formatter = (val: number) => Utils.formatUnits(val, {
        h: 1000 * 60 * 60,
        m: 1000 * 60,
        s: 1000,
        ms: 0
    });

    dt.units = [
        ["ms", "ms", 1],
        ["s", "s", 1000],
        ["m", "m", 1000 * 60],
        ["h", "h", 1000 * 60 * 60],
        ["d", "d", 1000 * 60 * 60 * 24]
    ];
});

/** Jedna wartość z enumeraty */
export const ENUM: DataType = new DataType((dt: DataType) => {
    dt.name = "enum";
    dt.simpleType = "string";
    dt.parser = val => {
        return val;
    };
    dt.formatter = (val, map) => frmt(val, map);
});

/** Wiele wartości z enumeraty*/
export const ENUMS: DataType = new DataType((dt: DataType) => {
    dt.name = "enums";
    dt.simpleType = "array";
    dt.parser = val => {
        // debugger;
        return val;
    };
    dt.serializer = val => {
        //   debugger;
        return val;
    };

    dt.formatter = (val, map) => frmt(val, map);
});

function frmt(value: any, map: ?Map): string {
    value = map ? map.get(value) : value;
    const val: string = Utils.escape(Utils.toString(value)) || "";
    return val.substring(1, val.length - 1);
}

export const TEXT_CASING = {
    NONE: null,
    UPPERCASE: 'uppercase',
    LOWERCASE: 'lowercase',
    CAPITALIZE: 'capitalize'
};