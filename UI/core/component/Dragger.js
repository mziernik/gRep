//@Flow
'use strict';

/** klasa do przeciągani elementów. Przeciągany element powinien mieć position: absolute. Można używać statycznie.*/
export default class Dragger {
    /** instancja draggera
     * @type {null}
     */
    static INSTANCE: Dragger = null;
    /** aktualnie przesuwany element
     * @type {null}
     * @private
     */
    _target = null;
    /** pozycja myszy przed przesunięciem
     * @type {{x: number, y: number}}
     * @private
     */
    _startPos = {x: 0, y: 0};
    /** limity pozycji
     * @type {null}
     * @private
     */
    _limits = null;

    /** Domyślny konstruktor
     * @param limits czy pozycja ma być ograniczona do rozmiaru okna (def false)
     */
    constructor(limits: boolean = false) {
        this._limits = {
            max: {
                x: limits ? window.innerWidth : Infinity,
                y: limits ? window.innerHeight : Infinity,
            },
            min: {
                x: limits ? 0 : -Infinity,
                y: limits ? 0 : -Infinity
            }
        }
    }

    /** rozpoczyna przeciąganie elementu. Powinno być wywoływane przez mouseDown
     * @param e obiekt zdarzenia mousedown
     * @param target element, który m abyc przeciągany. Jeśli brak, to brany jest e.currentTarget
     * @param limits czy przeciąganie ma być ograniczone do rozmiaru okna (def false)
     */
    static dragStart(e: MouseEvent, target = null, limits: boolean = false) {
        if (!Dragger.INSTANCE)
            Dragger.INSTANCE = new Dragger(limits);
        Dragger.INSTANCE.dragStart(e, target);
    }

    /** rozpoczyna przeciąganie elementu. Powinno być wywoływane przez mouseDown
     * @param e obiekt zdarzenia mousedown
     * @param target element, który ma być przeciągany. Jeśli brak, to brany jest e. currenTarget
     */
    dragStart(e: MouseEvent, target = null) {
        if (!e)throw Error("Brak obiektu zdarzenia");
        this._target = target || e.currentTarget;
        if (!this._target)throw Error("Brak elementu do przeciągania");


        this._startPos.x = e.pageX;
        this._startPos.y = e.pageY;

        this.moveListener = (e) => this._dragMove(e);
        this.dropListener = (e) => this._dragStop(e);

        window.addEventListener('mousemove', this.moveListener, false);
        window.addEventListener('mouseup', this.dropListener, false);
        e.preventDefault();
        e.stopPropagation();
    }

    /** oblicza nową pozycję przeciąganego elementu
     * @param e obiekt zdarzenia mousemove
     * @private
     */
    _dragMove(e: MouseEvent) {
        if (!this._target) {
            this._dragStop(e);
            return;
        }
        e.preventDefault();
        let diff = {x: e.pageX - this._startPos.x, y: e.pageY - this._startPos.y};
        let nl = (this._target.offsetLeft + diff.x);
        let nt = (this._target.offsetTop + diff.y);
        //poziom
        if (nl >= this._limits.min.x && (nl + this._target.offsetWidth) <= this._limits.max.x) {
            this._target.style.left = nl + 'px';
            this._startPos.x = e.pageX;
        }
        //pion
        if (nt >= this._limits.min.y && (nt + this._target.offsetHeight) <= this._limits.max.y) {
            this._target.style.top = nt + 'px';
            this._startPos.y = e.pageY;
        }
    }

    /** zatrzymuje przeciąganie elementu i odpina zdarzenia
     * @param e obiekt zdarzenia mouseup
     * @private
     */
    _dragStop(e: MouseEvent) {
        this._target = null;
        window.removeEventListener('mousemove', this.moveListener, false);
        window.removeEventListener('mouseup', this.dropListener, false);
        e.preventDefault();
    }
}