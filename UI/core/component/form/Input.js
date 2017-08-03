// @flow
'use strict';
import {React, PropTypes, Utils} from '../../core.js';
import {FormComponent} from '../../components.js';

export default class Input extends FormComponent {

    static propTypes = {
        //   field: PropTypes.instanceOf(Field).isRequired,
        /** propsy dla <input> */
        inputProps: PropTypes.object,
        /** czy podgląd */
        preview: PropTypes.bool,
        /** select z jednostkami */
        units: PropTypes.element
    };

    render() {
        if (!this.field) return null;

        if (this.props.preview)
            return <span title={this.field.name}>{this.field.displayValue}</span>;
        //
        return (
            <div className="c-input" style={{display: 'flex'}}>
                <input
                    ref={elem => {
                        if (!elem) return;
                        const value = this.field.units ? this.field.unitValue : this.field.simpleValue;
                        if (elem.value !== value)
                            elem.value = value;
                    }}
                    title={this.field.hint}
                    {...this.props.inputProps}
                    placeholder={this.field.name}
                    disabled={this.field.readOnly}
                    style={{
                        textTransform: this.field.config.textCasing,
                        width: this.props.units ? '10px' : this.props.inputProps && this.props.inputProps.type === "number" ? "80px" : null,
                    }}
                    onChange={e => {
                        this._changed = true;
                        this._handleChange(false, e, e.target.value);
                    }}
                    onKeyPress={e => {
                        if (e.charCode === 13)
                            this._handleChange(true, e, e.target.value);
                    }}
                    onBlur={e => {
                        if (this._changed) this._handleChange(true, e, e.target.value);
                    }}
                />
                {this.props.units}
            </div>
        )
    }
}