import Debug from "./Debug";

export default class Store {

    static local = new Store(window.localStorage);
    static session = new Store(window.sessionStorage);

    _base: any;

    constructor(base: any) {
        this._base = base;
    }


    /**
     * Wczytaj wartość zapamiętaną w Storage. Rezultatem jest wartość, obiekt lub tablica
     * @param {type} name
     * @returns {undefined|Array|Object}
     */
    get(name: string): ?any {
        let value = this._base.getItem(name)
        try {
            if (value && value.length > 1 && value.indexOf("#") === 0)
                value = window.atob(value.substring(1));
            return value ? JSON.parse(value) : undefined;
        } catch (e) {
            Debug.error(this, e);
            return undefined;
        }
    };

    /**
     * Zapamiętaj wartość w local storage powiązaną z danym kontrolerem - wartością jest dowolny obiekt
     * @param {type} name
     * @param {type} value
     * @returns {undefined}
     */
    set(name: string, value: ?any, encode: boolean = false) {
        if (value === undefined) return;
        value = JSON.stringify(value);
        this._base.setItem(name, encode ? "#" + window.btoa(value) : value);
    };


    remove(name: string) {
        this._base.removeItem(name);
    }

}

