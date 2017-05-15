import Functionality from "./Functionality";
import Utils from "../core/utils/Utils";


export default class User {

    static current: User = new User();

    id: string;
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    functionalities: Functionality[] = [];


    fill(data: Object) {
        if (!Utils.isObject(data.Result)) return;

        data = data.Result;

        this.id = data.Id;
        this.login = data.Login;
        this.firstName = data.FirstName;
        this.lastName = data.LastName;
        this.email = data.EMail;

        Utils.forEach(data.AvailableFunctionalities, data =>
            this.functionalities.push(new Functionality(data))
        );
    }
}
