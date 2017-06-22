import {React, PropTypes, Field} from "../core";
import {FormComponent} from "../components";

export default class EditText extends FormComponent {

    props: {
        onChange: ?(value: String, src: EditText) => void,
        /** dodatkowe propsy dla głównego elementu */
            props: ?object
    };

    static propTypes = {
        value: PropTypes.string,
        field: PropTypes.instanceOf(Field).isRequired,
        onChange: PropTypes.func,
        props: PropTypes.object
    };

    constructor() {
        super(...arguments);
    }


    render() {
        return (
            <span {...this.props.props} style={{display: 'flex'}}>
                {this._fieldCtrlInfo}
                <input
                    className="form-control"
                    style={{textTransform: (this.field.textCasing || null), flexGrow: 1}}
                    onChange={e => this._handleChange(false, e, e.target.value)}
                    onKeyPress={e => {
                        if (e.charCode === 13)
                            this._handleChange(true, e, e.target.value)
                    }}
                    onBlur={e => this._handleChange(true, e, e.target.value)}
                    defaultValue={this.field.value}
                />
                {this._fieldCtrlErr}
            </span>);
    }
}