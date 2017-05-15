import Utils from "../core/utils/Utils";



export default class Functionality {

    id: string;
    available: boolean;
    code: string;
    name: string;

    constructor(data: Object) {
        if (!Utils.isObject(data))
            return;
        this.id = data.Id;
        this.code = data.Code;
        this.name = data.Name;
        this.available = data.Available;
    }
}