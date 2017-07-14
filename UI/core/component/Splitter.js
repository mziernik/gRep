// @flow
'use strict';
import {React, PropTypes, Utils} from "../core.js";
import {Component} from "../components.js";

//ToDo przeliczanie rozmiaru dla size
//ToDo obsługa isStatic

export class Splitter extends Component {

    static propTypes = {
        horizontal: PropTypes.bool,
        style: PropTypes.object
    };

    _drag = null;
    _startPos = {x: 0, y: 0};
    _childes = [];

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

    split() {
        const panels = this.props.children.length;
        const base = Utils.round(100 / panels);
        const err = base + Utils.round(100 - Utils.round(base * panels));

        this._childes = [];
        const props = {
            horizontal: this.props.horizontal,
            size: base + '%',
            onMouseDown: (e) => {
                document.body.style.userSelect = 'none';
                document.body.style.cursor = e.currentTarget.style.cursor;
                this._drag = e.currentTarget;
                this._startPos = {x: e.pageX, y: e.pageY};
            }
        };

        Utils.forEach(this.props.children, (child, i) => {
            child = child.type === SplitPanel ? React.cloneElement(child, {
                ...props,
                key: i,
                splitHandle: i !== 0,
                size: child.props.size || i === 0 ? err + '%' : props.size
            }, child.props.children)
                : <SplitPanel key={i} {...props}
                              size={i === 0 ? err + '%' : props.size}
                              splitHandle={i !== 0}>{child}</SplitPanel>;
            this._childes.push(child);
        });

        return this._childes;
    }

    _changeSizes(e: MouseEvent) {
        if (!this._drag)return;
        const horizontal = this.props.horizontal;
        let diff = parseInt(horizontal ? (e.pageY - this._startPos.y) : (e.pageX - this._startPos.x));
        if (diff !== 0) {
            const ps = this._drag.parentElement.previousSibling;
            const ns = this._drag.parentElement;
            let max = (horizontal ? this._drag.parentElement.parentElement.offsetHeight : this._drag.parentElement.parentElement.offsetWidth) / 100;
            let prev = (horizontal ? ps.offsetHeight : ps.offsetWidth) + diff;
            let next = (horizontal ? ns.offsetHeight : ns.offsetWidth) - diff;

            //ToDo wielkość może mieć końcówkę px
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
        let childes = null;
        if (this.props.children.length < 2)
            childes = this.props.children;
        else
            childes = this.split();
        let style = this.props.style || {width: '100%', height: '100%'};
        return <div style={{
            ...style
        }}>{childes}</div>;
    }
}

export class SplitPanel extends Component {

    static propTypes = {
        horizontal: PropTypes.bool,
        onMouseDown: PropTypes.func,
        splitHandle: PropTypes.bool,

        isStatic: PropTypes.bool,
        size: PropTypes.string
    };

    render() {
        let style = {
            position: 'relative',
            width: this.props.horizontal ? '100%' : this.props.size,
            height: this.props.horizontal ? this.props.size : '100%',
            display: this.props.horizontal ? 'block' : 'inline-block',
            verticalAlign: this.props.horizontal ? null : 'top'
        };

        let contentStyle = {
            overflow: 'hidden',
            //width: this.props.splitHandle && !this.props.horizontal ? 'calc(100% - 4px)' : '100%',
            //height: this.props.splitHandle && this.props.horizontal ? 'calc(100% - 4px)' : '100%',
            width: '100%',
            height: '100%',
            display: this.props.horizontal ? 'block' : 'inline-block',
            verticalAlign: this.props.horizontal ? null : 'top'
        };

        return <div style={style}>{this.props.splitHandle ?
            <SplitterHandle
                horizontal={this.props.horizontal}
                onMouseDown={this.props.onMouseDown}/> : null}
            <div style={contentStyle}>{this.props.children}</div>
        </div>
    }
}

class SplitterHandle extends Component {

    static propTypes = {
        horizontal: PropTypes.bool
    };

    render() {
        let style = {
            background: 'none',
            position: 'absolute',
        };
        if (this.props.horizontal) {
            style.display = 'block';
            style.width = '100%';
            style.height = '14px';
            style.cursor = 'row-resize';
            style.top = '-8px';
        } else {
            style.display = 'inline-block';
            style.verticalAlign = 'top';
            style.width = '14px';
            style.height = '100%';
            style.cursor = 'col-resize';
            style.left = '-8px';
        }
        return <div style={style}
                    onMouseDown={(e) => this.props.onMouseDown(e)}
        />;
    }
}
