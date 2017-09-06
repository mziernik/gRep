import {
    React,
    ReactUtils,
    PropTypes,
    ReactDOM,
    Record,
    Repository,
    Field,
    Utils,
    Is,
    CRUDE,
    Endpoint,
    AppStatus
} from "../core"
import {Component, Spinner, Alert, Dynamic, Icon} from "../components"


export class Btn extends Dynamic {

    key: string;
    title: string;
    text: string;
    type: string;
    crude: CRUDE;
    style: Object;

    /** Wariant okna modalnego - czy ma być zamknięte po kliknięciu */
    modalClose: Boolean = true;

    confirm: string;
    onClick: (e) => any;
    link: Endpoint;
    icon: Icon;
    focus: boolean; //ustawia focus na guziku. Nie działa gdy element jest niewidoczny

    constructor(config: Btn | (button: Btn) => void) {
        super(null, () => this.render());
        if (Is.func(config))
            config(this);
        this._key = this.key;
    }

    _disabled: boolean;

    set disabled(state: boolean) {
        this._disabled = state;
        this.update();
    }

    render() {

        let type = this.type;
        if (!type && this.crude)
            switch (this.crude) {
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
            key={this.key}
            ref={elem => this._tag = elem}
            style={this.style}
            className={"btn " + (type ? "btn-" + type : "") + " c-button"}
            disabled={this._disabled}
            title={this.title}
            onClick={(e) => {
                if (this._disabled) return;
                if (this.confirm && Is.func(this.onClick))
                    Alert.confirm(this, this.confirm, () => this.onClick(e));
                else Is.func(this.onClick, f => f(e));

                if (this.link instanceof Endpoint)
                    (this.link: Endpoint).navigate(null, e);

                if (typeof this.link === "string")
                    Endpoint.navigate(this.link, e);
            }}

        >
            {
                this.icon ?
                    <span className={"c-button-icon " + this.icon}/> : null}
            {this.text}</button>
    }

}

export default class Button extends Component {

    static propTypes = {
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
        confirm: PropTypes.string,
        type: PropTypes.oneOf(["basic", "default", "primary", "success", "info", "warning", "danger", "link"]),
        title: PropTypes.string,
        onClick: PropTypes.func,
        link: PropTypes.any,
        icon: PropTypes.any,
        disabled: PropTypes.bool,
        focus: PropTypes.bool, //ustawia focus na guziku. Nie działa gdy element jest niewidoczny
        style: PropTypes.object
    };
    _tag: HTMLButtonElement;
    state: {
        disabled: boolean
    };

    constructor() {
        super(...arguments);
        this.state = {
            disabled: this.props.disabled
        };
    }

    componentDidMount() {
        if (!this._tag) return;
        if (!this.props.focus) return;
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
            style={this.props.style}
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
                    <span className={"c-button-icon " + this.props.icon}/> : null}
            {this.children.render()}</button>
    }
}  //