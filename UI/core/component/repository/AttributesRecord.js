import {React, PropTypes, Type, Utils, Field, Record, Column, Repository, CRUDE} from "../../core";
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
        advancedCheckBox: PropTypes.bool
    };

    showAdv: Field;

    constructor() {
        super(...arguments);
        if (this.props.advancedCheckBox) {
            this.showAdv = Field.create(Type.BOOLEAN, "showAdv", "Pokaż zaawansowane", false);
            this.showAdv.onChange.listen(this, () => this.forceUpdate(true));
        }
    }

    render() {
        let hasAdv = this.showAdv && !!Utils.find(this.props.record.fields, (field: Field) => field.config.disabled);

        const refs: RepoReference[] = this.props.record.references;

        return <Attributes
            key={Utils.randomId()}
            style={{
                ...this.props.style,
                width: this.props.fill ? "100%" : null
            }}>

            {hasAdv ? <div>
                <FCtrl field={this.showAdv} value={1} name={2}/>
            </div> : null}

            {Utils.forEach(this.props.record.fields, (f: Field) =>
                (this.showAdv && this.showAdv.value) || !f.config.disabled ?
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
