// @flow
'use strict';
import {Debug, React, Repository, Utils, If, Check, PropTypes, Record, Field, FieldConfig, Type} from "../../core";
import {FontAwesome, FormComponent, Link, Component} from "../../components";
import CheckBox from "../CheckBox";
import DatePicker from "../DatePicker";
import Select from "../Select";


export default class FieldComponent extends FormComponent {
    /**@private */
    _unitSelect: ?Select = null;
    /**@private */
    _changed: boolean = false;

    props: {
        preview: boolean,
        singleLine: boolean,
        checkBoxLabel: boolean,
        props: ?Object,
        readOnly: boolean,
        fieldCtrl: boolean
    };

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
        preview: PropTypes.bool,
        singleLine: PropTypes.bool,
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
            return <span {...this.props.props} title={this.field.name}>{this.field.displayValue}</span>;

        return (
            <span {...this.props.props} style={{display: 'flex'}}>
                {super.renderChildren(this._fieldCtrlInfo)}
                <input title={this.field.hint}
                       {...props}
                       placeholder={this.field.name}
                       name={this.field.key}
                       disabled={Utils.coalesce(this.props.readOnly, this.field.readOnly)}
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
                       defaultValue={this.field.units ? this.field.unitValue : this.field.simpleValue}
                />
                {this._unitSelect}
                {super.renderChildren(this._fieldCtrlErr)}
            </span>);
    }

    renderMemo() {
        if (!this.field) return null;

        if (this.props.preview) {
            const singleLineStyle = this.props.singleLine ? {overflow: "hidden", textOverflow: "ellipsis"} : null;

            return <span {...this.props.props} title={this.field.name} style={{display: 'flex'}}>
                <pre
                    style={{fontFamily: "inherit", flex: 'auto', ...singleLineStyle}}
                    disabled={true}
                >{super.renderChildren(this.field.simpleValue)}</pre>
            </span>;
        }

        return (
            <span {...this.props.props} style={{display: 'flex'}}>
                {super.renderChildren(this._fieldCtrlInfo)}
                <textarea
                    title={this.field.hint}
                    placeholder={this.field.name}
                    name={this.field.key}
                    disabled={Utils.coalesce(this.props.readOnly, this.field.readOnly)}
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
                    defaultValue={this.field.simpleValue}
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
                          title={this.field.name}
                          className={this.field.value ? FontAwesome.CHECK : FontAwesome.TIMES}/>
                    {this.props.checkBoxLabel ? this.field.name : null}
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
            if (this.field.isEmpty)
                return null;

            switch (this.field.type.name) {
                case "date":
                    return <span title={this.field.name}>{(this.field.value: Date).toLocaleDateString()}</span>;
                case "time":
                    return <span title={this.field.name}>{(this.field.value: Date).toLocaleTimeString()}</span>;
                case "timestamp":
                    return <span title={this.field.name}>{(this.field.value: Date).toLocaleString()}</span>;
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
                {Utils.forEach(this.field.value, (item: any, index: any) => <li
                    key={index}>{Field.formatValue(item)}</li>)}
            </ul>;

        return <List field={this.field}/>
    }


    render() {

        if (!this.field) return null;


        if (this.props.preview && this.props.singleLine)
            return <span>{this.field.displayValue}</span>;


        if (this.props.preview && this.field.enumerate) {
            const map: Map = this.field.enumerate();
            return <ul title={this.field.hint}>{
                Utils.forEach(this.field.value, (item, i) =>
                    <li key={i}>{Field.formatValue(map.get(item))} </li>
                )}
            </ul>;
        }

        if (this.field.type instanceof Type.ListDataType || this.field.type instanceof Type.MapDataType)
            return this.renderList();

        if (this.field.enumerate)
            return this.renderSelect();

        if (this.field.units)
            this._unitSelect = <Select
                style={{flex: 'auto', width: '10px'}}
                field={this.field}
                units={this.field.units()}
                fieldCtrl={false}
            />;

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

            default:
                switch (this.field.type.simpleType) {
                    case "string":
                        return this.renderInput({type: "text"});
                    case "number":
                        return this.renderInput({type: "number"});
                    case "boolean":
                        return this.renderCheckbox();
                    default:
                        Debug.warning(this, "Brak obslugi typu " + JSON.stringify(this.field.type.name));
                        return this.renderInput({type: "text"});
                }
        }
    }
}


class List extends Component {

    static propTypes = {
        field: PropTypes.any
    };

    array: [];

    render() {
        const field: Field = this.props.field;


        this.array = field.value instanceof Map
            ? Utils.forEach(field.value, (v, k) => [k, v])
            : (field.value || []).clone();

        const multipleCells = field.type.types instanceof Array;
        const columns: Type[] = multipleCells ? field.type.types : [Check.instanceOf(field.type.type, [Type.DataType])];

        const newRow = [];
        for (let i = 0; i < columns.length; i++)
            newRow.push(<td key={i}/>);


        return <table style={{width: "100%"}}>
            <tbody>{
                this.array.map((row: any | [], rowIndex: number) =>
                    <tr key={rowIndex}>{
                        columns.map((dataType: Type.DataType, cellIdx: number) => {
                                const f: Field = new Field((fc: FieldConfig) => {
                                    fc.enumerate = field.enumerate;
                                    fc.type = dataType;
                                    fc.key = field.key + " [" + rowIndex + "] [" + cellIdx + "]";
                                    fc.name = field.name;
                                });

                                f.set(multipleCells ? row[cellIdx] : row);

                                f.onChange.listen(this, (f) => {
                                    if (multipleCells) {
                                        const arr = this.array[rowIndex];
                                        while (arr.length <= cellIdx)
                                            arr.push(null);
                                        arr[cellIdx] = f.value;
                                    } else
                                        this.array[rowIndex] = f.value;
                                    field.value = this.array;
                                });

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
                                icon={FontAwesome.MINUS_SQUARE}
                                onClick={(e) => {
                                    this.array.splice(rowIndex, 1);
                                    field.value = array;
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
                            this.array.push(null);
                            field.value = this.array;
                            this.forceUpdate();
                        }}/></td>
            </tr>
            </tbody>
        </table>
    }
}