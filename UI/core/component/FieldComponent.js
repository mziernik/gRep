// @flow
'use strict';
import {React, Repository, PropTypes, Record, Field} from "../core";
import {FontAwesome, FormComponent} from "../components";
import CheckBox from "./CheckBox";
import DatePicker from "./DatePicker";
import Select from "./Select";

export default class FieldComponent extends FormComponent {

    props: {
        preview: boolean,
        checkBoxLabel: boolean,
        props: ?Object
    };

    static propTypes = {
        preview: PropTypes.bool,
        checkBoxLabel: PropTypes.bool,
        props: PropTypes.object
    };

    constructor() {
        super(...arguments);
    }

    renderInput(props: ?Object) {
        if (!this.field) return null;

        if (this.props.preview)
            return <span {...this.props.props}>{Field.formatValue(this.field.get())}</span>;

        return (
            <span {...this.props.props} style={{display: 'flex'}}>
                {this._fieldCtrlInfo}
                <input
                    {...props}
                    placeholder={this.field._title}
                    name={this.field.name}
                    disabled={this.field._readOnly}
                    style={{textTransform: this.field.textCasing, flexGrow: 1}}
                    onChange={e => this._handleChange(false, e, e.target.value)}
                    onKeyPress={e => {
                        if (e.charCode === 13)
                            this._handleChange(true, e, e.target.value)
                    }}
                    onBlur={e => this._handleChange(true, e, e.target.value)}
                    defaultValue={this.field.get()}
                />
                {this._fieldCtrlErr}
            </span>);
    }

    renderCheckbox() {
        if (!this.field)return null;

        if (this.props.preview)
            return (
                <span>
                    <span style={{marginRight: '10px'}}
                          className={this.field.get() ? FontAwesome.CHECK : FontAwesome.TIMES}/>
                    {this.props.checkBoxLabel ? this.field._title : null}
                </span>);

        const elem = <CheckBox field={this.field} label={this.props.checkBoxLabel} fieldCtrl={false}/>;
        if (this.props.fieldCtrl)
            return (<span>{this._fieldCtrlInfo}{elem}{this._fieldCtrlErr}</span>);
        return elem;
    }

    renderDateTimePicker(props: ?Object) {
        if (!this.field)return null;

        if (this.props.preview)
            return <span>{Field.formatValue(this.field.get())}</span>;

        return (
            <span>
                {this._fieldCtrlInfo}
                <DatePicker field={this.field} fieldCtrl={false} dtpProps={props}/>
                {this._fieldCtrlErr}
            </span>);
    }

    /* ToDo select i multiselect */
    renderSelect() {
        return (
            <span>
                {this._fieldCtrlInfo}
                <Select field={this.field} fieldCtrl={false}/>
                {this._fieldCtrlErr}
            </span>);
    }

    /* ToDo length(number z jednostką), object(???) */
    render() {
        if (!this.field) return null;
        const value = this.field.get();

        if (this.field._enumerate !== null) {
            return this.renderSelect();
        }

        switch (this.field.dataType.name) {
            case "password":
                return this.renderInput({type: "password"});
            case "string":
                return this.renderInput({type: "text"});
            case "length":/* ToDo do poprawienia (number z jednostką)*/
                return this.renderInput({type: "number", min: 0});
            case "double":
                return this.renderInput({type: "number", step: 0.001});
            case "int":
                return this.renderInput({type: "number"});
            case "boolean":
                return this.renderCheckbox();
            case "date":
                return this.renderDateTimePicker({format: "DD-MM-YYYY", time: false});
            case "time":
                return this.renderDateTimePicker({format: 'HH:mm', calendar: false});
            case "timestamp":
                return this.renderDateTimePicker({format: 'DD-MM-YYYY HH:mm'});
        }

        return <span> {JSON.stringify(Field.formatValue(value))} </span>;
    }

}