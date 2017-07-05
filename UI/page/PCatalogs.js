// @flow
'use strict';

import {React, Ready, Utils} from "../core/core";
import {FieldComponent} from "../core/components";
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

    draw() {

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

        return <div>
            { super.renderTitle(path.reverse().join(" / "))}

            <div>Id: {rec.ID.value}</div>

            <FieldComponent field={rec.DESC}/>


            <div>Atrybuty:</div>
            {attrs.map((catAttr: RCatalogAttributeRecord) => {

                const attr: RAttributeRecord = catAttr.getForeign(this, catAttr.ATTR);

                return <div key={catAttr.ID.value}>
                    <span>  {Utils.toString(attr.NAME.value)} </span>
                    <span>: </span>
                    <span>  {Utils.toString(catAttr.VALUE.value)} </span>

                </div>
            })}

            <hr/>
            <div>Zasoby:</div>
            {ress.map((res: RResourceRecord) => {

                return <div key={res.ID.value}>
                    <span>  {Utils.toString(res.NAME.value)} </span>
                    <span>  {Utils.toString(res.FORMAT.value)} </span>
                </div>
            })}

        </div>

    }
}

