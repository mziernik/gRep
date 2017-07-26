import {React, PropTypes, ReactDOM, Record, Repository, Field, Utils, Is, CRUDE, Endpoint, AppStatus} from "../core"
import {Component, Spinner, Alert} from "../components"


export default class Button extends Component {

    state: {
        disabled: boolean
    };


    static  propTypes = {
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
        confirm: PropTypes.string,
        type: PropTypes.oneOf(["basic", "default", "primary", "success", "info", "warning", "danger", "link"]),
        title: PropTypes.string,
        onClick: PropTypes.func,
        link: PropTypes.any,
        icon: PropTypes.any,
        disabled: PropTypes.bool,
        focus: PropTypes.bool //ustawia focus na guziku. Nie działa gdy element jest niewidoczny
    };

    constructor() {
        super(...arguments);
        this.state = {
            disabled: this.props.disabled
        };
    }

    componentDidMount() {
        if (!this._tag)return;
        if (!this.props.focus)return;
        this._tag.focus();
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
            ref={elem => this._tag = elem}
            className={"btn " + (type ? "btn-" + type : "") + " c-button"}
            disabled={this.state.disabled}
            title={this.props.title}
            onClick={(e) => {
                if (this.state.disabled) return;
                if (this.props.confirm && Is.func(this.props.onClick))
                    Alert.confirm(this, this.props.confirm, () => this.props.onClick(e));
                else Is.func(this.props.onClick, f => f(e));

                if (this.props.link instanceof Endpoint)
                    (this.props.link: Endpoint).navigate(null, e);

                if (typeof this.props.link === "string")
                    Endpoint.navigate(this.props.link, e);
            }}

        >
            {
                this.props.icon ?
                <span className={"c-button-icon " + this.props.icon} /> : null}
            {this.children.render()}</button>
    }
}  //