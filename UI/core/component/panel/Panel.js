import {React, ReactDOM, PropTypes, Is} from "../../core";
import {Component, Resizer, Scrollbar, Splitter, Dynamic} from "../../components"
import Icon from "../glyph/Icon";

/*
    panel grupujący kontrolki
    możemy zobaczyć, może mieć obramowanie, suwak itp
 */

export default class Panel extends Component {
    /** panel w drzewie DOM
     * @type {null}
     * @private
     */
    _panel = null;
    /** ostatnia wysokość panelu
     * @type {string}
     * @private
     */
    _panelHeight: string = 'initial';
    /** czy zwinięty
     * @type {boolean}
     * @private
     */
    _isFolded: boolean = true;

    name: Dynamic<string> = new Dynamic(null, v => <span className="c-panel-titlebar-title">{v}</span>);
    icon: Dynamic<string> = new Dynamic(null, v => v ? <span className={"c-panel-titlebar-icon " + v}/> : null);

    static propTypes = {
        type: PropTypes.oneOf(["raised", "lowered"]),
        style: PropTypes.object,
        vertical: PropTypes.bool,
        scrollable: PropTypes.bool,
        border: PropTypes.bool,
        noPadding: PropTypes.bool,
        resizable: PropTypes.bool,
        foldable: PropTypes.bool,
        folded: PropTypes.bool,
        split: PropTypes.bool,
        fit: PropTypes.bool, // dopasuj do rodzica
        // krawędzie resizera
        north: PropTypes.bool,
        east: PropTypes.bool,
        west: PropTypes.bool,
        south: PropTypes.bool,

        name: PropTypes.node,
        icon: PropTypes.string,
        className: PropTypes.string,
    };

    static defaultProps = {
        resizable: false,
        scrollable: null,
        foldable: false,
        folded: false,
        split: false,
        north: false,
        east: false,
        west: false,
        south: false
    };

    constructor() {
        super(...arguments);
        this._isFolded = this.props.folded;
        this.name.set(this.props.name);
        this.icon.set(this.props.icon);
    }

    /** zmienia wysokość panelu
     * @param panel panel w drzewie DOM
     * @private
     */
    _setSize(panel) {
        if (!panel && !this._panel) return;
        if (panel) this._panel = panel;
        else
            this._panel.style.height = this._isFolded ? 'initial' : this._panelHeight;
    }

    /** zwija lub rozwija panel
     * @param folded czy ma zostać zwinięty. null neguje ostatni stan zwinięcia
     */
    fold(folded: boolean = null) {
        if (!Is.defined(folded)) folded = !this._isFolded;
        if (folded === this._isFolded) return;
        this._isFolded = folded;
        if (this._panel && folded)
            this._panelHeight = this._panel.style.height;
        this.forceUpdate(true);
    }

    /** zwraca belkę z tytułem, ikoną i opcją zwijania
     * @returns {*}
     */
    renderTitleBar() {
        if (!this.props.foldable) return null;
        return <div className="c-panel-titlebar"
                    onClick={e => {
                        e.stopPropagation();
                        this.fold();
                    }}>
            {this.icon.$}
            {this.name.$}
            <span className={"c-panel-titlebar-button " + (this._isFolded ? Icon.PLUS : Icon.MINUS)}/>
        </div>
    }

    //
    render() {
        const scrollable = Is.defined(this.props.scrollable) ? this.props.scrollable : this.props.resizable;

        const className = this.props.className ? " " + this.props.className : "";

        const resizer = this.props.resizable || this.props.scrollable || this.props.foldable;
        let size = this.props.fit || resizer ? '100%' : null;
        let panel = null;
        const panelBorder = this.props.border && !resizer;
        if (this.props.split)
            panel = <Splitter
                horizontal={this.props.vertical}
                style={{
                    width: size,
                    height: size,
                    // outline: '1px solid #444'
                }}>
                {super.renderChildren()}
            </Splitter>;
        else {
            let style = null;
            if (!resizer)
                style = this.props.style;
            panel = <div
                className={"c-panel-child" + className}
                data-fit={!!this.props.fit}
                data-vertical={!!this.props.vertical}
                style={{
                    display: "flex",
                    flexDirection: this.props.vertical ? "row" : "column",
                    width: size,
                    height: size,
                    padding: this.props.noPadding ? null : "8px",
                    border: panelBorder ? "1px solid #444" : null,
                    flex: this.props.foldable ? '1' : null,
                    ...style
                }}>
                {scrollable ? <Scrollbar/> : null}
                {scrollable ? <Scrollbar horizontal/> : null}
                {super.renderChildren()}
            </div>;
        }

        if (resizer)
            return <Resizer
                ref={elem => this._setSize(ReactDOM.findDOMNode(elem))}
                className={"c-panel" + className}
                resizable={this.props.resizable}
                north={this.props.north}
                east={this.props.east}
                west={this.props.west}
                south={this.props.south}
                style={{
                    flex: '1',
                    display: this.props.foldable ? 'flex' : null,
                    flexDirection: this.props.foldable ? 'column' : null,
                    height: this.props.fit ? "100%" : null,
                    width: this.props.fit ? "100%" : null,
                    overflow: this.props.foldable ? "" : "hidden",
                    border: this.props.border ? "1px solid #444" : null,
                    ...this.props.style
                }}
                outerProps={{
                    title: this.props.title
                }}>
                {this.renderTitleBar()}
                {this._isFolded ? null : panel}
            </Resizer>;
        return panel;
    }
}