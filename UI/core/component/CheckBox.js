// @flow
'use strict';
import {React, PropTypes} from '../core';
import {FormComponent, FontAwesome} from '../components';

export default class CheckBox extends FormComponent {

    props: {
        label: boolean
    };

    static propTypes = {
        label: PropTypes.bool,
        threeState: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.state = {icon: this._setIcon(), color: null};
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
    _setIcon(): FontAwesome {
        const val = this.field.value;
        let icon = FontAwesome.CHECK_SQUARE;
        if (val !== null && val !== undefined)
            icon = val ? FontAwesome.CHECK_SQUARE_O : FontAwesome.SQUARE_O;
        return icon;
    }

    /** Ustawia 'podświetlenie' ikony
     * @param highlight - czy ma być 'podświetlona'
     * @private
     */
    _highlight(highlight: boolean = true) {
        if (this.field.readOnly)return;
        this.setState({color: highlight ? '#696969' : null});
    }

    render() {
        return (
            <span>
                {this._fieldCtrlInfo}
                <span className={this.state.icon}
                      title={this.field.hint}
                      tabIndex="0"
                      onClick={(e) => this.field.readOnly ? null : this._handleClick(e)}
                      onKeyPress={(e) => this.field.readOnly ? null : e.charCode === 32 ? this._handleClick(e) : null}
                      onFocus={() => this._highlight(true)}
                      onBlur={() => this._highlight(false)}
                      onMouseEnter={() => this._highlight(true)}
                      onMouseLeave={() => this._highlight(false)}
                      style={{
                          width: '16px',
                          marginRight: '10px',
                          color: this.state.color
                      }}/>
                {this.props.label ? this.field.name : null}
                {this._fieldCtrlErr}
            </span>);

    }
}