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
    Record
} from "../../core";
import {Component, FCtrl, Panel, Checkbox, Icon, Link} from "../../components";
import {Child} from "../Component";

/**
 * Lista atrybutów wyświetlana w formie tabelarycznej
 */

export class Attributes extends Component {

    constructor() {
        super(...arguments);
    }

    static propTypes = {
        preview: PropTypes.bool,
        edit: PropTypes.bool,
        style: PropTypes.object
    };


    static renderRecord(rec: Record, edit: boolean): ReactComponent {
        return <Attributes>
            {Utils.forEach(rec.fields, (f: Field) =>
                f.config.hidden ? undefined : <Attr edit={edit} field={f}/>
            )}
        </Attributes>
    }

    render() {


        let counter = 0;
        return <table className="c-attributes" style={this.props.style}>

            <tbody>
            { this.children
                .props({
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
                })
                .render() }
            </tbody>
        </table>;
    }
}

export class Attr extends Component {

    static propTypes = {
        field: PropTypes.any,
        value: PropTypes.any,
        name: PropTypes.string,
        preview: PropTypes.bool,
        edit: PropTypes.bool,
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
        mode: PropTypes.oneOf(["preview", "edit", "mixed"])
    };

    /** Wartość jest aktualnie edytowana */
    edit: boolean = false;
    field: Field;

    constructor() {
        super(...arguments);
        this.field = this.props.field;
        this.edit = this.props.edit && !this.props.preview;
    }

    render() {

        const mixedMode = this.field && this.props.edit && this.props.preview;

        const field: Field = mixedMode && this.field ? new Field(this.field.config) : this.field;
        if (field && mixedMode)
            field._value = this.field.value;


        return <tr className="c-attributes-row">

            <td>{this.props.name ? this.children.render(this.props.name) : field
                ? <FCtrl field={field} required={1} name={2} error={3}/> : null }</td>
            <td>
                {this.props.value ? super.renderChildren(this.props.value) : <div style={{display: "flex"}}>
                    <FCtrl
                        key={(this.edit ? "#edt" : "") + field.key}
                        field={field}
                        fit={this.edit}
                        value={this.edit}
                        preview={!this.edit}/>

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


                </div>
                }
            </td>

            {field ? <td><FCtrl field={field} description/></td> : null}
        </tr>;
    }
}