// @flow
'use strict';
import {React, PropTypes, Field} from '../../core';
import {FormComponent, Icon} from '../../components';

export default class Toggle extends FormComponent {

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
        preview: PropTypes.bool,
        label: PropTypes.bool
    };

    _handleClick(e: Event) {
        e.stopPropagation();
        let val = !this.field.value;
        this._handleChange(true, e, val);
        this.forceUpdate(true);
    }


    render() {
        if (!this.field) return null;

        if (this.props.preview)
            return (<span style={{marginRight: '10px'}}
                          title={this.field.name}
                          className={this.field.value ? Icon.CHECK : Icon.TIMES}/>);

        const slider = <div className="c-toggle-switch"
                            title={this.field.hint}
                            onClick={this.field.readOnly ? null : (e) => this._handleClick(e)}>
            <input type="checkbox" style={{display: 'none'}} checked={this.field.value}/>
            <span className="c-toggle-switch-slider"/>
        </div>;

        if (!this.props.label) return slider;
        return <div className="c-toggle">
            {slider}
            <span className="c-toggle-label">{this.field.name}</span>
        </div>
    }
}