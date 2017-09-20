//@Flow
'use strict';
import {React, AppEvent, PropTypes} from '../core.js';
import {Component} from '../components.js';

export default class Resizer extends Component {

    static propTypes = {
        fromCenter: PropTypes.bool,
        north: PropTypes.bool,
        east: PropTypes.bool,
        west: PropTypes.bool,
        south: PropTypes.bool,
        resizable: PropTypes.bool,
        noDefaultLimits: PropTypes.bool,
        outerProps: PropTypes.object,
        className: PropTypes.string,
    };

    static defaultProps = {
        fromCenter: false,
        north: false,
        east: false,
        west: false,
        south: false,
        resizable: true,
        noDefaultLimits: false
    };

    /** określa czy skalowanie odbywa się przez przeciąganie krawędzi
     * @type {boolean}
     * @private
     */
    _borders: boolean = false;
    /** przechowuje informacje o kierunku skalowania. Wymagane gdy _borders===true
     * @type {null}
     * @private
     */
    _direction: ?string = null;

    constructor() {
        super(...arguments);
        this.resizeEvent = (e) => this.props.fromCenter ? this._doCenterResize(e) : this._doResize(e);
        this._borders = this.props.north || this.props.east || this.props.west || this.props.south;
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
     * @param cursor wygląd kursora
     * @param direction określa kierunek skalowania
     * @private
     */
    _startResize(e: MouseEvent, cursor: ?string = null, direction: ?string = null) {
        this._resize = e.currentTarget.parentElement;
        this._start = {x: e.pageX, y: e.pageY};
        this._computeLimits(this._resize);
        this._direction = direction;

        document.body.style.userSelect = 'none';
        document.body.style.cursor = cursor || '';
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
            let nw = this._resize.offsetWidth;
            let nh = this._resize.offsetHeight;

            if (this._borders) {
                switch (this._direction) {
                    case 'east':
                        nw += diff.x * 2;
                        break;
                    case 'west':
                        nw -= diff.x * 2;
                        break;
                    case 'north':
                        nh -= diff.y * 2;
                        break;
                    case 'south':
                        nh += diff.y * 2;
                        break;
                }
            } else {
                nw += diff.x * 2;
                nh += diff.y * 2;
            }

            if (!this._direction || this._direction === 'east' || this._direction === 'west')
                if (nw < this._limits.max.x && nw > this._limits.min.x && (!this._borders || this.props.east || this.props.west)) {
                    this._resize.style.width = nw + 'px';
                    this._resize.style.left = (this._resize.offsetLeft - (this._direction === 'west' ? (-diff.x) : diff.x)) + 'px';
                    this._start.x = e.pageX;
                }

            if (!this._direction || this._direction === 'north' || this._direction === 'south')
                if (nh < this._limits.max.y && nh > this._limits.min.y && (!this._borders || this.props.north || this.props.south)) {
                    this._resize.style.height = nh + 'px';
                    this._resize.style.top = (this._resize.offsetTop - (this._direction === 'north' ? (-diff.y) : diff.y)) + 'px';
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
            let nw = this._resize.offsetWidth;
            let nh = this._resize.offsetHeight;
            if (this._borders) {
                switch (this._direction) {
                    case 'east':
                        nw += diff.x;
                        break;
                    case 'west':
                        nw -= diff.x;
                        break;
                    case 'north':
                        nh -= diff.y;
                        break;
                    case 'south':
                        nh += diff.y;
                        break;
                }
            } else {
                nw += diff.x;
                nh += diff.y;
            }

            if (nw < this._limits.max.x && nw > this._limits.min.x && (!this._borders || this.props.east || this.props.west)) {
                this._resize.style.width = nw + 'px';
                this._start.x = e.pageX;
            }
            if (nh < this._limits.max.y && nh > this._limits.min.y && (!this._borders || this.props.north || this.props.south)) {
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
        document.body.style.cursor = '';
        AppEvent.RESIZE.send(this, {event: e});
    }

    /** Rysuje odpowiednie uchwyty do skalowania elementu
     * @returns {Array}
     */
    renderGrabbers() {
        let style = {position: 'absolute', zIndex: '2'};
        let res = [];
        if (this.props.east)
            res.push(<div
                className="c-splitter-handle"
                key="east"
                style={{
                    ...style,
                    right: '-8px',
                    top: '0',
                    width: '14px',
                    height: '100%',
                    cursor: 'col-resize'
                }}
                onMouseDown={(e) => this._startResize(e, 'col-resize', 'east')}
            />);
        if (this.props.west)
            res.push(<div
                className="c-splitter-handle"
                key="west"
                style={{
                    ...style,
                    left: '-8px',
                    top: '0',
                    width: '14px',
                    height: '100%',
                    cursor: 'col-resize'
                }}
                onMouseDown={(e) => this._startResize(e, 'col-resize', 'west')}
            />);
        if (this.props.north)
            res.push(<div
                className="c-splitter-handle-horizontal"
                key="north"
                style={{
                    ...style,
                    top: '-8px',
                    left: '0',
                    height: '14px',
                    width: '100%',
                    cursor: 'row-resize'
                }}
                onMouseDown={(e) => this._startResize(e, 'row-resize', 'north')}
            />);
        if (this.props.south)
            res.push(<div
                className="c-splitter-handle-horizontal"
                key="south"
                style={{
                    ...style,
                    bottom: '-8px',
                    left: '0',
                    height: '14px',
                    width: '100%',
                    cursor: 'row-resize'
                }}
                onMouseDown={(e) => this._startResize(e, 'row-resize', 'south')}
            />);
        if (res.length === 0)
            res.push(<div
                key="grabber"
                className="c-resizer-grabber"
                style={{
                    zIndex: 2,
                    position: 'absolute',
                    width: '0',
                    height: '0',
                    right: '2px',
                    bottom: '2px',
                    cursor: 'se-resize'
                }}
                onMouseDown={(e) => this._startResize(e, 'se-resize')}
            />);
        return res;
    }

    //FixMe className
    render() {
        return (
            <div
                //     className="c-resizer"
                className={"c-resizer" + (this.props.className ? " " + this.props.className : "")}
                style={{
                    position: this.props.from ? 'fixed' : 'relative',
                    ...this.props.style,
                    flex: this.props.resizable ? '' : this.props.style.flex,
                }}
                {...this.props.outerProps}
            >
                {super.renderChildren()}
                {this.props.resizable ?
                    this.renderGrabbers() : null}

            </div>);
    }
}
