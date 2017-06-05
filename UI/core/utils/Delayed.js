/**
 * Wywołanie funkcji z opóźnieniem (setTimeout) z agregacją
 * Działanie klasy analogiczne do frame limiter
 */

export default class Delayed {

    func: (...arg: ?any) => void;
    timeout: number = 0;

    _timeout: ?number = null;

    constructor(func: (...arg: ?any) => void, timeout: number = 0) {
        this.func = func;
        this.timeout = timeout;
    }

    cancel() {
        if (this._timeout) {
            window.clearTimeout(this._timeout);
            this._timeout = null;
        }
    }

    run(...arg: ?any) {
        this.cancel();
        this._timeout = window.setTimeout(() => {
            window.clearTimeout(this._timeout);
            this.func(...arg);
        }, this.timeout);
    }

    call(func: (...arg: ?any) => void, timeout: number = 0, ...arg: ?any) {
        this.cancel();
        this._timeout = window.setTimeout(() => {
            window.clearTimeout(this._timeout);
            func(...arg);
        }, timeout);
    }
}