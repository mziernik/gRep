import {React, PropTypes} from "../core";
import {Component, Resizer, Scrollbar, Splitter} from "../components"

export default class Panel extends Component {

    static propTypes = {
        type: PropTypes.oneOf(["raised", "lowered"]),
        style: PropTypes.object,
        vertical: PropTypes.bool,
        scrollable: PropTypes.bool,
        border: PropTypes.bool,
        noPadding: PropTypes.bool,
        resizable: PropTypes.bool,
        split: PropTypes.bool,
        fit: PropTypes.bool, // dopasuj do rodzica
        // krawędzie resizera
        north: PropTypes.bool,
        east: PropTypes.bool,
        west: PropTypes.bool,
        south: PropTypes.bool
    };

    static defaultProps = {
        resizable: false,
        scrollable: false,
        split: false,
        north: false,
        east: false,
        west: false,
        south: false
    };

    //
    render() {
        let size = this.props.fit || this.props.resizable || this.props.scrollable ? '100%' : null;
        let panel = null;
        if (this.props.split)
            panel = <Splitter horizontal={this.props.vertical}
                              style={{
                                  width: size,
                                  height: size,
                                  outline: '1px solid #444'
                              }}>
                {super.renderChildren()}
            </Splitter>;
        else
            panel = <div
                className="c-panel-child"
                data-fit={!!this.props.fit}
                data-vertical={!!this.props.vertical}
                style={{
                    display: "flex",
                    flexDirection: this.props.vertical ? "row" : "column",
                    width: size,
                    height: size,
                    padding: this.props.noPadding ? null : "8px",
                    border: this.props.border && !this.props.resizable && !this.props.scrollable ? "1px solid #444" : null,
                }}>
                {this.props.scrollable || this.props.resizable ? <Scrollbar/> : null}
                {this.props.scrollable || this.props.resizable ? <Scrollbar horizontal/> : null}
                {super.renderChildren()}
            </div>;

        if (this.props.scrollable || this.props.resizable)
            return <Resizer
                className="c-panel"
                resizable={this.props.resizable}
                north={this.props.north}
                east={this.props.east}
                west={this.props.west}
                south={this.props.south}
                style={{
                    flex: '1',
                    height: this.props.fit ? "100%" : null,
                    width: this.props.fit ? "100%" : null,
                    overflow: this.props.scrollable ? "hidden" : undefined,
                    border: this.props.border ? "1px solid #444" : null,
                    ...this.props.style
                }}
                outerProps={{
                    title: this.props.title
                }}>
                {panel}
            </Resizer>;
        return panel;
    }
}