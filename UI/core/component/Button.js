import {React, PropTypes, Record, Repository, Field, Utils, If, CRUDE, Endpoint, AppStatus} from "../core"
import {Component, Spinner, Alert} from "../components"

export default class Button extends Component {

    state: {
        disabled: boolean
    };


    static  propTypes = {
        crude: PropTypes.any, //CRUDE
        record: PropTypes.any, //Record
        confirm: PropTypes.string,
        type: PropTypes.oneOf(["basic", "default", "primary", "success", "info", "warning", "danger", "link"]),
        title: PropTypes.string,
        onClick: PropTypes.func,
        link: PropTypes.any
    };

    constructor() {
        super(...arguments);
        this.state = {
            disabled: !!this.props.crude
        };


        this.state.disabled = false; // tymczasowo

        if (this.props.crude && this.props.record)
            (this.props.record: Record).fieldChanged.listen(this, (field: Field) => {
                let ok = true;
                this.props.record.fields.forEach((field: Field) => {
                    if (!field.isValid)
                        ok = false;
                });
                this.setState({disabled: !ok});
            });
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
                If.isFunction(this.props.onClick, f => f(e));

                if (this.props.record instanceof Record) {

                    this.props.record._action = this.props.crude;

                    const run = () => {
                        this.setState({disabled: true});

                        const spinner = new Spinner();

                        Repository.submit(this, [this.props.record])
                            .then((e) => {
                                spinner.hide();
                                AppStatus.success(this, "Zaktualizowano dane");
                            }).catch((e) => {
                            spinner.hide();
                        });
                    };

                    if (this.props.confirm)
                        Alert.confirm(this, this.props.confirm, () => run());
                    else run();

                }
            }}

        >{super.renderChildren(this.props.children)}</button>
    }
}