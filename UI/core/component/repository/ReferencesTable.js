import {React, PropTypes, Type, Utils, Field, Record, Column, Repository, CRUDE, Check} from "../../core";
import {Component, Attributes, Attr, FCtrl, Link, Icon} from "../../components";
import RecordCtrl from "./RecordCtrl";
import {RepoReference} from "../../repository/Repository";
import ReferenceRecordCtrl from "./ReferenceRecordCtrl";

export default class ReferencesTable extends Component {

    static propTypes = {
        recordCtrl: PropTypes.any, //RecordCtrl
        reference: PropTypes.any,
        fit: PropTypes.bool
    };

    recs: Record[];
    reference: RepoReference;

    constructor() {
        super(...arguments);
        this.reference = this.props.reference;
        this.recs = this.reference.records;
    }

    render() {
        const ctrl: RecordCtrl = Check.instanceOf(this.props.recordCtrl, [RecordCtrl]);
        const record: Record = ctrl.record;
        const col: Column = this.reference.column;
        const repo: Repository = this.reference.repo;


        return <table className="c-references-table" style={{width: this.props.fit ? "100%" : null}}>
            <tbody>{
                Utils.forEach(this.recs, (rec: Record) => <tr key={Utils.randomId()}>
                        <td>
                            <div
                                onClick={(e) => {
                                    new ReferenceRecordCtrl(ctrl, rec)
                                        .set(col.key, ctrl.record.pk, true)
                                        .modalEdit(() => this.forceUpdate())
                                }}
                            >{rec.displayValue}</div>
                        </td>

                        {/*<td style={{width: "20px"}}>*/}
                        {/*<Link*/}
                        {/*icon={Icon.MINUS_SQUARE}*/}
                        {/*onClick={(e) => {*/}
                        {/*this.recs.remove(rec);*/}
                        {/*rec.action = rec.action === CRUDE.CREATE ? null : CRUDE.DELETE;*/}
                        {/*update(rec);*/}
                        {/*}}/>*/}
                        {/*</td>*/}
                    </tr>
                )
            }
            <tr>

                <td className="c-field-list-data">
                    <Link
                        icon={Icon.PLUS_SQUARE}
                        onClick={(e) => {
                            const r = repo.createRecord(this, CRUDE.CREATE);
                            new ReferenceRecordCtrl(ctrl, r)
                                .set(col.key, ctrl.record.pk, true)
                                .modalEdit(() => {
                                    this.recs.push(r);
                                    this.forceUpdate();
                                })
                        }}

                    />
                </td>
            </tr>
            </tbody>
        </table>
    }
}