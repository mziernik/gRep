import {React, PropTypes} from "../core"
import {Component} from "../components"

export default class Button extends Component {

    static propTypes = {
        action: PropTypes.oneOf(["create", "read", "update", "delete", "execute"]),
        type: PropTypes.oneOf(["basic", "default", "primary", "success", "info", "warning", "danger", "link"]),
        title: PropTypes.string,
        onClick: PropTypes.func.isRequired,
    };

    render() {
        return super.create("button", {
            onClick: this.props.onClick,
            className: "btn btn-" + this.props.type,
            title: this.props.title,
            style: {
                boxSizing: "border-box",
                fontSize: "16px",
                padding: "6px 12px",
                marginRight: "10px",
                marginTop: "10px",
                cursor: "pointer",
                border: "1px solid #444"
            }
        });
    }


}