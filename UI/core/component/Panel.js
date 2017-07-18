import {React, PropTypes} from "../core";
import {Component, Resizer} from "../components"
import {Scrollbar} from "./Scrollbar";


export default class Panel extends Component {

    static propTypes = {
        type: PropTypes.oneOf(["raised", "lowered"]),
        style: PropTypes.object,
        vertical: PropTypes.bool,
        scrollable: PropTypes.bool,
        border: PropTypes.bool,
        noPadding: PropTypes.bool,
        resizable: PropTypes.bool,
        fit: PropTypes.bool, // dopasuj do rodzica
    };

    static defaultProps = {
        resizable: false,
        scrollable: false
    };

    //
    render() {
        return <Resizer
            className="c-panel"
            resizable={this.props.resizable}
            style={{
                height: this.props.fit ? "100%" : null,
                width: this.props.fit ? "100%" : null,
                overflow: this.props.scrollable ? "hidden" : undefined,
                padding: this.props.noPadding ? null : "8px",
                border: this.props.border ? "1px solid #444" : null,
                ...this.props.style
            }}
            outerProps={{
                title: this.props.title
            }}>
            <div
                className="c-panel-child"
                data-fit={!!this.props.fit}
                data-vertical={!!this.props.vertical}
                style={{
                    display: "flex",
                    flexDirection: this.props.vertical ? "row" : "column",
                    width: '100%',
                    height: '100%',
                }}>
                {this.props.scrollable || this.props.resizable ? <Scrollbar/> : null}
                {this.props.scrollable || this.props.resizable ? <Scrollbar horizontal/> : null}
                {super.renderChildren()}
            </div>
        </Resizer>
    }
}