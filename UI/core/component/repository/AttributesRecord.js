import {React, PropTypes, Type, Utils, Field, Record, Column, Repository, CRUDE} from "../../core";
import {Component, Attributes, Attr, FCtrl, Link, Icon} from "../../components";
import RecordCtrl from "./RecordCtrl";


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

        const refs: Map<Column, Record[]> = this.props.record.references;

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
                Utils.forEach(refs, (recs: Record[], col: Column) => {
                    return <Attr
                        key={Utils.randomId()}
                        name={col.repository.name}
                        value={<RefTable record={this.props.record} refs={recs} column={col}/>}/>
                })
            }

        </Attributes>


    }
}

class RefTable extends Component {

    static propTypes = {
        record: PropTypes.instanceOf(Record),
        refs: PropTypes.any,
        column: PropTypes.instanceOf(Column)
    };

    recs: Record[];

    constructor() {
        super(...arguments);
        this.recs = Utils.asArray(this.props.refs);
    }

    render() {

        const record: Record = this.props.record;
        const col: Column = this.props.column;

        return <table className="c-field-list">
            <tbody>{
                Utils.forEach(this.recs, (rec: Record) =>
                    <tr key={Utils.randomId()}>

                        <td>{rec.displayValue}</td>

                        <td style={{width: "20px"}}>
                            <Link
                                icon={Icon.MINUS_SQUARE}
                                onClick={(e) => {
                                    this.recs.remove(rec);
                                    rec.action = CRUDE.DELETE;
                                    this.forceUpdate();
                                    record.changedReferences.push(rec);
                                    record.onReferenceChange.dispatch(this, {record: rec});
                                }}/>
                        </td>
                    </tr>)
            }
            <tr>
                <td/>
                <td className="c-field-list-data">
                    <Link
                        icon={Icon.PLUS_SQUARE}
                        onClick={(e) => {
                            const rec: Record = col.repository.createRecord(this, CRUDE.CREATE);

                            const field: Field = rec.get(col);
                            field.value = record.pk;
                            rec.fields.delete(col); // usuń kolumnę na czas edycji;
                            rec.primaryKey.value = -1;

                            new RecordCtrl(this, rec, CRUDE.CREATE).editModal(() => {
                                this.recs.push(rec);
                                this.forceUpdate();
                                record.changedReferences.push(rec);
                                record.onReferenceChange.dispatch(this, {record: rec});
                                return true;
                            });

                        }}/></td>
            </tr>
            </tbody>
        </table>
    }
}