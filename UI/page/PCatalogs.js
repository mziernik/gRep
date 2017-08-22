// @flow
'use strict';

import {React, Ready, Utils, PropTypes, Field, Type, Is, Column, Repository, CRUDE} from "../core/core";
import {Component, FCtrl, Panel, Checkbox, Link, Attributes, Attr, Icon} from "../core/components";
import {
    RAttribute, EAttributeElement,
    ECatalog, RCatalogAttribute, ECatalogAttribute, EAttribute, RResource, EResource, R_CATALOG, R_ATTRIBUTE,
    R_CATALOG_ATTRIBUTE, R_RESOURCE, R_CATALOG_ATTRIBUTE_VALUE, ECatalogAttributeValue, EElement
} from "../model/Repositories";
import {RepoCursor} from "../core/repository/Repository";
import RepoPage from "../core/page/base/RepoPage";
import RecordCtrl from "../core/component/repository/RecordCtrl";

export default class PCatalogs extends RepoPage {

    rec: ECatalog;
    _viewer: Viewer;
    _select: HTMLSelectElement;
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

        const attrs: [] = R_ATTRIBUTE.toObjects([RAttribute.ID, RAttribute.NAME]);

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
                    fit
                    preview
                    selectable
                    onAttrClick={(e, attr) => Is.defined(this._viewer, v => v.setState({record: new RecordCtrl(attr.record)}))}
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
                        <select ref={e => this._select = e}>
                            {attrs.map(obj => <option value={obj.id}>{obj.name}</option>)}
                        </select>

                        <Link
                            type="primary"
                            icon={Icon.PLUS}
                            onClick={e => {
                                if (!this._viewer || !this._select) return;
                                debugger;

                                const attr: ECatalogAttribute = R_CATALOG_ATTRIBUTE.createRecord(null, CRUDE.CREATE);

                                attr.ATTR.value = this._select.selectedValue();

                                this._viewer.setState({record: new RecordCtrl(attr)});

                            }}

                        >Dodaj</Link>

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

        const ctrl: RecordCtrl = this.state.record;
        const catAttr: ECatalogAttribute = ctrl.record;
        const attr: EAttribute = catAttr.attrForeign(this);
        const values: ECatalogAttributeValue[] = catAttr.catalogAttrValue_catAttr(this);


        return <Panel key={Utils.randomId()}>
            <Attributes fit>
                <h5>{attr.NAME.value}: {Viewer.displayValue(attr, catAttr, values)}</h5>

                <div style={{textAlign: "right"}}>
                    {ctrl.btnDelete.$}
                    {ctrl.btnSave.$}
                </div>


                {Utils.forEach(attr.attrElm_attr(), (elm: EAttributeElement, index) => {
                    //  const ca: ECatalogAttribute = cav.attrForeign(this);

                    let value: ECatalogAttributeValue = Utils.find(values, (cav: ECatalogAttributeValue) =>
                        cav.CAT_ATTR.value === catAttr.pk && cav.ATTR_ELM.value === elm.pk);

                    if (!value) {
                        value = R_CATALOG_ATTRIBUTE_VALUE.createRecord(null, CRUDE.CREATE);
                        value.ATTR_ELM.value = elm.ID.value;
                        value.CAT_ATTR.value = catAttr.ID.value;
                    }

                    ctrl.record.changedReferences.push(value);


                    const e: EElement = elm.elmForeign();

                    const ae: EAttributeElement = elm.elmForeign();

                    const field: Field = new Field((c: Column) => {
                        c.key = Utils.randomId();
                        c.name = e.NAME.value;
                        c.type = e.TYPE.value;
                        c.defaultValue = value.VALUE.value;
                        if (e.ENUMERATE.value)
                            c.enumerate = () => e.ENUMERATE.value;
                    });

                    field.onChange.listen(this, () => {
                        value.VALUE.value = field.value;
                    });

                    return <Attr edit field={field}/>
                })}

                <Attr field={attr.MASK}/>
                <Attr field={attr.DESC}/>
                <Attr field={catAttr.CREATED}/>
                <Attr field={catAttr.NOTES} edit/>

            </Attributes>
        </Panel>
    }


    static displayValue(attr: EAttribute, catAttr: ECatalogAttribute, cavs: ECatalogAttributeValue[]): string {

        if (!cavs)
            cavs = catAttr.catalogAttrValue_catAttr(this);

        const values: string[] = Utils.forEach(cavs, (v: ECatalogAttributeValue, idx) => Utils.toString(v.VALUE.value));

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

