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
}

export const CREATE: Crude = new Crude("C", "create", "Tworzenie");
export const READ: Crude = new Crude("R", "read", "Odczyt");
export const UPDATE: Crude = new Crude("U", "update", "Modyfikacja");
export const DELETE: Crude = new Crude("D", "delete", "Usunięcie");
export const EXECUTE: Crude = new Crude("E", "execute", "Wykonanie");