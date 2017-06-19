import * as Check from "../utils/Check";
import Repository from "./Repository";
import Record from "./Record";
import * as Utils from "../utils/Utils";
export type SimpleType = "any" | "boolean" | "number" | "string" | "object" | "array";

export default class DataType {

    simpleType: SimpleType;
    parser: (value: any) => any;
    name: string;
    enumerate: ?[] = null; // np.: [['tekst',{wartość}],['tekst2',{wartość2}],...]
    /** Wybór wielu wartości enumeraty */
    multiple: boolean = false;
    /** Wiele wierszy - możliwość dodawania / usuwania */
    list: boolean = false;
    units: ?Map<string, string> = null;

    constructor(name: string, simpleType: SimpleType, parser: (value: any) => any) {
        this.name = name;
        this.parser = Check.isFunction(parser);
        this.simpleType = Check.instanceOf(simpleType, ["any", "boolean", "number", "string", "object", "array"]);
    }

    getDisplayValue(value: any) {
        return "" + value;
    }

    clone(): DataType {
        const result = new this.constructor(this.name, this.simpleType, this.parser);
        Utils.clone(this, result);
        return result;
    }

    parse(value: ?any): any {
        return value === null || value === undefined ? value : this.parser(value);
    }

    /** @private */
    setEnumerate(enumerate: [], multiple: boolean = false): DataType {
        this.enumerate = enumerate;
        this.multiple = multiple;
        return this;
    }

    /** @private */
    setUnits(units: Map<string, String>): DataType {
        this.units = units;
        return this;
    }

    static BOOLEAN = new DataType("boolean", "boolean", val => {
        return val ? true : false;
    });

    static STRING = new DataType("string", "string", val => "" + val);


    static UUID = new DataType("string", "string", val => {
        if (!val.match("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"))
            throw new Error(JSON.stringify(val) + " nie jest prawidłowym identyfikatorem UUID");
        return val;
    });

    static PASSWORD = new DataType("password", "string", val => "" + val);

    // textarea
    static MEMO = new DataType("memo", "string", val => "" + val);

    // problem parseInt("10abc"), parseInt([]);
    static INT = new DataType("int", "number", val => parseNumber(val, parseInt(Number(val))));

    static LENGTH = new DataType("length", "number", val => parseNumber(val, parseInt(Number(val)))); // rozmiar danych w bajtach

    static DOUBLE = new DataType("double", "number", val => parseNumber(val, parseFloat(Number(val))));

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

    static MAP = new DataType("map", "object", val => {
        return Check.isObject(val);
    });

    static LIST = new DataType("list", "array", val => {
        return Check.isArray(val);
    });

    //--------------------- CellsDataType ---------------------

    //static BOOL_STRING = new CellsDataType("boolStr", [DataType.BOOLEAN, DataType.STRING], val => val);
}


export class CellsDataType extends DataType {

    cells: DataType[];

    constructor(name: string, cells: DataType[], parser: (value: any) => any) {
        super(name, "array", parser);
        this.cells = cells;
    }

}

export class ForeignDataType extends DataType {

    repo: Repository;

    constructor(repo: Repository | string, list: boolean = false, multiple: boolean = false) {
        Check.instanceOf(repo, ["string", Repository]);
        repo = repo instanceof Repository ? repo : Repository.getF(repo);

        super(list ? "list" : repo.primaryKeyDataType.name,
            list ? "array" : repo.primaryKeyDataType.simpleType,
            repo.primaryKeyDataType.parser);
        this.multiple = multiple;
        this.list = list;
        this.repo = repo instanceof Repository ? repo : Repository.getF(repo);
    }

    clone(): ForeignDataType {
        const result = new this.constructor(this.repo, this.list, this.multiple);
        Utils.clone(this, result);
        return result;
    }

}


function parseNumber(value: any, parsed: number) {
    if (value instanceof Array || isNaN(value) || isNaN(parsed))
        throw new Error('Nieprawidłowa wartość numeryczna: ' + JSON.stringify(value));
    return parsed;
}