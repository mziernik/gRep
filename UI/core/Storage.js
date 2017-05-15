export default class Storage {

    /**
     * Wczytaj wartość zapamiętaną w Storage. Rezultatem jest wartość, obiekt lub tablica
     * @param {type} name
     * @returns {undefined|Array|Object}
     */
    static getLocal(name: string): ?any {
        return decode(window.localStorage.getItem(name));
    };

    /**
     * Zapamiętaj wartość w local storage powiązaną z danym kontrolerem - wartością jest dowolny obiekt
     * @param {type} name
     * @param {type} value
     * @returns {undefined}
     */
    static setLocal(name: string, value: ?any, encode: boolean = false) {
        value = JSON.stringify(value);
        window.localStorage.setItem(name, encode ? "#" + window.btoa(value) : value);
    };


    static removeLocal(name: string) {
        window.localStorage.removeItem(name);
    }


    /**
     * Wczytaj wartość zapamiętaną w SessionStorage. Rezultatem jest wartość, obiekt lub tablica
     * @param {type} name
     * @returns {undefined|Array|Object}
     */
    static getSession(name: string): ?any {
        return decode(window.sessionStorage.getItem(name));
    };

    /**
     * Zapamiętaj wartość w session storage powiązaną z danym kontrolerem - wartością jest dowolny obiekt
     * @param {type} name
     * @param {type} value
     * @returns {undefined}
     */
    static setSession(name: string, value: ?any, encode: boolean = false) {
        value = JSON.stringify(value);
        window.sessionStorage.setItem(name, encode ? "#" + window.btoa(value) : value);
    };


    static removeSession(name: string): void {
        window.sessionStorage.removeItem(name);
    }

}

function decode(value: string): ?any {
    try {
        if (value && value.length > 1 && value.indexOf("#") === 0)
            value = window.atob(value.substring(1));
        return value ? JSON.parse(value) : undefined;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}