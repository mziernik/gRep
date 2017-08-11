import * as Utils from "../utils/Utils";

export default class Action {
    static CREATE = new Action("Utworzono");
    static UPDATE = new Action("Zaktualizowano");
    static DELETE = new Action("Usunięto");
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

Utils.makeFinal(Action);