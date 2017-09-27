// @flow
import {React, Ready, Utils, PropTypes, Field, Type, Is, Column, Repository, CRUDE} from "../core/core";
import {Component, FCtrl, Panel, Checkbox, Link, Attributes, Attr, Icon} from "../core/components";
import {
    RAttribute, EAttributeElement,
    ECatalog, RCatalogAttribute, ECatalogAttribute, EAttribute, RResource, EResource, R_CATALOG, R_ATTRIBUTE,
    R_CATALOG_ATTRIBUTE, R_RESOURCE, R_CATALOG_ATTRIBUTE_VALUE, ECatalogAttributeValue, EElement
} from "../model/Repositories";
import RepoPage from "../core/page/base/RepoPage";
import RecordCtrl from "../core/component/repository/RecordCtrl";
import PCatalogViewer from "./PCatalogViewer";
import RepoCursor from "../core/repository/RepoCursor";

export default class PCatalog extends RepoPage {

    rec: ECatalog;
    _viewer: PCatalogViewer;
    _select: HTMLSelectElement;
    advanced: Field = new Field((c: Column) => {
        c.type = Type.BOOLEAN;
        c.key = "advanced";
        c.name = "Zaawansowane";
        c.value = false;
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

        const newAttr: Field = new Field((c: Column) => {
            c.key = "newAttr";
            c.name = "Atrybut";
            c.type = Type.INT;
            c.enumerate = R_ATTRIBUTE.toArrays([RAttribute.ID, RAttribute.NAME]);
        });

        const catAttrs: ECatalogAttribute[] = R_CATALOG_ATTRIBUTE.find(this,
            (cursor: RepoCursor) => cursor.getValue(RCatalogAttribute.CAT) === catalogId);

        const ress: EResource[] = R_RESOURCE.find(this,
            (cursor: RepoCursor) => cursor.getValue(RResource.CAT) === catalogId);

        const adv = this.advanced.value;
        this.title.set(path.reverse().join(" / "));

        return <Panel fit>

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
                                     value={PCatalogViewer.displayValue(attr, catAttr)}/>
                    })}

                    <hr/>

                    {ress.map((res: EResource) => {
                        return <Attr
                            key={res.ID.value}
                            name={res.NAME.value}
                            field={res.FORMAT}/>
                    })}

                    <div>
                        <FCtrl field={newAttr}/>

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

                <PCatalogViewer ref={e => this._viewer = e}/>
            </Panel>


            <div>
                <FCtrl field={this.advanced} value={1} name={2}/>
            </div>

        </Panel>

    }
}


