import * as Utils from "../utils/Utils";

export default class Action {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    static CREATE = new Action("Utworzono");
    static UPDATE = new Action("Zaktualizowano");
    static DELETE = new Action("Usunięto");
}

Utils.makeFinal(Action);