// @flow
'use strict';

import {React, Ready, Utils, PropTypes, Field, Type, Column} from "../core/core";
import {Component, FieldComponent, Panel, Checkbox} from "../core/components";
import Page from "../core/page/Page";
import * as Repositories from "../model/Repositories";
import {RCatalogRecord} from "../model/Repositories";
import {RCatalogAttribute} from "../model/Repositories";
import {RCatalogAttributeRecord} from "../model/Repositories";
import {RAttributeRecord} from "../model/Repositories";
import {RepoCursor} from "../core/repository/Repository";
import {RResourceRecord} from "../model/Repositories";
import {RResource} from "../model/Repositories";
import FormComponent from "../core/component/form/FormComponent";
import FieldController from "../core/component/form/FieldController";

class Attributes extends Component {

    static propTypes: {
        preview: PropTypes.bool
    };

    render() {
        return <table>

            <tbody>
            {this.props.children}

            </tbody>
        </table>;
    }
}


class Attr extends Component {

    static propTypes: {
        field: PropTypes.any,
        preview: PropTypes.bool,
        name: PropTypes.string
    };

    field: Field;
    preview: boolean;

    constructor() {
        super(...arguments);
        this.field = this.props.field;
        this.preview = this.props.preview || true;
    }

    render() {
        return <tr>
            <td style={{padding: "2px 8px"}}>{this.props.name || this.field.name}</td>
            <td style={{padding: "2px 8px"}}>
                <FieldComponent field={this.field} preview={this.preview}/>
            </td>
            <td style={{padding: "2px 8px"}}>
                <FieldComponent field={this.field} preview={false}/>
            </td>
        </tr>;
    }
}

export default class PCatalogs extends Page {

    rec: RCatalogRecord;
    showAdvanced: Field = new Field((c: Column) => {
        c.type = Type.BOOLEAN;
        c.key = "advanced";
        c.name = "Zaawansowane";
    });

    constructor() {
        super(...arguments);
        this.showAdvanced.onChange.listen(this, () => this.forceUpdate());
    }

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

        const adv = this.showAdvanced.value;
        return <Panel fit>
            { super.renderTitle(path.reverse().join(" / "))}

            <label>
                {this.showAdvanced.render(false, true)}
                <span>Zaawansowane</span>
            </label>


            <Attributes>
                {adv ? <Attr field={rec.ID}/> : null}
                {adv ? <Attr field={rec.UID}/> : null}
                <Attr field={rec.NAME}/>
                <Attr field={rec.PARENT}/>
                <Attr field={rec.ABSTRACT}/>
                <Attr field={rec.CATEGORY}/>
                <Attr field={rec.CREATED}/>
                <Attr field={rec.ORDER}/>
                <Attr field={rec.DESC}/>

                <tr>
                    <td colSpan={2}><h3>Atrybuty:</h3></td>
                </tr>

                {attrs.map((catAttr: RCatalogAttributeRecord) => {

                    const attr: RAttributeRecord = catAttr.getForeign(this, catAttr.ATTR);

                    return <Attr key={catAttr.ID.value} name={attr.NAME.value} field={catAttr.VALUE}/>
                })}

                <hr/>

                <tr>
                    <td colSpan={2}><h3>Zasoby:</h3></td>
                </tr>

                {ress.map((res: RResourceRecord) => {
                    return <Attr key={res.ID.value} name={res.NAME.value} field={res.FORMAT}/>
                })}
            </Attributes>
        </Panel>

    }
}

