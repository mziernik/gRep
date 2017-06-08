// @flow
'use strict';
import {React, Repository, Utils, PropTypes, Record, Field} from "../core";
import {FontAwesome, FormComponent} from "../components";
import CheckBox from "./CheckBox";
import DatePicker from "./DatePicker";
import Select from "./Select";
import {CellsDataType} from "../repository/DataType";


export default class FieldComponent extends FormComponent {
    /**@private */
    _unitSelect: ?Select = null;

    props: {
        preview: boolean,
        checkBoxLabel: boolean,
        props: ?Object,
        readOnly: boolean,
        fieldCtrl: any // FixMe: Wojtek: Prawidłowy typ obiektu (react)
    };

    static propTypes = {
        preview: PropTypes.bool,
        checkBoxLabel: PropTypes.bool,
        props: PropTypes.object,
        readOnly: PropTypes.bool,
        fieldCtrl: PropTypes.any // FixMe: Wojtek: Prawidłowy typ obiektu (react)
    };

    static defaultProps = {
        props: []
    };

    constructor() {
        super(...arguments);
    }

    renderInput(props: ? Object) {
        if (!this.field) return null;

        if (this.props.preview)
            return <span {...this.props.props}>{this.field.getSimpleValue()}</span>;

        return (
            <span {...this.props.props} style={{display: 'flex'}}>
                {super.renderChildren(this._fieldCtrlInfo)}
                <input
                    {...props}
                    placeholder={this.field._title}
                    name={this.field._name}
                    disabled={Utils.coalesce(this.props.readOnly, this.field._readOnly)}
                    style={{
                        textTransform: this.field.textCasing,
                        flex: 'auto',
                        padding: "3px 8px",
                        width: this._unitSelect ? '10px' : null
                    }}
                    onChange={e => this._handleChange(false, e, e.target.value)}
                    onKeyPress={e => {
                        if (e.charCode === 13)
                            this._handleChange(true, e, e.target.value)
                    }}
                    onBlur={e => this._handleChange(true, e, e.target.value)}
                    defaultValue={this.field.getSimpleValue()}
                />
                {this._unitSelect}
                {super.renderChildren(this._fieldCtrlErr)}
            </span>);
    }

    renderMemo() {
        if (!this.field) return null;

        if (this.props.preview) {
            return <span {...this.props.props} style={{display: 'flex'}}>
                <pre
                    style={{fontFamily: "inherit", flex: 'auto'}}
                    disabled={true}
                >{super.renderChildren(this.field.getSimpleValue())}</pre>
            </span>;
        }

        return (
            <span {...this.props.props} style={{display: 'flex'}}>
                {super.renderChildren(this._fieldCtrlInfo)}
                <textarea
                    placeholder={this.field._title}
                    name={this.field._name}
                    disabled={Utils.coalesce(this.props.readOnly, this.field._readOnly)}
                    style={{
                        textTransform: this.field.textCasing,
                        flex: 'auto',
                    }}
                    onChange={e => this._handleChange(false, e, e.target.value)}
                    onBlur={e => this._handleChange(true, e, e.target.value)}
                    defaultValue={this.field.getSimpleValue()}
                />
                {super.renderChildren(this._fieldCtrlErr)}
            </span>);
    }

    renderCheckbox() {
        if (!this.field)return null;

        if (this.props.preview)
            return (
                <span {...this.props.props}>
                    <span style={{marginRight: '10px'}}
                          className={this.field.get() ? FontAwesome.CHECK : FontAwesome.TIMES}/>
                    {this.props.checkBoxLabel ? this.field._title : null}
                </span>);

        const elem = <CheckBox field={this.field} label={this.props.checkBoxLabel} fieldCtrl={false}/>;
        if (this.props.fieldCtrl)
            return (<span>
                {super.renderChildren(this._fieldCtrlInfo)}
                {elem}
                {super.renderChildren(this._fieldCtrlErr)}
            </span>);
        return elem;
    }

