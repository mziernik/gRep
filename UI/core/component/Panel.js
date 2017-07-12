import {React, PropTypes} from "../core";
import {Component, Resizer} from "../components"


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

    //ToDo: Przemek
    render() {
        return <Resizer
            className="c-panel"
            resizable={this.props.resizable}
            style={{
                boxSizing: "border-box",

                height: this.props.fit ? "100%" : null,
                width: this.props.fit ? "100%" : null,
                overflow: this.props.scrollable ? "auto" : undefined,
                padding: this.props.noPadding ? null : "8px",
                // fontSize: "16px",
                // padding: "6px 12px",
                // marginRight: "10px",
                // marginTop: "10px",
                // cursor: "pointer",
                border: this.props.border ? "1px solid #444" : null,
                ...this.props.style
            }}
            outerProps={{
                title: this.props.title
            }}>
            <div
                className={"c-panel"}
                data-fit={!!this.props.fit}
                data-vertical={!!this.props.vertical}
                style={{
                    overflow: this.props.scrollable || this.props.resizable ? "auto" : null,
                    display: "flex",
                    flexDirection: this.props.vertical ? "row" : "column",
                    width: '100%',
                    height: '100%',
                }}>
                {super.renderChildren()}
            </div>
        </Resizer>
    }
}