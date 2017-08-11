// @flow
'use strict';

import {React, Ready, Utils, PropTypes, Field, Type, Is, Column, Repository} from "../core/core";
import {Component, FCtrl, Panel, Checkbox, Link, Attributes, Attr} from "../core/components";
import Page from "../core/page/Page";
import {
    ECatalog, RCatalogAttribute, ECatalogAttribute, EAttribute, RResource, EResource, R_CATALOG, R_ATTRIBUTE,
    R_CATALOG_ATTRIBUTE, R_RESOURCE, R_CATALOG_ATTRIBUTE_VALUES, ECatalogAttributeValues
} from "../model/Repositories";
import {RAttribute, EAttributeElement} from "../model/Repositories";
import {RepoCursor} from "../core/repository/Repository";
import * as Repositories from "../model/Repositories";
import RepoPage from "../core/page/base/RepoPage";

export default class PCatalogs extends RepoPage {

    rec: ECatalog;
    _viewer: Viewer;
    showDetails: Field = new Field((c: Column) => {
        c.type = Type.BOOLEAN;
        c.key = "advanced";
        c.name = "Zaawansowane";
        c.defaultValue = false;
    });

    constructor(props: Object, context: Object, updater: Object) {
        super(R_CATALOG, props, context, updater);
    }

    render() {
        if (this.props.id === "all")
            return <div>Wszystkie</div>;

        const rec: ECatalog = this.rec = R_CATALOG.get(this, this.props.id);

        const catalogId: number = rec.ID.value;

        let r = rec;
        const path = [];
        while (r) {
            path.push(r.NAME.value);
            r = r.getParent();
        }

        const attrs = R_ATTRIBUTE.toObject([RAttribute.ID, RAttribute.NAME]);

        const catAttrs: ECatalogAttribute[] = R_CATALOG_ATTRIBUTE.find(this,
            (cursor: RepoCursor) => cursor.get(RCatalogAttribute.CAT) === catalogId);

        const ress: EResource[] = R_RESOURCE.find(this,
            (cursor: RepoCursor) => cursor.get(RResource.CAT) === catalogId);

        const adv = this.showDetails.value;
        this.title.set(path.reverse().join(" / "));

        return <Panel fit>


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

                    {catAttrs.map((catAttr: ECatalogAttribute) => {
                        const attr: EAttribute = catAttr.attrForeign(this);
                        return <Attr key={catAttr.ID.value}
                                     record={catAttr}
                                     name={attr.NAME.value}
                                     value={Viewer.displayValue(attr, catAttr)}/>
                    })}

                    <hr/>

                    {ress.map((res: EResource) => {
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

        const catAttr: ECatalogAttribute = this.state.record;
        const attr: EAttribute = catAttr.attrForeign(this);
        const values: ECatalogAttributeValues[] = catAttr.catalogAttrValues_attr(this);


        return <Panel key={Utils.randomId()}>
            <Attributes>
                <h5>{attr.NAME.value}: {Viewer.displayValue(attr, catAttr, values)}</h5>

                {Utils.forEach(values, (cav: ECatalogAttributeValues, index) => {
                    //  const ca: ECatalogAttribute = cav.attrForeign(this);
                    const ae: EAttributeElement = cav.elmForeign(this);
                    return <Attr
                        edit
                        name={ae.NAME.value}
                        value={cav.VALUE.value}
                        type={ae.TYPE.value}
                    />
                })}

                <Attr field={attr.MASK}/>
                <Attr field={attr.DESC} edit/>
                <Attr field={catAttr.CREATED}/>
                <Attr field={catAttr.NOTES} edit/>

            </Attributes>
        </Panel>
    }

    static displayValue(attr: EAttribute, catAttr: ECatalogAttribute, cavs: ECatalogAttributeValues[]): string {

        if (!cavs)
            cavs = catAttr.catalogAttrValues_attr(this);

        const values: string[] = Utils.forEach(cavs, (v: ECatalogAttributeValues, idx) => Utils.toString(v.VALUE.value));

        if (attr.MASK.value) {
            let str = attr.MASK.value;
            Utils.forEach(values, (v: string, idx) => {
                str = str.replaceAll("%" + (idx + 1), v);
            });
            return str;
        }

        return values.join(", ");

    }

}

