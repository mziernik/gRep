/** klasa budująca filtr */
import * as Is from "./Is";

export default class CustomFilter {
    static OPERATORS = {
        AND: 'i',
        OR: 'lub'
    };

    static CONDITIONS = {
        EQUAL: 'równe',
        NOT_EQUAL: 'różne od',
        BIGGER: 'większe od',
        SMALLER: 'mniejsze od'
    };

    operation: string = CustomFilter.OPERATORS.AND;
    type: string = CustomFilter.CONDITIONS.EQUAL;
    value: ?any; //wartość filtru
    negation: boolean = false; //negacja wyniku
    conditions: [] = []; //warunki [CustomFilter]

    /** konstruktor
     * @param value wartość do której ma być porównanie
     * @param type typ porównania CustomFilter.CONDITIONS
     * @param operation typ operacji (łączenia warunków) CustomFilter.OPERATORS
     * @param negation czy negacja warunku
     */
    constructor(value, type = null, operation = null, negation = false) {
        this.value = value;
        this.type = type || CustomFilter.CONDITIONS.EQUAL;
        this.operation = operation || CustomFilter.OPERATORS.AND;
        this.negation = negation;
    }

    /** dodaje n warunków
     * @param CustomFilter warunki
     * @returns {CustomFilter} this
     */
    addCondition([...CustomFilter]): CustomFilter {
        forEach(arguments, (arg) => this.conditions.push(arg));
        return this;
    }

    /** Tworzy warunek && (x > value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static andBigger(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.CONDITIONS.BIGGER, CustomFilter.OPERATORS.AND, negation);
    }

    /** Tworzy warunek || (x > value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static orBigger(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.CONDITIONS.BIGGER, CustomFilter.OPERATORS.OR, negation);
    }

    /** Tworzy warunek && (x < value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static andSmaller(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.CONDITIONS.SMALLER, CustomFilter.OPERATORS.AND, negation);
    }

    /** Tworzy warunek || (x < value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static orSmaller(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.CONDITIONS.SMALLER, CustomFilter.OPERATORS.OR, negation);
    }

    /** Tworzy warunek && (x === value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static andEqual(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.CONDITIONS.EQUAL, CustomFilter.OPERATORS.AND, negation);
    }

    /** Tworzy warunek || (x === value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja warunku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static orEqual(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.CONDITIONS.EQUAL, CustomFilter.OPERATORS.OR, negation);
    }

    /** Tworzy warunek && (x !== value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja wyniku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static andNotEqual(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.CONDITIONS.NOT_EQUAL, CustomFilter.OPERATORS.AND, negation);
    }

    /** Tworzy warunek || (x !== value).
     * @param value wartość do której ma być porównanie
     * @param negation czy negacja wyniku
     * @returns {CustomFilter} nowy obiekt CustomFilter
     */
    static orNotEqual(value, negation = false): CustomFilter {
        return new CustomFilter(value, CustomFilter.CONDITIONS.NOT_EQUAL, CustomFilter.OPERATORS.OR, negation);
    }

    /** wykonuje filtr
     * @param val wartość, która ma być sprawdzona
     * @param compareFn funkcja porównująca np.: (a,b)=>a-b;
     * @returns {boolean}
     */
    filter(val, compareFn: (a, b) => number): boolean {
        if (!compareFn) compareFn = CustomFilter.defaultCompareFn(typeof(val));
        if (!Is.func(compareFn)) throw new Error("Brak poprawnej funkcji 'compareFn'");

        let res = false;
        switch (this.type) {
            case CustomFilter.CONDITIONS.EQUAL:
                res = compareFn(val, this.value) === 0;
                break;
            case CustomFilter.CONDITIONS.NOT_EQUAL:
                res = compareFn(val, this.value) !== 0;
                break;
            case CustomFilter.CONDITIONS.SMALLER:
                res = compareFn(val, this.value) < 0;
                break;
            case CustomFilter.CONDITIONS.BIGGER:
                res = compareFn(val, this.value) > 0;
                break;
            default:
                res = compareFn(val, this.value) === 0;
                break;
        }

        forEach(this.conditions, (condition: CustomFilter) => {
            switch (condition.operation) {
                case CustomFilter.OPERATORS.AND:
                    res = res && condition.filter(val, compareFn);
                    break;
                case CustomFilter.OPERATORS.OR:
                    res = res || condition.filter(val, compareFn);
                    break;
                default:
                    break;
            }
        });
        return this.negation ? !res : res;
    }

    /** zwraca podstawową funkcję porównania dla danego typu prostego
     * @param type typ prosty string|number|boolean
     * @returns {*}
     */
    static defaultCompareFn(type: string): ?(a, b) => number {
        switch (type) {
            case 'number':
                return (a, b) => a - b;
            case 'boolean':
                return (a, b) => {
                    if (a === b) return 0;
                    if (a === null || a === undefined) return 1;
                    if (b === null || b === undefined) return -1;
                    return a ? -1 : 1;
                };
            case 'string':
                // ToDo obsługa polskich znaków
                return (a, b) => {
                    a = a ? a.toLowerCase() : a;
                    b = b ? b.toLowerCase() : b;
                    if (a === b) return 0;
                    if (a === null || a === undefined) return 1;
                    if (b === null || b === undefined) return -1;
                    if (a > b) return 1;
                    return -1;
                };
            default:
                return null;
        }
    }

    /** tekstowa reprezentacja zbudowanego warunku
     * @param x sprawdzana wartość. Tylko dla reprezentacji
     * @param cut czy obciąć dodatkowe warunki
     * @returns {string}
     */
    toString(x: string = '$x', cut: boolean = false): string {
        let res = x + ' ' + this.type + ' ' + this.value;
        if (!cut) {
            forEach(this.conditions, (condition: CustomFilter) => {
                const brackets = condition.conditions.length > 0;
                res = res + ' ' + condition.operation + (brackets ? ' (' : ' ') + condition.toString(x) + (brackets ? ')' : '')
            });
        }
        if (this.negation)
            res = '!(' + res + ')';
        return res;
    }
}