    renderDateTimePicker(props: ? Object) {
        if (!this.field)return null;

        if (this.props.preview) {
            if (this.field.isEmpty()) return null;
            switch (this.field.dataType.name) {
                case "date":
                    return <span>{(this.field._value: Date).toLocaleDateString()}</span>;
                case "time":
                    return <span>{(this.field._value: Date).toLocaleTimeString()}</span>;
                case "timestamp":
                    return <span>{(this.field._value: Date).toLocaleString()}</span>;
            }
        }

        return (
            <span {...this.props.props}>
                {super.renderChildren(this._fieldCtrlInfo)}
                <DatePicker field={this.field} fieldCtrl={false} dtpProps={props}/>
                {super.renderChildren(this._fieldCtrlErr)}
            </span>);
    }

    renderSelect() {
        if (!this.field) return null;

        if (this.props.preview) {
            if (this.field.isEmpty()) return null;
            //FixMe: Wojtek: if ... return ... else ... return
            if (this.field._multiple) {
                return (
                    <span>{

                        //FixMe: Wojtek: Używaj  Utils.forEach() lub   Utils.forEachMap(this.field._value) zamiast this.field._value.map
                        // funkcja poradzi sobie z tablicami, obiektami i nullami
                        this.field._value.map((item, i) => {
                            return (
                                <span>
                            {(i > 0 ? ', ' : '')
                            + this.field._enumerate.find((elem, i) => {
                                if (elem[1] === item)
                                    return elem;
                            })[0]}
                        </span>
                            )
                        })}</span>);
            } else return <span>{this.field._enumerate.find((elem, i) => {
                if (elem[1] === this.field._value)
                    return elem;
            })[0]}</span>;
        }

        return (
            <span {...this.props.props}>
                {super.renderChildren(this._fieldCtrlInfo)}
                <Select field={this.field} fieldCtrl={false}/>
                {super.renderChildren(this._fieldCtrlErr)}
            </span>);
    }


    //ToDo: Wojtek: Dodawanie, usuwanie, przenoszenie elementów
    renderList() {
        if (!this.field) return null;

        if (this.props.preview)
            return <ul>
                {Utils.forEachMap(this.field.get(), (item: any) => <li>{Field.formatValue(item)}</li>)}
            </ul>


        return <ul>
            {Utils.forEachMap(this.field.get(), (item: any) =>
                <li><input type="text" value={Field.formatValue(item)}/></li>)}
        </ul>

    }

    //ToDo: Wojtek: Dodawanie, usuwanie, przenoszenie elementów
    renderMap() {
        if (!this.field) return null;
        if (this.props.preview)
            return <table>
                <tbody>
                {Utils.forEachMap(this.field.get(), (value: any, key: any) =>
                    <tr>
                        <td>{Field.formatValue(key)}</td>
                        <td>{Field.formatValue(value)}</td>
                    </tr>)}
                </tbody>
            </table>;

        return <table>
            <tbody>{Utils.forEachMap(this.field.get(), (value: any, key: any) =>
                <tr>
                    <td><input type="text" value={Field.formatValue(key)}/></td>
                    <td><input type="text" value={Field.formatValue(value)}/></td>
                </tr>)
            }
            </tbody>
        </table>

    }

    renderCells() {

    }

    render() {

        if (!this.field) return null;

        if (this.field._enumerate !== null && this.field._enumerate !== undefined) {
            return this.renderSelect();
        }
        if (this.field._units)
            this._unitSelect =
                <Select style={{flex: 'auto', width: '10px'}} field={this.field} units={true} fieldCtrl={false}/>;

        if (this.field.dataType instanceof CellsDataType)
            return this.renderCells();

        switch (this.field.dataType.name) {
            case "password":
                return this.renderInput({type: "password"});
            case "string":
                return this.renderInput({type: "text"});
            case "memo":
                return this.renderMemo();
            case "length":
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
            case "map":
                return this.renderMap();
            case "list":
                return this.renderList();
            default:
                switch (this.field.dataType.simpleType) {
                    case "string":
                        return this.renderInput({type: "text"});
                    case "number":
                        return this.renderInput({type: "number"});
                    case "boolean":
                        return this.renderCheckbox();
                    default:
                        return this.renderInput({type: "text"});
                }
        }
    }
}