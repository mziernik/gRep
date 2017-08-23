import * as Utils from "../utils/Utils";

export class Crude {
    title: string;
    name: string;
    char: string;

    constructor(char: string, name: string, title: string) {
        this.char = char;
        this.name = name;
        this.title = title;
        Object.preventExtensions(this);
    }


    isSet(state: any) {

        if (typeof(state) === "boolean")
            return state;

        switch (("" + state).trim().toLowerCase()) {
            case true:
                return true;
            case false:
                return false;

            case "new":
            case "create":
            case "c":
                return this === CREATE;

            case "edit":
            case "update":
            case "u":
                return this === UPDATE;

            case "all":
            case "any":
                return true;
        }
        return false;
    }
}

export const CREATE: Crude = new Crude("C", "create", "Tworzenie");
export const READ: Crude = new Crude("R", "read", "Odczyt");
export const UPDATE: Crude = new Crude("U", "update", "Modyfikacja");
export const DELETE: Crude = new Crude("D", "delete", "Usunięcie");
export const EXECUTE: Crude = new Crude("E", "execute", "Wykonanie");

export const ALL: Crude[] = [CREATE, READ, UPDATE, DELETE, EXECUTE];


export function parse(crude: string): Crude[] {
    crude = Utils.toString(crude).toUpperCase();
    return Utils.forEach(ALL, (c: Crude) => crude.indexOf(c.char) !== -1 ? c : undefined);
}