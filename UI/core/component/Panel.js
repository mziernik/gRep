import {React, PropTypes} from "../core";
import {Component} from "../components"


//ToDo: Resize
export default class Panel extends Component {

    static propTypes = {
        type: PropTypes.oneOf(["raised", "lowered"]),
        style: PropTypes.object,
        vertical: PropTypes.bool,
        overflow: PropTypes.string,
        border: PropTypes.bool,
        noPadding: PropTypes.bool,
        fit: PropTypes.bool, // dopasuj do rodzica
    };

    render() {
        return super.create("div", {
            onClick: this.props.onClick,
            title: this.props.title,
            style: {
                boxSizing: "border-box",
                display: "flex",
                flexDirection: this.props.vertical ? "row" : "column",
                overflow: this.props.overflow,
                padding: this.props.noPadding ? null : "8px",
                height: this.props.fit ? "100%" : null,
                width: this.props.fit ? "100%" : null,
                // fontSize: "16px",
                // padding: "6px 12px",
                // marginRight: "10px",
                // marginTop: "10px",
                // cursor: "pointer",
                border: this.props.border ? "1px solid #444" : null
            }
        })
            ;
    }


}