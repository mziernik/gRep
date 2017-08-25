// @flow
'use strict';

import {
    React,
    ReactComponent,
    Ready,
    Utils,
    PropTypes,
    Field,
    Type,
    Column,
    Repository,
    AppNode,
    Is,
    Var,
    Record
} from "../../core";
import {Component, FCtrl, Panel, Checkbox, Icon, Link} from "../../components";
import {Child} from "../Component";
import {DataType} from "../../repository/Type";

/**
 * Lista atrybutów wyświetlana w formie tabelarycznej
 */


export class Attributes extends Component {

    constructor() {
        super(...arguments);
    }

    static propTypes = {
        ...Component.propTypes,
        preview: PropTypes.bool,
        edit: PropTypes.bool,
        style: PropTypes.object,
        selectable: PropTypes.bool,
        onAttrClick: PropTypes.func,
        fit: PropTypes.bool
    };

    selected: Attr;


    render() {


        let counter = 0;
        return <table
            className="c-attributes"
            style={{
                width: this.props.fit ? "100%" : undefined,
                ...this.props.style
            }}>

            <tbody>
            {this.children.props({
                preview: this.props.preview,
                edit: this.props.edit
            })
                .instanceOf(Attr)
                .filter((child: Child) => {

                    child.props.key = "c" + (++counter);

                    if (child.type !== "Attr")
                        child.element = <tr>
                            <td colSpan={2}>{child.element}</td>
                        </tr>;
                    else
                        child.props.onClick = (e: Event, attr: Attr) => {
                            Is.func(this.props.onAttrClick, f => f(e, attr));

                            if (this.props.selectable) {
                                if (this.selected)
                                    this.selected.tr.removeAttribute("data-selected");

                                this.selected = attr;
                                this.selected.tr.setAttribute("data-selected", "true");
                            }

                        }
                })
                .render()}
            </tbody>
        </table>;
    }
}

export class Attr extends Component {

    static propTypes = {
        ...Component.propTypes,
        /** Rysuj tylko jeśli jest różne od null i róże od undefined */
        ifDefined: PropTypes.bool,
        type: PropTypes.instanceOf(DataType),
        field: PropTypes.any,
        value: PropTypes.any,
        name: PropTypes.string,
        preview: PropTypes.bool,
        edit: PropTypes.bool,
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
        mode: PropTypes.oneOf(["preview", "edit", "mixed"]),
        onClick: PropTypes.func,
        record: PropTypes.instanceOf(Record), // wartość pomocnicza, np w obsłudze metody onAttrClick
    };

    /** Wartość jest aktualnie edytowana */
    edit: boolean = false;
    field: Field;
    tr: HTMLTableRowElement;
    record: Record;

    constructor() {
        super(...arguments);
        this.field = this.props.field;
        this.edit = this.props.edit && !this.props.preview;
        this.record = this.props.record;
        if (this.field)
            this.field.onUpdateMarkerChange.listen(this, obj => this._updateChangeMarker(obj.state));
    }

    _updateChangeMarker = (state) => {
        if (this.field && !Is.defined(state)) state = this.field.wasChangedRecently;
        if (this.tr)
            this.tr.setAttribute("data-changed", state);
    };


    render() {
        const mixedMode = this.field && this.props.edit && this.props.preview;

        let field: Field = mixedMode && this.field ? new Field(this.field.config) : this.field;
        if (field && mixedMode)
            field._value = this.field.value;

        if (field) {
            field.onChange.listen(this, () => updateErrorMarker());
            field.onError.listen(this, () => updateErrorMarker());
        }

        const updateErrorMarker = () => {
            if (this.tr && field)
                this.tr.setAttribute("data-error", !!field.error);
        };


        if (this.props.ifDefined && !Is.defined(this.props.value) && (!field || !Is.defined(field.value) ))
            return null;

        if (!field && this.props.type)
            field = new Field((c: Column) => {
                c.key = Utils.randomId();
                c.type = this.props.type;
                c.name = this.props.name;
                c.defaultValue = this.props.value;
            });

        return <tr
            ref={e => Is.defined(e, () => {
                this.tr = e;
                updateErrorMarker();
                this._updateChangeMarker(null)
            })}
            className="c-attributes-row"
            onClick={e => Is.func(this.props.onClick, f => f(e, this))}
        >

            <td className="c-attributes-name">{field ?
                <FCtrl
                    field={field}
                    label={this.props.name}
                    description={1}
                    name={2}
                    required={3}
                    error={4}
                    preview={!this.edit}
                /> : this.children.render(this.props.name)}</td>
            <td className="c-attributes-value">
                {field ? <div style={{display: "flex"}}>
                    <FCtrl
                        key={(this.edit ? "#edt" : "") + field.key}
                        field={field}
                        fit={this.edit}
                        value
                        preview={!this.edit}
                        boolMode="radio"
                    />

                    <span style={{display: "table-cell", whiteSpace: "nowrap"}}>
                             <Link ignore={!mixedMode || this.edit}
                                   icon={Icon.PENCIL}
                                   onClick={() => {
                                       this.edit = true;
                                       this.forceUpdate();
                                   }}/>

                    <Link ignore={!mixedMode || !this.edit}
                          style={{verticalAlign: "sub"}}
                          icon={Icon.FLOPPY_O}
                          onClick={() => {
                              this.edit = false;
                              this.props.field.value = field.value;
                              Repository.commit(this, [this.field.record]);
                              this.forceUpdate();
                          }}/>
                    <Link ignore={!mixedMode || !this.edit}
                          style={{verticalAlign: "sub"}}
                          icon={Icon.TIMES}
                          onClick={() => {
                              this.edit = false;
                              this.forceUpdate();
                          }}/>
                    </span>


                </div> : super.renderChildren(this.props.value)
                }
            </td>
        </tr>;
    }
}