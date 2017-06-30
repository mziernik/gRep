import {React, PropTypes, Record, Repository, Field, Utils, If, CRUDE, Endpoint, AppStatus} from "../core"
import {Component, Spinner, Alert} from "../components"

export default class Button extends Component {

    state: {
        disabled: boolean
    };


    static  propTypes = {
        confirm: PropTypes.string,
        type: PropTypes.oneOf(["basic", "default", "primary", "success", "info", "warning", "danger", "link"]),
        title: PropTypes.string,
        onClick: PropTypes.func,
        link: PropTypes.any,
        icon: PropTypes.any
    };

    constructor() {
        super(...arguments);
        this.state = {
            disabled: false
        };

    }

    render() {

        let type = this.props.type;
        if (!type && this.props.crude)
            switch (this.props.crude) {
                case CRUDE.CREATE:
                case CRUDE.UPDATE:
                    type = "success";
                    break;
                case CRUDE.DELETE:
                    type = "danger";
                    break;
                case CRUDE.EXECUTE:
                    type = "primary";
                    break;
            }


        return <button
            className={"btn " + (type ? "btn-" + type : "")}
            disabled={this.state.disabled}
            style={ {
                boxSizing: "border-box",
                fontSize: "11pt",
                padding: "6px 12px",
                marginRight: "10px",
                marginTop: "10px",
                cursor: this.state.disabled ? "not-allowed" : "pointer",
                border: "1px solid #444"
            }}
            title={this.props.title}
            onClick={(e) => {
                if (!If.isFunction(this.props.onClick)) return;
                if (this.props.confirm)
                    Alert.confirm(this, this.props.confirm, () => this.props.onClick(e));
                else
                    this.props.onClick(e);
            }}

        >
            {this.props.icon ?
                <span className={this.props.icon} style={{
                    marginRight: "7px",
                    fontSize: "1.4em",
                    opacity: "0.8"

                }}/> : null}
            {super.renderChildren(this.props.children)}</button>
    }
}