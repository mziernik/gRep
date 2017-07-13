// @flow
'use strict';
import {React, PropTypes, Field, Utils} from '../../core.js';
import {FormComponent} from '../../components.js';

export default class Memo extends FormComponent {
    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
        preview: PropTypes.bool, // czy podgląd
        inline: PropTypes.bool, // czy w jednej linii
    };

    render() {
        if (!this.field) return null;

        if (this.props.preview) {
            const singleLineStyle = this.props.inline ? {overflow: "hidden", textOverflow: "ellipsis"} : null;

            return <span title={this.field.name} style={{display: 'flex'}}>
                <pre
                    style={{fontFamily: "inherit", flex: 'auto', ...singleLineStyle}}
                    disabled={true}
                >{super.renderChildren(this.field.simpleValue, false)}</pre>
            </span>;
        }

        //
        return (
            <span className="c-memo" style={{display: 'flex'}}>
                <textarea
                    key={Utils.randomId()}
                    title={this.field.hint}
                    placeholder={this.field.name}
                    name={this.field.key}
                    disabled={this.field.readOnly}
                    style={{
                        textTransform: this.field.config.textCasing,
                        flex: 'auto',
                    }}
                    onChange={e => {
                        this._changed = true;
                        this._handleChange(false, e, e.target.value);
                    }}
                    onBlur={e => {
                        if (this._changed) this._handleChange(true, e, e.target.value);
                    }}
                    defaultValue={this.field.simpleValue}
                />
            </span>);
    }
}