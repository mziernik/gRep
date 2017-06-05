// @flow
'use strict';
import {React, PropTypes} from '../core';
import {FormComponent, FontAwesome} from '../components';

export default class CheckBox extends FormComponent {

    props: {
        label: boolean
    };

    static propTypes = {
        label: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.state = {icon: this._setIcon(), color: null};
    }

    _handleClick(e: Event) {
        let value = this.field.get();
        if (value === null || value === undefined)
            value = true;
        else
            value = value ? false : null;
        this._handleChange(false, e, value);
        this.setState({icon: this._setIcon()});
    }

    _setIcon(): FontAwesome {
        const val = this.field.get();
        let icon = FontAwesome.CHECK_SQUARE;
        if (val !== null && val !== undefined)
            icon = val ? FontAwesome.CHECK_SQUARE_O : FontAwesome.SQUARE_O;
        return icon;
    }

    _highlight(highlight: boolean = true) {
        if (this.field._readOnly)return;
        this.setState({color: highlight ? '#696969' : null});
    }

    render() {
        return (
            <span>
                {this._fieldCtrlInfo}
                <span className={this.state.icon}
                      tabIndex="0"
                      onClick={(e) => this.field._readOnly ? null : this._handleClick(e)}
                      onKeyPress={(e) => this.field._readOnly ? null : e.charCode === 32 ? this._handleClick(e) : null}
                      onFocus={() => this._highlight(true)}
                      onBlur={() => this._highlight(false)}
                      onMouseEnter={() => this._highlight(true)}
                      onMouseLeave={() => this._highlight(false)}
                      style={{
                          width: '16px',
                          marginRight: '10px',
                          color: this.state.color
                      }}/>
                {this.props.label ? this.field._title : null}
                {this._fieldCtrlErr}
            </span>);

    }
}