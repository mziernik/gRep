/**
 * Promise z możliwością wykonania z zewnątrz funkcji resolve i reject
 * oraz z możliwością weryfikacji czy funkcje catch oraz then są obsłużone
 */

import Utils from "./utils/Utils";
export default class PromiseEx extends Promise {

    hasCatch: boolean = false;
    hasThen: boolean = false;

    resolve: () => void;
    reject: () => void;

    constructor(callback: ?(resolve: () => void, reject: () => void) => void) {
        let _resolve = null;
        let _reject = null;
        super((resolve, reject) => {
            _resolve = resolve;
            _reject = reject;
            if (Utils.isFunction(callback))
                callback(resolve, reject)
        });
        this.resolve = _resolve;
        this.reject = _reject;


    }

    catch(callback: () => void) {
        this.hasCatch = callback !== undefined && callback !== null;
        return super.catch(...arguments);
    }

    then(callback: () => void) {
        this.hasThen = callback !== undefined && callback !== null;
        return super.then(...arguments);
    }
}
