// @flow
'use strict';
import {React, PropTypes, Field} from '../../core';
import {FormComponent, Icon} from '../../components';

export default class Checkbox extends FormComponent {

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
        preview: PropTypes.bool,
        label: PropTypes.bool,
        threeState: PropTypes.bool
    };

    state: {
        icon: Icon // ikona checkboxa
    };

    constructor() {
        super(...arguments);
        this.state = {icon: this._setIcon()};
    }

    /** Obsługa zdarzenia kliknięcia
     * @param e - obiekt zdarzenia
     * @private
     */
    _handleClick(e: Event) {
        let value = this.field.value;
        if (value === null || value === undefined)
            value = true;
        else
            value = value ? false : this.props.threeState || e.ctrlKey || e.shiftKey ? null : true;

        let exception = null;
        try {
            this._handleChange(false, e, value);
        } catch (ex) {
            exception = ex;
        }
        this.setState({icon: this._setIcon()});
        if (exception) throw exception;
    }

    /** Określa jaka ikona powinna być wyświetlona
     * @private
     */
    _setIcon(): Icon {
        const val = this.field.value;
        let icon = Icon.CHECK_SQUARE;
        if (val !== null && val !== undefined)
            icon = val ? Icon.CHECK_SQUARE_O : Icon.SQUARE_O;
        return icon;
    }

    render() {
        if (!this.field)return null;

        if (this.props.preview)
            return (
                <span>
                    <span style={{marginRight: '10px'}}
                          title={this.field.name}
                          className={this.field.value ? Icon.CHECK : Icon.TIMES}/>
                </span>);

        return (
            <span className="c-check-box">
                <span className={this.state.icon}
                      title={this.field.hint}
                      tabIndex="0"
                      onClick={(e) => this.field.readOnly ? null : this._handleClick(e)}
                      onKeyPress={(e) => this.field.readOnly ? null : e.charCode === 32 ? this._handleClick(e) : null}/>
                {this.props.label ? this.field.name : null}
            </span>);
        //

    }
}