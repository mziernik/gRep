// @flow
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

export default class PCatalogViewer extends Component {


    render() {
        if (!this.state || !this.state.record) return null;

        const ctrl: RecordCtrl = this.state.record;
        const catAttr: ECatalogAttribute = ctrl.record;
        const attr: EAttribute = catAttr.attrForeign(this);
        const values: ECatalogAttributeValue[] = catAttr.catalogAttrValue_catAttr(this);

        const attrElms = Utils.forEach(attr.attrElm_attr(), (elm: EAttributeElement, index) => {
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
                c.value = value.VALUE.value;
                if (e.ENUMERATE.value)
                    c.enumerate = () => e.ENUMERATE.value;
            });

            field.onChange.listen(this, () => {
                value.VALUE.value = field.value;
            });

            return <Attr edit field={field}/>
        });

        return <Panel key={Utils.randomId()}>
            <Attributes fit>
                <h5>{attr.NAME.value}: {PCatalogViewer.displayValue(attr, catAttr, values)}</h5>

                {attrElms}
                <Attr field={catAttr.NOTES} edit/>
                <Attr field={catAttr.CREATED}/>

            </Attributes>

            <div style={{textAlign: "right"}}>
                {ctrl.btnDelete.$}
                {ctrl.btnSave.$}
            </div>
        </Panel>
    }


    static displayValue(attr: EAttribute, catAttr: ECatalogAttribute, cavs: ECatalogAttributeValue[]): string {

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