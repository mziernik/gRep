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
import Record from "../core/repository/Record";

export default class PCatalog extends RepoPage {

    rec: ECatalog;
    _viewer: PCatalogViewer;
    newAttr: Field;

    advanced: Field = new Field((c: Column) => {
        c.type = Type.BOOLEAN;
        c.key = "advanced";
        c.name = "Zaawansowane";
        c.value = false;
    });

    constructor(props: Object, context: Object, updater: Object) {
        super(R_CATALOG, props, context, updater);
    }

    onReady(repo: Repository, list: Repository[]) {
        super.onReady(repo, list);

        this.newAttr = new Field((c: Column) => {
            c.key = "newAttr";
            c.name = "Atrybut";
            c.type = Type.INT;
            c.enumerate = R_ATTRIBUTE.toArrays([RAttribute.ID, RAttribute.NAME]);
        });

        this.newAttr.onChange.listen(this, (data) => {
            const attr: ECatalogAttribute = R_CATALOG_ATTRIBUTE.createRecord(null, CRUDE.CREATE);
            attr.ATTR.value = data.value;
            this._viewer.setState({record: new RecordCtrl(attr)});
        });
    }

    render() {
        if (this.props.id === "all")
            return <div>Wszystkie</div>;

        const catalog: ECatalog = this.rec = R_CATALOG.get(this, this.props.id);
        const catalogId: number = catalog.ID.value;

        let r = catalog;
        const path = [];
        while (r) {
            path.push(r.NAME.value);
            r = r.getParent();
        }


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
                    <Attr ignore={!adv} field={catalog.ID}/>
                    <Attr ignore={!adv} field={catalog.UID}/>
                    <Attr field={catalog.NAME} edit/>
                    <Attr ignore={!adv} field={catalog.PARENT}/>
                    <Attr ignore={!adv} field={catalog.ABSTRACT}/>
                    <Attr ignore={!adv} field={catalog.CATEGORY}/>
                    <Attr ignore={!adv} field={catalog.CREATED}/>
                    <Attr ignore={!adv} field={catalog.ORDER}/>
                    <Attr field={catalog.DESC} edit/>

                    <hr/>

                    {catAttrs.map((catAttr: ECatalogAttribute) => {
                        const attr: EAttribute = catAttr.attrForeign(this);

                        const cavs: ECatalogAttributeValue[] = catAttr.catalogAttrValue_catAttr(this);

                        Utils.forEach(cavs, (cav: ECatalogAttributeValue) => cav.onChange.listen(this, x => this.forceUpdate()));

                        return <Attr key={catAttr.ID.value}
                                     record={catAttr}
                                     name={attr.NAME.value}
                                     value={PCatalogViewer.displayValue(attr, catAttr, cavs)}/>
                    })}

                    <hr/>

                    {ress.map((res: EResource) => {
                        return <Attr
                            key={res.ID.value}
                            name={res.NAME.value}
                            field={res.FORMAT}/>
                    })}

                    <div>
                        <FCtrl field={this.newAttr} value/>
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



