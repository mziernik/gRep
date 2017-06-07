import {React, PropTypes, Record, Repository, Utils, If, CRUDE} from "../core"
import {Component} from "../components"

export default class Button extends Component {

    static propTypes = {
        crude: PropTypes.instanceOf(CRUDE),
        record: PropTypes.any,
        confirm: PropTypes.string,
        type: PropTypes.oneOf(["basic", "default", "primary", "success", "info", "warning", "danger", "link"]),
        title: PropTypes.string,
        onClick: PropTypes.func.isRequired,
    };

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
            style={ {
                boxSizing: "border-box",
                fontSize: "16px",
                padding: "6px 12px",
                marginRight: "10px",
                marginTop: "10px",
                cursor: "pointer",
                border: "1px solid #444"
            }}
            title={this.props.title}
            onClick={(e) => {
                If.isFunction(this.props.onClick, f => f(e));


                if (this.props.record instanceof Record) {

                    Repository.submit(this, [this.props.record]);


                }

            }}

        >{this.props.children}</button>


    }


}