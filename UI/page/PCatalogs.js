// @flow
'use strict';

import {React, Ready, Utils, PropTypes, Field, Type, Column, Repository} from "../core/core";
import {Component, FieldComponent, Panel, Checkbox, FontAwesome, Link} from "../core/components";
import Page from "../core/page/Page";
import * as Repositories from "../model/Repositories";
import {RCatalogRecord} from "../model/Repositories";
import {RCatalogAttribute} from "../model/Repositories";
import {RCatalogAttributeRecord} from "../model/Repositories";
import {RAttributeRecord} from "../model/Repositories";
import {RepoCursor} from "../core/repository/Repository";
import {RResourceRecord} from "../model/Repositories";
import {RResource} from "../model/Repositories";

class Attributes extends Component {

    static propTypes = {
        preview: PropTypes.bool
    };

    render() {
        return <table className="tbl">

            <tbody>
            {this.props.children}

            </tbody>
        </table>;
    }
}

class Attr extends Component {

    static propTypes = {
        field: PropTypes.any,
        value: PropTypes.any,
        name: PropTypes.string,
        edit: PropTypes.bool, // ikona edycji
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
    };

    static defaultProps = {
        edit: false
    };


    /** Wartość jest aktualnie edytowana */
    edit: boolean = false;
    field: Field;


    constructor() {
        super(...arguments);
        this.field = this.props.field;
    }

    render() {

        const field: Field = this.edit ? new Field(this.field.config) : this.field;
        if (this.edit)
            field._value = this.field.value;

        return <tr>
            <td style={{padding: "2px 8px"}}>{super.renderChildren(this.props.name || field.name)}</td>
            <td style={{padding: "2px 8px"}}>
                {this.props.value ? super.renderChildren(this.props.value) : <span style={{display: "inline-block"}}>
                    <FieldComponent
                        key={(this.edit ? "#edt" : "") + field.key}
                        field={field}
                        preview={!this.props.edit || !this.edit}/>
                </span>
                }

                <Link ignore={!this.props.edit || !field || this.edit}
                      icon={FontAwesome.PENCIL}
                      onClick={() => {
                          this.edit = true;
                          this.forceUpdate();
                      }}/>

                <Link ignore={!this.props.edit || !field || !this.edit}
                      icon={FontAwesome.FLOPPY_O}
                      onClick={() => {
                          this.edit = false;
                          this.props.field.value = field.value;
                          Repository.commit(this, [this.field.record]);
                          this.forceUpdate();
                      }}/>
                <Link ignore={!this.props.edit || !field || !this.edit}
                      icon={FontAwesome.TIMES}
                      onClick={() => {
                          this.edit = false;
                          this.forceUpdate();
                      }}/>

            </td>
        </tr>;
    }
}

export default class PCatalogs extends Page {

    rec: RCatalogRecord;
    showDetails: Field = new Field((c: Column) => {
        c.type = Type.BOOLEAN;
        c.key = "advanced";
        c.name = "Zaawansowane";
        c.defaultValue = false;
    });

    constructor() {
        super(...arguments);
        this.showDetails.onChange.listen(this, () => this.forceUpdate());
    }

    render() {

        if (!Ready.waitFor([Repositories.R_CATALOG], () => this.forceUpdate()))
            return <div>Oczekiwanie na gotowość repozytorium katalogów</div>;

        if (this.props.id === "all")
            return <div>Wszystkie</div>;

        const rec: RCatalogRecord = this.rec = Repositories.R_CATALOG.get(this, this.props.id);

        const catalogId: number = rec.ID.value;

        let r = rec;
        const path = [];
        while (r) {
            path.push(r.NAME.value);
            r = r.getParent();
        }


        const attrs: RCatalogAttributeRecord[] = Repositories.R_CATALOG_ATTRIBUTE.find(this, (cursor: RepoCursor) => cursor.get(RCatalogAttribute.CAT) === catalogId);
        const ress: RResourceRecord[] = Repositories.R_RESOURCE.find(this, (cursor: RepoCursor) => cursor.get(RResource.CAT) === catalogId);

        const adv = this.showDetails.value;
        return <Panel fit>
            { super.renderTitle(path.reverse().join(" / "))}

            <label>
                {this.showDetails.render(false, true)}
                <span>Zaawansowane</span>
            </label>


            <Panel fit vertical>

                <Attributes>
                    <Attr ignore={!adv} field={rec.ID}/>
                    <Attr ignore={!adv} field={rec.UID}/>
                    <Attr field={rec.NAME} edit/>
                    <Attr ignore={!adv} field={rec.PARENT}/>
                    <Attr ignore={!adv} field={rec.ABSTRACT}/>
                    <Attr ignore={!adv} field={rec.CATEGORY}/>
                    <Attr ignore={!adv} field={rec.CREATED}/>
                    <Attr ignore={!adv} field={rec.ORDER}/>
                    <Attr field={rec.DESC} edit/>

                    <tr>
                        <td colSpan={2}><h3>Atrybuty:</h3></td>
                    </tr>

                    {attrs.map((catAttr: RCatalogAttributeRecord) => {

                        const attr: RAttributeRecord = catAttr.getForeign(this, catAttr.ATTR);

                        let val = Utils.asArray(catAttr.VALUE.value).map(elm => Utils.toString(elm)).join(", ");


                        if (attr.MASK.value) {

                            let str = attr.MASK.value;

                            Utils.forEach(Utils.asArray(catAttr.VALUE.value), (v, idx) => {
                                str = str.replaceAll("%" + (idx + 1), Utils.toString(v));
                            });
                            val = str;

                        }

                        return <Attr key={catAttr.ID.value}
                                     name={ "[" + attr.ID.value + "] " + attr.NAME.value}
                                     value={val}/>
                    })}

                    <hr/>

                    <tr>
                        <td colSpan={2}><h3>Zasoby:</h3></td>
                    </tr>

                    {ress.map((res: RResourceRecord) => {
                        return <Attr
                            key={res.ID.value}
                            name={res.NAME.value}
                            field={res.FORMAT}/>
                    })}
                </Attributes>

                <div style={{borderLeft: "1px solid red", flex: "auto"}}>
aaasd
                </div>
            </Panel>
        </Panel>

    }
}

