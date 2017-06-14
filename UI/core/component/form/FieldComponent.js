// @flow
'use strict';
import {React, Repository, Utils, If, Check, PropTypes, Record, Field, DataType} from "../../core";
import {FontAwesome, FormComponent, Link, Component, MultipleCells} from "../../components";
import CheckBox from "../CheckBox";
import DatePicker from "../DatePicker";
import Select from "../Select";
import {CellsDataType, ForeignDataType} from "../../repository/DataType";


export default class FieldComponent extends FormComponent {
    /**@private */
    _unitSelect: ?Select = null;
    /**@private */
    _changed: boolean = false;

    props: {
        preview: boolean,
        checkBoxLabel: boolean,
        props: ?Object,
        readOnly: boolean,
        fieldCtrl: boolean
    };

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
        preview: PropTypes.bool,
        checkBoxLabel: PropTypes.bool,
        props: PropTypes.object,
        readOnly: PropTypes.bool,
        fieldCtrl: PropTypes.bool
    };

    constructor() {
        super(...arguments);
    }

    renderInput(props: ? Object) {
        if (!this.field) return null;

        if (this.props.preview)
            return <span {...this.props.props} title={this.field._title}>{this.field.getSimpleValue()}</span>;

        return (
            <span {...this.props.props} style={{display: 'flex'}}>
                {super.renderChildren(this._fieldCtrlInfo)}
                <input title={this.field._title}
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
                       defaultValue={this.field.getSimpleValue()}
                />
                {this._unitSelect}
                {super.renderChildren(this._fieldCtrlErr)}
            </span>);
    }

    renderMemo() {
        if (!this.field) return null;

        if (this.props.preview) {
            return <span {...this.props.props} title={this.field._title} style={{display: 'flex'}}>
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
                    title={this.field._title}
                    placeholder={this.field._title}
                    name={this.field._name}
                    disabled={Utils.coalesce(this.props.readOnly, this.field._readOnly)}
                    style={{
                        textTransform: this.field.textCasing,
                        flex: 'auto',
                    }}
                    onChange={e => {
                        this._changed = true;
                        this._handleChange(false, e, e.target.value);
                    }}
                    onBlur={e => {
                        if (this._changed) this._handleChange(true, e, e.target.value);
                    }}
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
                          title={this.field._title}
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
            switch (this.field.type.name) {
                case "date":
                    return <span title={this.field._title}>{(this.field._value: Date).toLocaleDateString()}</span>;
                case "time":
                    return <span title={this.field._title}>{(this.field._value: Date).toLocaleTimeString()}</span>;
                case "timestamp":
                    return <span title={this.field._title}>{(this.field._value: Date).toLocaleString()}</span>;
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

        const enumerate = this.field._enumerate();

        if (this.props.preview) {
            if (this.field.isEmpty()) return null;
            if (this.field.type.multiple || this.field.type.list) {
                return (
                    <span title={this.field._title}>{
                        Utils.forEachMap(this.field._value, (item, i) => {
                            const arr = enumerate.find((elem, i) => (elem[1] === item)) || [];
                            return <span>{ (i > 0 ? ', ' : '') + arr[0]} </span>
                        })}</span>);
            }
            return <span title={this.field._title}>{enumerate.find((elem, i) => {
                if (elem[1] === this.field._value)
                    return elem;
            })[0]}</span>;
        }

        return (
            <span {...this.props.props}>
                {super.renderChildren(this._fieldCtrlInfo)}
                <Select
                    readOnly={this.props.readOnly}
                    field={this.field}
                    fieldCtrl={false}
                />
                {super.renderChildren(this._fieldCtrlErr)}
            </span>);
    }


    renderList() {
        if (!this.field) return null;

        if (this.props.preview)
            return <ul>
                {Utils.forEachMap(this.field.get(), (item: any) => <li>{Field.formatValue(item)}</li>)}
            </ul>;

        return <List field={this.field}/>
    }

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


    }

    renderCells() {

    }


    render() {

        if (!this.field) return null;

        if (this.field.type.list)
            return this.renderList();

        if (this.field._enumerate !== null && this.field._enumerate !== undefined)
            return this.renderSelect();

        if (this.field._units)
            this._unitSelect = <Select
                style={{flex: 'auto', width: '10px'}}
                field={this.field}
                units={true}
                fieldCtrl={false}
            />;

        if (this.field.type instanceof CellsDataType)
            return this.renderCells();

        if (this.field.type instanceof ForeignDataType)
            debugger;
        //     return this.renderForeign();

        switch (this.field.type.name) {
            case "password":
                return this.renderInput({type: "password"});
            case "string":
            case "uuid":
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
                switch (this.field.type.simpleType) {
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


class List extends Component {

    static propTypes = {
        field: PropTypes.any
    };

    render() {
        const field: Field = this.props.field;

        const array: [] = field.get() || [];

        const columns: DataType[] = [];

        if (field.type instanceof CellsDataType)
            (field.type: CellsDataType).cells.forEach(cell => columns.push(cell.clone()));
        else {
            const t: DataType = field.type.clone();
            t.list = false;
            columns.push(t);
        }

        const newRow = [];
        for (let i = 0; i < columns.length; i++)
            newRow.push(<td key={i}/>);


        return <table style={{width: "100%"}}>
            <tbody>{
                array.map((row: any | [], rowIndex: number) =>
                    <tr key={rowIndex}>{
                        columns.map((dataType: DataType, cellIdx: number) => {
                                const f: Field = new Field(dataType);
                                f.name(field._name + " [" + rowIndex + "] [" + cellIdx + "]");
                                f.set(row);
                                return <td key={cellIdx}>
                                    <FieldComponent
                                        field={f}
                                        fieldCtrl={false}
                                        style={{width: "100%"}}
                                    />
                                </td>
                            }
                        )
                    }
                        <td style={{width: "20px"}}>
                            <Link
                                icon={FontAwesome.TIMES}
                                onClick={(e) => {
                                    array.splice(rowIndex, 1);
                                    field.set(array);
                                    this.forceUpdate();
                                }}/>
                        </td>
                    </tr>)
            }
            <tr>
                {newRow}
                <td style={{width: "20px"}}>
                    <Link
                        icon={FontAwesome.PLUS_SQUARE}
                        onClick={(e) => {
                            const cells = [];
                            for (let i = 0; i < columns.length; i++)
                                cells.push(null);
                            array.push(field.type.multiple ? [cells] : cells);
                            field.set(array);
                            this.forceUpdate();
                        }}/></td>
            </tr>
            </tbody>
        </table>
    }
}