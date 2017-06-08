import {React, PropTypes, Utils, If, Field, Repository, Record, CRUDE, Endpoint} from '../../../core';
import {Page, FontAwesome, Link, Table, PageTitle, FieldComponent} from '../../../components';
import Button from "../../../component/Button";


export default class PRecord extends Page {

    record: ?Record = null;
    repo: Repository;
    isNew: boolean;


    static propTypes = {
        repo: PropTypes.string,
        rec: PropTypes.string
    };

    constructor() {
        super(...arguments);
        this.repo = Repository.getF(this.props.repo);

        this.isNew = !this.props.rec || this.props.rec === "~new";

        if (this.isNew)
            this.record = this.repo.newRecord();
        else {
            if (this.repo.isReady)
                this.record = this.beginEdit(this.repo.getF(this.props.rec));
            else
                Repository.onChange.listen(this, (map: Map, records: Record[]) =>
                    If.condition(map.has(this.repo), () => {
                        this.record = this.beginEdit(this.repo.getF(this.props.rec));
                        this.forceUpdate();
                    })
                );
        }
    }

    render() {

        if (!this.repo.isReady && !this.isNew)
            return <span>Inicjalizacja repozytorium. Proszę czekać...</span>;

        const columns = [];

        columns.push(<span key="#action" style={{textAlign: "center"}}>Akcje</span>);

        columns.addAll(this.repo.columns.map((f: Field) =>
            <span key={f._name} style={{textAlign: "center"}}>
                    <div>{f._name}</div>
                    <div style={{fontWeight: "normal"}}>{f._title}</div>
                    <div style={{fontWeight: "normal", fontStyle: "italic"}}>[{f.dataType.name}]</div>
                </span>));


        return <div>
            <PageTitle>{this.isNew ? "Nowy rekord " : "Edycja rekordu " + this.record.getFullId()
            } repozytorium "{this.repo.name}"</PageTitle>

            <section style={{display: "inline-block"}}>

            <table>
                <tbody>
                {
                    this.record.fields.map((field: Field) => {

                        if (this.isNew && field._readOnly) return null;

                        return <tr>
                            <td style={ {textAlign: "right"} }>{field._title + ":"}</td>
                            <td style={{
                                padding: "4px"
                            }}>
                                <FieldComponent
                                    field={field}
                                    fieldCtrl={false}
                                    checkBoxLabel={true}
                                    preview={false}
                                />
                            </td>
                        </tr>
                    })
                }

                </tbody>
            </table>

                <div style={{textAlign: "right"}}>

            <Button record={this.record}
                    crude={this.isNew ? CRUDE.CREATE : CRUDE.UPDATE}>{this.isNew ? "Utwórz" : "Zapisz"}</Button>
                    {this.isNew ? null : <Button record={this.record} crude={CRUDE.DELETE}>Usuń</Button>}
                    <Button>Anuluj</Button>
                </div>

                 </section>
        </div>
    }
}