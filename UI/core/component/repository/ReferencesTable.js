import {React, PropTypes, Type, Utils, Field, Record, Column, Repository, CRUDE} from "../../core";
import {Component, Attributes, Attr, FCtrl, Link, Icon} from "../../components";
import RecordCtrl from "./RecordCtrl";
import {RepoReference} from "../../repository/Repository";

export default class ReferencesTable extends Component {

    static propTypes = {
        record: PropTypes.instanceOf(Record),
        reference: PropTypes.any,
        fit: PropTypes.bool,
        modalEdit: PropTypes.bool
    };

    recs: Record[];
    reference: RepoReference;

    constructor() {
        super(...arguments);
        this.reference = this.props.reference;
        this.recs = Utils.asArray(this.reference.records);
    }

    render() {

        const record: Record = this.props.record;
        const col: Column = this.reference.column;
        const repo: Repository = this.reference.repo;

        const update = (rec: Record) => {
            if (rec.action && !record.changedReferences.contains(rec))
                record.changedReferences.push(rec);

            if (!rec.action && record.changedReferences.contains(rec))
                record.changedReferences.remove(rec);

            record.onReferenceChange.dispatch(this, {record: rec});
            this.forceUpdate();
            return true;
        };

        return <table className="c-references-table" style={{width: this.props.fit ? "100%" : null}}>
            <tbody>{
                Utils.forEach(this.recs, (rec: Record) => <tr key={Utils.randomId()}>
                        <td>
                            <div onClick={(e) => {
                                const r: Record = repo.get(this, rec.pk);
                                const field: Field = r.get(col);
                                field.value = record.pk;
                                r.fields.delete(col); // usuń kolumnę na czas edycji;
                                new RecordCtrl(this, r).renderEdit(this.props.modalEdit, () => {
                                    r.fields.set(col, field); // przywróć usunięte pole
                                    return update(r)
                                });
                            }}>{rec.displayValue}</div>
                        </td>

                        <td style={{width: "20px"}}>
                            <Link
                                icon={Icon.MINUS_SQUARE}
                                onClick={(e) => {
                                    this.recs.remove(rec);
                                    rec.action = rec.action === CRUDE.CREATE ? null : CRUDE.DELETE;
                                    update(rec);
                                }}/>
                        </td>
                    </tr>
                )
            }
            <tr>

                <td className="c-field-list-data">
                    <Link
                        icon={Icon.PLUS_SQUARE}
                        onClick={(e) => {
                            const rec: Record = repo.createRecord(this, CRUDE.CREATE);

                            const field: Field = rec.get(col);
                            field.value = record.pk;
                            rec.fields.delete(col); // usuń kolumnę na czas edycji;

                            new RecordCtrl(this, rec).renderEdit(this.props.modalEdit, () => {
                                this.recs.push(rec);
                                rec.fields.set(col, field); // przywróć usunięte pole
                                return update(rec);
                            });

                        }}/></td>
                <td/>
            </tr>
            </tbody>
        </table>
    }
}