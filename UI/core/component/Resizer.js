//@Flow
'use strict';
import {React, AppEvent, PropTypes} from '../core.js';
import {Component} from '../components.js';

export default class Resizer extends Component {

    static propTypes = {
        fromCenter: PropTypes.bool,
        resizable: PropTypes.bool,
        noDefaultLimits: PropTypes.bool,
        outerProps: PropTypes.object,
    };

    static defaultProps = {
        fromCenter: false,
        resizable: true,
        noDefaultLimits: false
    };

    constructor() {
        super(...arguments);
        this.resizeEvent = (e) => this.props.fromCenter ? this._doCenterResize(e) : this._doResize(e);
    }

    /** Oblicza limity wielkości okna na podstawie stylu
     * @param elem element z max/min
     * @private
     */
    _computeLimits(elem) {
        this._limits = {max: {x: Infinity, y: Infinity}, min: {x: 12, y: 12}};
        if (this.props.noDefaultLimits) return;

        //max
        if (elem.style.maxWidth.contains("%"))
            this._limits.max.x = window.innerWidth * (parseInt(elem.style.maxWidth) / 100);
        else
            this._limits.max.x = elem.style.maxWidth ? parseInt(elem.style.maxWidth) : window.innerWidth;
        if (elem.style.maxHeight.contains("%"))
            this._limits.max.y = window.innerHeight * (parseInt(elem.style.maxHeight) / 100);
        else
            this._limits.max.y = elem.style.maxHeight ? parseInt(elem.style.maxHeight) : window.innerHeight;

        //min
        if (elem.style.minWidth.contains("%"))
            this._limits.min.x = window.innerWidth * (parseInt(elem.style.minWidth) / 100);
        else
            this._limits.min.x = elem.style.minWidth ? parseInt(elem.style.minWidth) : 12;
        if (elem.style.minHeight.contains("%"))
            this._limits.min.y = window.innerHeight * (parseInt(elem.style.minHeight) / 100);
        else
            this._limits.min.y = elem.style.minHeight ? parseInt(elem.style.minHeight) : 12;

    }

    /** Inicjalizacja zmiany wielkości. Podpina zdarzenia i wylicza limity
     * @param e zdarzenie myszy
     * @private
     */
    _startResize(e: MouseEvent) {
        this._resize = e.currentTarget.parentElement;
        this._start = {x: e.pageX, y: e.pageY};
        this._computeLimits(this._resize);

        document.body.style.userSelect = 'none';
        window.addEventListener('mousemove', this.resizeEvent, false);
        window.addEventListener('mouseup', this.resizeEvent, false);

    }

    /** Zmiana wielkości od środka okna
     * @param e zdarzenie myszy
     * @private
     */
    _doCenterResize(e: MouseEvent) {
        if (e.type === 'mousemove') {
            const diff = {x: (e.pageX - this._start.x), y: (e.pageY - this._start.y)};
            let nw = (this._resize.offsetWidth + diff.x * 2);
            let nh = (this._resize.offsetHeight + diff.y * 2);

            if (nw < this._limits.max.x && nw > this._limits.min.x) {
                this._resize.style.width = nw + 'px';
                this._resize.style.left = (this._resize.offsetLeft - diff.x) + 'px';
                this._start.x = e.pageX;
            }

            if (nh < this._limits.max.y && nh > this._limits.min.y) {
                this._resize.style.height = nh + 'px';
                this._resize.style.top = (this._resize.offsetTop - diff.y) + 'px';
                this._start.y = e.pageY;
            }
        } else
            this._stopResize();

    }

    /** Zmiana wielkości od lewego górnego narożnika
     * @param e zdarzenie myszy
     * @private
     */
    _doResize(e: MouseEvent) {
        if (e.type === 'mousemove') {
            const diff = {x: (e.pageX - this._start.x), y: (e.pageY - this._start.y)};
            let nw = (this._resize.offsetWidth + diff.x);
            let nh = (this._resize.offsetHeight + diff.y);

            if (nw < this._limits.max.x && nw > this._limits.min.x) {
                this._resize.style.width = nw + 'px';
                this._start.x = e.pageX;
            }
            if (nh < this._limits.max.y && nh > this._limits.min.y) {
                this._resize.style.height = nh + 'px';
                this._start.y = e.pageY;
            }
        } else
            this._stopResize(e);
    }

    /** Kończy zmaiane wielkości. Odpina zdarzenia
     * @private
     */
    _stopResize(e: MouseEvent) {
        window.removeEventListener('mousemove', this.resizeEvent, false);
        window.removeEventListener('mouseup', this.resizeEvent, false);
        document.body.style.userSelect = '';
        AppEvent.RESIZE.send(this, e);
    }

    render() {
        //
        return (
            <div
                className="c-resizer"
                style={{
                    position: this.props.from ? 'fixed' : 'relative',

                    ...this.props.style
                }}
                {...this.props.outerProps}
            >
                {super.renderChildren()}
                {this.props.resizable ?
                    <div
                        className="c-resizer-content"
                        style={{
                            position: 'absolute',
                            width: '0',
                            height: '0',
                            right: '2px',
                            bottom: '2px'
                        }}
                        onMouseDown={(e) => this._startResize(e)}
                    /> : null}

            </div>);
    }
}
