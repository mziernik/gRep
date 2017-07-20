// @flow
'use strict';
import {React, ReactDOM, AppEvent, Trigger, PropTypes, Utils} from "../core.js";
import {Component} from "../components.js";

export class Scrollbar extends Component {
    _resizeTrigger: Trigger = new Trigger();

    /** element do którego jest dodany scrollbar
     * @type {null}
     * @private
     */
    _parent: ?Element = null;

    /** uchwyt scrollbara
     * @type {null}
     * @private
     */
    _bar: ?HTMLDivElement = null;

    /** aktualnie przeciągany element (właściwie to samo co _bar)
     * @type {null}
     * @private
     */
    _drag: ?HTMLDivElement = null;

    /* obsługa zdarzeń */
    _wheelListener = (e: WheelEvent) => this._scroll(e);
    _enterListener = (e: MouseEvent) => this._bar.style.opacity = '1';
    _leaveListener = (e: MouseEvent) => this._bar.style.opacity = '0';
    _moveListener = (e: MouseEvent) => this.mouseMove(e);
    _upListener = (e: MouseEvent) => {
        this._drag = null;
        document.body.style.userSelect = '';
    };


    constructor() {
        super(...arguments);
        window.addEventListener('mousemove', this._moveListener);
        window.addEventListener('mouseup', this._upListener);
        AppEvent.RESIZE.listen(this, () => this._resizeTrigger.call(() => this._setBar(), 100));

    }

    componentDidMount() {
        super.componentDidMount(...arguments);
        this._parent = ReactDOM.findDOMNode(this).parentElement;
        if (!this._parent) return;
        this._parent.style.overflow = 'hidden';
        this._parent.addEventListener('wheel', this._wheelListener, {passive: true});
        this._parent.addEventListener('mouseenter', this._enterListener);
        this._parent.addEventListener('mouseleave', this._leaveListener);
        this._setBar();
    }

    componentWillUnmount() {
        super.componentWillUnmount(...arguments);
        window.removeEventListener('mousemove', this._moveListener);
        window.removeEventListener('mouseup', this._upListener);
        if (this._parent) {
            this._parent.removeEventListener('wheel', this._wheelListener);
            this._parent.removeEventListener('mouseenter', this._enterListener);
            this._parent.removeEventListener('mouseleave', this._leaveListener);
        }
    }

    /** obsługa scrolla myszy
     * @param e
     * @private
     */
    _scroll(e: WheelEvent) {
        this._parent.scrollTop += (e.deltaY > 0 ? 50 : e.deltaY < 0 ? -50 : 0);
        this._parent.scrollLeft += (e.deltaX > 0 ? 50 : e.deltaX < 0 ? -50 : 0);
        this._setBar();
    }

    /** określenie pozycji scrolla względem treści
     * @private
     */
    _setBar() {
        if (!this._bar || !this._parent) return;

        if (this.props.horizontal) {
            if (this._parent.scrollWidth <= this._parent.offsetWidth) {
                this._bar.parentElement.style.visibility = 'hidden';
            } else {
                this._bar.style.width = (this._parent.offsetWidth * (this._parent.offsetWidth / this._parent.scrollWidth)) + 'px';
                const hstep = (this._bar.parentElement.offsetWidth - this._bar.offsetWidth) / (this._parent.scrollWidth - this._parent.offsetWidth);
                this._bar.style.left = (this._parent.scrollLeft * hstep) + 'px';
                this._bar.parentElement.style.visibility = '';
            }
        } else {
            if (this._parent.scrollHeight <= this._parent.offsetHeight) {
                this._bar.parentElement.style.visibility = 'hidden';
            } else {
                this._bar.style.height = (this._parent.offsetHeight * (this._parent.offsetHeight / this._parent.scrollHeight)) + 'px';
                const vstep = (this._bar.parentElement.offsetHeight - this._bar.offsetHeight) / (this._parent.scrollHeight - this._parent.offsetHeight);
                this._bar.style.top = (this._parent.scrollTop * vstep) + 'px';
                this._bar.parentElement.style.visibility = '';
            }
        }
    }

    /** określenie pozycji treści względem scrolla
     * @private
     */
    _setScroll() {
        if (!this._bar || !this._parent) return;

        if (this.props.horizontal) {
            this._bar.style.width = (this._parent.offsetWidth * (this._parent.offsetWidth / this._parent.scrollWidth)) + 'px';
            const hstep = (this._bar.parentElement.offsetWidth - this._bar.offsetWidth) / (this._parent.scrollWidth - this._parent.offsetWidth);
            this._parent.scrollLeft = this._bar.offsetLeft / hstep;
        } else {
            this._bar.style.height = (this._parent.offsetHeight * (this._parent.offsetHeight / this._parent.scrollHeight)) + 'px';
            const vstep = (this._bar.parentElement.offsetHeight - this._bar.offsetHeight) / (this._parent.scrollHeight - this._parent.offsetHeight);
            this._parent.scrollTop = this._bar.offsetTop / vstep;
        }
    }

    mouseMove(e: MouseEvent) {
        if (!this._drag) return;
        let diff = {x: e.pageX - this._start.x, y: e.pageY - this._start.y};
        //pion
        if (diff.y !== 0 && !this.props.horizontal) {
            let ny = this._drag.offsetTop + diff.y;
            if (ny < 0) ny = 0;
            if (ny > (this._drag.parentElement.offsetHeight - this._drag.offsetHeight))
                ny = (this._drag.parentElement.offsetHeight - this._drag.offsetHeight);
            this._drag.style.top = ny + 'px';
            this._start.y = e.pageY;
            this._setScroll();
        }
        //poziom
        if (diff.x !== 0 && this.props.horizontal) {
            let nx = this._drag.offsetLeft + diff.x;
            if (nx < 0) nx = 0;
            if (nx > (this._drag.parentElement.offsetWidth - this._drag.offsetWidth))
                nx = (this._drag.parentElement.offsetWidth - this._drag.offsetWidth);
            this._drag.style.left = nx + 'px';
            this._start.x = e.pageX;
            this._setScroll();
        }
    }

    _startDrag(e: MouseEvent) {
        e.stopPropagation();
        document.body.style.userSelect = 'none';
        this._start = {x: e.pageX, y: e.pageY};
        this._drag = e.currentTarget;
    }

    render() {
        //poziom
        if (this.props.horizontal)
            return <div
                className="c-scrollbar"
                style={{
                    padding: '2px 0',
                    position: 'absolute',
                    height: '14px',
                    bottom: '0',
                    left: '14px',
                    right: '14px'
                }}>
                <div ref={elem => this._bar = elem}
                     className="c-scrollbar-bar"
                     style={{
                         position: 'relative',
                         height: '100%'
                     }}
                     onMouseDown={(e) => this._startDrag(e)}
                />
            </div>;

        //pion
        return <div
            className="c-scrollbar"
            style={{
                padding: '0 2px',
                position: 'absolute',
                width: '14px',
                right: '0',
                top: '14px',
                bottom: '14px'
            }}>
            <div ref={elem => this._bar = elem}
                 className="c-scrollbar-bar"
                 style={{
                     position: 'relative',
                     width: '100%'
                 }}
                 onMouseDown={(e) => this._startDrag(e)}
            />
        </div>
    }
}