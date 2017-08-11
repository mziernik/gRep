import {React, PropTypes, Type, Utils, Field, Record, Column, Repository, CRUDE, Is, Check} from "../../core";
import {Component, Attributes, Attr, FCtrl, Link, Icon} from "../../components";
import RecordCtrl from "./RecordCtrl";
import {RepoReference} from "../../repository/Repository";
import ReferencesTable from "./ReferencesTable";


export default class AttributesRecord extends Component {

    static propTypes = {
        ...Component.propTypes,
        recordCtrl: PropTypes.instanceOf(RecordCtrl),
        fit: PropTypes.bool,
        edit: PropTypes.bool,
        showAdvanced: PropTypes.bool,
        local: PropTypes.bool
    };

    showAdvField: Field;
    localField: Field;

    constructor() {
        super(...arguments);

        const ctrl: RecordCtrl = Check.instanceOf(this.props.recordCtrl, [RecordCtrl]);

        if (!Is.defined(this.props.showAdvanced)) {
            this.showAdvField = Field.create(Type.BOOLEAN, "showAdv", "Pokaż zaawansowane", false);
            this.showAdvField.onChange.listen(this, () => this.forceUpdate(true));
        }

        if (this.props.local !== false) {
            this.localField = Field.create(Type.BOOLEAN, "local", "Lokalne", false);
            this.localField.config.description = "Zapisuj zmiany tylko lokalnie (nie wysyłaj do serwera)";
            this.localField.onChange.listen(this, (value) => ctrl.record.localCommit = value);
        }
    }

    render() {

        const ctrl: RecordCtrl = Check.instanceOf(this.props.recordCtrl, [RecordCtrl]);
        const rec: Record = ctrl.record;

        let hasAdv = this.showAdvField && !!Utils.find(rec.fields, (field: Field) => field.config.disabled);

        return <Attributes
            key={Utils.randomId()}
            style={{
                ...this.props.style,
                width: this.props.fit ? "100%" : null
            }}>

            {hasAdv || this.localField ? <div>
                <FCtrl style={{marginRight: "50px"}} ignore={!hasAdv || !this.showAdvField} field={this.showAdvField}
                       value={1} name={2}/>

                <FCtrl ignore={!this.localField} field={this.localField} value={1} name={2}/>
            </div> : null}

            {Utils.forEach(rec.fields, (f: Field) =>
                (this.showAdvField && this.showAdvField.value) || !f.config.disabled ?
                    <Attr key={f.key} edit={this.props.edit} field={f}/> : undefined
            )}

            {
                Utils.forEach(rec.references, (ref: RepoReference) => {
                    return <Attr
                        key={Utils.randomId()}
                        name={ref.name}
                        value={<ReferencesTable fit recordCtrl={ctrl} reference={ref}/>}/>
                })
            }

        </Attributes>


    }
}
