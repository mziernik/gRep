// @flow
'use strict';

import {React, Ready, Utils, PropTypes, Field, Type, Column, Repository} from "../core/core";
import {Component, FCtrl, Panel, Checkbox, FontAwesome, Link, Attributes, Attr} from "../core/components";
import Page from "../core/page/Page";
import * as Repositories from "../model/Repositories";
import {RCatalogRecord} from "../model/Repositories";
import {RCatalogAttribute} from "../model/Repositories";
import {RCatalogAttributeRecord} from "../model/Repositories";
import {RAttributeRecord} from "../model/Repositories";
import {RepoCursor} from "../core/repository/Repository";
import {RResourceRecord} from "../model/Repositories";
import {RResource} from "../model/Repositories";

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


        const attrs: RCatalogAttributeRecord[] = Repositories.R_CATALOG_ATTRIBUTE.find(this, (cursor: RepoCursor) => cursor.get(RCatalogAttribute.CAT) === catalogId);
        const ress: RResourceRecord[] = Repositories.R_RESOURCE.find(this, (cursor: RepoCursor) => cursor.get(RResource.CAT) === catalogId);

        const adv = this.showDetails.value;
        return <Panel fit>
            { super.renderTitle(path.reverse().join(" / "))}

            <label>
                <FCtrl field={this.showDetails} value/>
                <span>Zaawansowane</span>
            </label>


            <Panel fit vertical>

                <Attributes preview edit>
                    <Attr ignore={!adv} field={rec.ID}/>
                    <Attr ignore={!adv} field={rec.UID}/>
                    <Attr field={rec.NAME} edit/>
                    <Attr ignore={!adv} field={rec.PARENT}/>
                    <Attr ignore={!adv} field={rec.ABSTRACT}/>
                    <Attr ignore={!adv} field={rec.CATEGORY}/>
                    <Attr ignore={!adv} field={rec.CREATED}/>
                    <Attr ignore={!adv} field={rec.ORDER}/>
                    <Attr field={rec.DESC} edit/>

                    <h3>Atrybuty:</h3>


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
                    <h3>Zasoby:</h3>
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

