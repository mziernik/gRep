import {React, PropTypes, Type, Utils, Field, Record, Column, Repository, CRUDE, Is} from "../../core";
import {Component, Attributes, Attr, FCtrl, Link, Icon} from "../../components";
import RecordCtrl from "./RecordCtrl";
import {RepoReference} from "../../repository/Repository";
import ReferencesTable from "./ReferencesTable";


export default class AttributesRecord extends Component {

    static propTypes = {
        ...Component.propTypes,
        record: PropTypes.instanceOf(Record),
        fill: PropTypes.bool,
        edit: PropTypes.bool,
        showAdvanced: PropTypes.bool,
        local: PropTypes.bool
    };

    advanced: boolean;
    local: boolean;

    showAdvField: Field;
    localField: Field;

    constructor() {
        super(...arguments);

        if (!Is.defined(this.props.showAdvanced)) {
            this.showAdvField = Field.create(Type.BOOLEAN, "showAdv", "Pokaż zaawansowane", false);
            this.showAdvField.onChange.listen(this, () => this.forceUpdate(true));
        }

        if (!Is.defined(this.props.local)) {
            this.localField = Field.create(Type.BOOLEAN, "local", "Lokalne", false);
            this.localField.config.description = "Zapisuj zmiany tylko lokalnie (nie wysyłaj do serwera)";
            this.localField.onChange.listen(this, (value) => this.props.record.localCommit = value);

        }
    }

    render() {
        let hasAdv = this.showAdvField && !!Utils.find(this.props.record.fields, (field: Field) => field.config.disabled);

        const refs: RepoReference[] = this.props.record.references;

        return <Attributes
            key={Utils.randomId()}
            style={{
                ...this.props.style,
                width: this.props.fill ? "100%" : null
            }}>

            {hasAdv || this.local ? <div>
                <FCtrl ignore={!this.showAdvField} field={this.showAdvField} value={1} name={2}/>
                <span style={{marginRight: "50px"}}/>
                <FCtrl ignore={!this.localField} field={this.localField} value={1} name={2}/>
            </div> : null}

            {Utils.forEach(this.props.record.fields, (f: Field) =>
                (this.showAdvField && this.showAdvField.value) || !f.config.disabled ?
                    <Attr key={f.key} edit={this.props.edit} field={f}/> : undefined
            )}

            {
                Utils.forEach(refs, (ref: RepoReference) => {
                    return <Attr
                        key={Utils.randomId()}
                        name={ref.name}
                        value={<ReferencesTable fit record={this.props.record} reference={ref}/>}/>
                })
            }

        </Attributes>


    }
}
