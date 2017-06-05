import {React, PropTypes, Component} from "../components"


//ToDo: Resize
export default class Panel extends Component {

    static propTypes = {
        action: PropTypes.oneOf(["create", "read", "update", "delete", "execute"]),
        type: PropTypes.oneOf(["raised", "lowered"]),
        style: PropTypes.object
    };

    render() {
        return super.create("div", {
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