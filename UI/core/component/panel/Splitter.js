// @flow
'use strict';
import {React, PropTypes, Utils} from "../../core.js";
import {Component, Scrollbar} from "../../components.js";
import * as Is from "../../utils/Is";


/*
    do rozszerzania zmniejszania np dwóch paneli między sobą

 */
export class Splitter extends Component {

    static propTypes = {
        horizontal: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string
    };

    _drag = null;
    _startPos = {x: 0, y: 0};
    _childes = [];
    _children: [] = [];

    constructor() {
        super(...arguments);
        this._moveListener = (e) => this._changeSizes(e);
        this._upListener = (e) => {
            this._drag = null;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
        window.addEventListener('mousemove', this._moveListener);
        window.addEventListener('mouseup', this._upListener);
    }


    componentWillUnmount() {
        super.componentWillUnmount(...arguments);
        window.removeEventListener('mousemove', this._moveListener);
        window.removeEventListener('mouseup', this._upListener);
    }

    _mouseDown(e: MouseEvent) {
        document.body.style.userSelect = 'none';
        document.body.style.cursor = e.currentTarget.style.cursor;
        this._drag = e.currentTarget;
        this._startPos = {x: e.pageX, y: e.pageY};
    }

    _getNumber(val: string): number {
        if (!val) return null;
        if (val.contains('%'))
            return Number(val.slice(0, -1));
        else if (val.contains('px'))
            return Number(val.slice(0, -2));
        return Number(val);
    }

    _initSizes(): [] {
        let percents = 100;
        let sum = 0;
        let sorted = Utils.forEach(this._children, (child, i) => {
            return [i, child.props.size]
        });
        sorted.sort((a, b) => {
            if (a[1] === b[1]) return 0;
            if (!a[1]) return 1;
            if (!b[1]) return -1;
            return this._getNumber(b[1]) - this._getNumber(a[1]);
        });
        let res = [];
        Utils.forEach(sorted, (child, i) => {
            if (child[1]) {
                let tmp = this._getNumber(child[1]);
                percents -= tmp;
                sum += tmp;
            } else {
                let r = Utils.round(percents / (this._children.length - i));
                percents -= r;
                sum += r;
                if ((sum + percents) !== 100)
                    r += Utils.round(100 - (sum + percents));
                child[1] = r + '%';
            }
            res[child[0]] = child[1];
        });
        return res;
    }

    split() {
        const base = this._initSizes();

        this._childes = [];

        Utils.forEach(this._children, (child, i) => {
            if (child.type === SplitPanel)
                child = React.cloneElement(child, {
                    horizontal: this.props.horizontal,
                    key: i,
                    splitHandle: i < this._children.length - 1,
                    size: base[i],
                    onMouseDown: (e) => this._mouseDown(e, i),
                    ...child.props
                }, child.props.children);
            else
                child = <SplitPanel key={i}
                                    horizontal={this.props.horizontal}
                                    size={base[i]}
                                    splitHandle={i < this._children.length - 1}
                                    onMouseDown={(e) => this._mouseDown(e, i)}
                >{child}</SplitPanel>;
            this._childes.push(child);
        });

        return this._childes;
    }

    _changeSizes(e: MouseEvent) {
        if (!this._drag) return;
        const horizontal = this.props.horizontal;
        let diff = parseInt(horizontal ? (e.pageY - this._startPos.y) : (e.pageX - this._startPos.x));
        if (diff !== 0) {
            const ps = this._drag.parentElement;
            const ns = this._drag.parentElement.nextSibling;
            let max = (horizontal ? this._drag.parentElement.parentElement.offsetHeight : this._drag.parentElement.parentElement.offsetWidth) / 100;
            let prev = (horizontal ? ps.offsetHeight : ps.offsetWidth) + diff;
            let next = (horizontal ? ns.offsetHeight : ns.offsetWidth) - diff;

            const org = Number(horizontal ? ps.style.height.slice(0, -1) : ps.style.width.slice(0, -1)) + Number(horizontal ? ns.style.height.slice(0, -1) : ns.style.width.slice(0, -1));
            if (parseInt(prev) > 10 && parseInt(next) > 10) {
                prev = Math.round((prev / max) * 100);
                next = Math.round((next / max) * 100);
                next += ((org * 100) - (prev + next));
                prev /= 100;
                next /= 100;
                if (horizontal) {
                    ps.style.height = prev + '%';
                    ns.style.height = next + '%';
                }
                else {
                    ps.style.width = prev + '%';
                    ns.style.width = next + '%';
                }
                this._startPos.y = e.pageY;
                this._startPos.x = e.pageX;
            }
        }
    }

    render() {

        this._children = [];

        // spłaszczenie struktury komponentów potomnych (wyciągnięcie elementów z tablic na zewnątrz)
        Utils.forEach(this.props.children, c => {
            if (!c) return;
            if (Is.array(c)) {
                Utils.forEach(c, d => d ? this._children.push(d) : undefined);
                return;
            }
            this._children.push(c);
        });


        let childes = null;
        if (this._children.length < 2)
            childes = this._children;
        else
            childes = this.split();
        let style = this.props.style || {width: '100%', height: '100%'};
        return <div
            className={"c-splitter" + (this.props.className ? " " + this.props.className : "")}
            style={{
                ...style
            }}>{childes}</div>;
    }
}

export class SplitPanel extends Component {

    static propTypes = {
        horizontal: PropTypes.bool,
        onMouseDown: PropTypes.func,
        splitHandle: PropTypes.bool,

        size: PropTypes.string,
    };

    render() {
        let style = {
            position: 'relative',
            width: this.props.horizontal ? '100%' : this.props.size,
            height: this.props.horizontal ? this.props.size : '100%',
            display: this.props.horizontal ? 'block' : 'inline-block',
            verticalAlign: this.props.horizontal ? null : 'top',
        };

        if (!style.width.contains("%"))
            style.width = style.width + "%";
        if (!style.height.contains("%"))
            style.height = style.height + "%";

        let contentStyle = {
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            display: this.props.horizontal ? 'block' : 'inline-block',
            verticalAlign: this.props.horizontal ? null : 'top'
        };

        return <div style={style}>
            <div style={contentStyle}>
                <Scrollbar/>
                <Scrollbar horizontal/>
                {this.props.children}</div>
            {this.props.splitHandle ?
                <SplitterHandle
                    horizontal={this.props.horizontal}
                    onMouseDown={this.props.onMouseDown}/> : null}
        </div>
    }
}

class SplitterHandle extends Component {

    static propTypes = {
        horizontal: PropTypes.bool
    };

    render() {
        let style = {
            position: 'absolute',
            zIndex: 10,
        };
        if (this.props.horizontal) {
            style.display = 'block';
            style.width = '100%';
            style.height = '14px';
            style.cursor = 'row-resize';
            style.bottom = '-8px';
        } else {
            style.display = 'inline-block';
            style.verticalAlign = 'top';
            style.width = '14px';
            style.height = '100%';
            style.cursor = 'col-resize';
            style.right = '-8px';
        }
        return <div className={"c-splitter-handle" + (this.props.horizontal ? "-horizontal" : "")}
                    style={style}
                    onMouseDown={(e) => this.props.onMouseDown(e)}/>;
    }
}
