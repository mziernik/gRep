// @flow
'use strict';

import {React, Ready, Utils, PropTypes, Field, Type, Is, Column, Repository} from "../core/core";
import {Component, FCtrl, Panel, Checkbox, Link, Attributes, Attr} from "../core/components";
import Page from "../core/page/Page";
import * as Repositories from "../model/Repositories";
import {RCatalogRecord} from "../model/Repositories";
import {RCatalogAttribute} from "../model/Repositories";
import {RCatalogAttributeRecord} from "../model/Repositories";
import {RAttributeRecord} from "../model/Repositories";
import {RepoCursor} from "../core/repository/Repository";
import {RResourceRecord} from "../model/Repositories";
import {RResource} from "../model/Repositories";
import Select from "../core/component/form/Select";
import {RAttribute} from "../model/Repositories";
import {RAttributeElementRecord} from "../model/Repositories";

export default class PCatalogs extends Page {

    rec: RCatalogRecord;
    _viewer: Viewer;
    showDetails: Field = new Field((c: Column) => {
        c.type = Type.BOOLEAN;
        c.key = "advanced";
        c.name = "Zaawansowane";
        c.defaultValue = false;
    });

    constructor() {
        super(...arguments);
        this.showDetails.onChange.listen(this, () => this.forceUpdate());
        this.requireRepo(Repositories.R_CATALOG);
    }

    render() {
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

        const attrs = Repositories.R_ATTRIBUTE.toObject([RAttribute.ID, RAttribute.NAME]);


        const catAttrs: RCatalogAttributeRecord[] = Repositories.R_CATALOG_ATTRIBUTE.find(this,
            (cursor: RepoCursor) => cursor.get(RCatalogAttribute.CAT) === catalogId);

        const ress: RResourceRecord[] = Repositories.R_RESOURCE.find(this,
            (cursor: RepoCursor) => cursor.get(RResource.CAT) === catalogId);

        const adv = this.showDetails.value;
        return <Panel fit>
            {super.renderTitle(path.reverse().join(" / "))}

            <div>
                <FCtrl field={this.showDetails} value={1} name={2}/>
            </div>


            <Panel fit split scrollable>

                <Attributes
                    preview
                    selectable
                    onAttrClick={(e, attr) => Is.defined(this._viewer, v => v.setState({record: attr.record}))}
                >
                    <Attr ignore={!adv} field={rec.ID}/>
                    <Attr ignore={!adv} field={rec.UID}/>
                    <Attr field={rec.NAME} edit/>
                    <Attr ignore={!adv} field={rec.PARENT}/>
                    <Attr ignore={!adv} field={rec.ABSTRACT}/>
                    <Attr ignore={!adv} field={rec.CATEGORY}/>
                    <Attr ignore={!adv} field={rec.CREATED}/>
                    <Attr ignore={!adv} field={rec.ORDER}/>
                    <Attr field={rec.DESC} edit/>

                    <hr/>

                    {catAttrs.map((catAttr: RCatalogAttributeRecord) => {
                        const attr: RAttributeRecord = catAttr.getForeign(this, catAttr.ATTR);
                        return <Attr key={catAttr.ID.value}
                                     record={catAttr}
                                     name={attr.NAME.value}
                                     value={Viewer.display(attr, catAttr)}/>
                    })}

                    <hr/>

                    {ress.map((res: RResourceRecord) => {
                        return <Attr
                            key={res.ID.value}
                            name={res.NAME.value}
                            field={res.FORMAT}/>
                    })}

                    <div>
                        <select>
                            {attrs.map(obj => <option>{obj.name}</option>)}
                        </select>

                    </div>

                </Attributes>

                <Viewer ref={e => this._viewer = e}/>
            </Panel>
        </Panel>

    }
}

class Viewer extends Component {


    render() {
        if (!this.state || !this.state.record) return null;

        const catAttr: RCatalogAttributeRecord = this.state.record;
        const attr: RAttributeRecord = catAttr.getForeign(this, catAttr.ATTR);

        const attrElms: RAttributeElementRecord[] = attr.getForeign(this, attr.ELEMENTS);


        return <Panel key={Utils.randomId()}>
            <Attributes>
                <Attr field={catAttr.ATTR}/>
                <Attr name="Wartość" value={<Attributes>
                    {Utils.forEach(attrElms, (ae: RAttributeElementRecord, index) =>
                        <Attr
                            edit
                            name={ae.NAME.value}
                            value={catAttr.VALUE.value[index]}
                            type={ae.TYPE.value}
                        />)}
                </Attributes>}/>
                <Attr field={attr.MASK}/>
            </Attributes>
        </Panel>
    }

    static display(attr: RAttributeRecord, catAttr: RCatalogAttributeRecord) {
        let val = Utils.asArray(catAttr.VALUE.value).map(elm => Utils.toString(elm)).join(", ");


        if (attr.MASK.value) {

            let str = attr.MASK.value;

            Utils.forEach(Utils.asArray(catAttr.VALUE.value), (v, idx) => {
                str = str.replaceAll("%" + (idx + 1), Utils.toString(v));
            });
            val = str;

        }
        return val;
    }

}

