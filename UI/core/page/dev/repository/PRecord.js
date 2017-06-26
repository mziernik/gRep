import {React, PropTypes, Utils, If, Field, Repository, Record, CRUDE, Endpoint, Type} from '../../../core';
import {Page, FontAwesome, Link, Table, PageTitle, FieldComponent, FieldController, Panel} from '../../../components';
import Button from "../../../component/Button";
import WebApiRepositoryStorage from "../../../repository/storage/WebApiRepoStorage";
import JsonViewer from "../../../component/JsonViewer";


export default class PRecord extends Page {

    record: ?Record = null;
    repo: Repository;
    isNew: boolean;
    viewer: JsonViewer;


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

    _displayDTO() {
        let dto = WebApiRepositoryStorage.buildDTO([this.record], true);
        dto = dto[this.record.repository.key];
        if (!dto) return;
        dto = dto[0];
        if (!dto) return;
        dto = dto.fields;
        if (!dto) return;
        return dto;
    }

    render() {


        if (!this.repo.isReady && !this.isNew)
            return <span>Inicjalizacja repozytorium. Proszę czekać...</span>;

        this.record.fieldChanged.listen(this, e => {
            if (!this.viewer)
                return;
            this.viewer.update(this._displayDTO());
        });

        const columns = [];

        columns.push(<span key="#action" style={{textAlign: "center"}}>Akcje</span>);

        columns.addAll(this.repo.columns.map((f: Field) =>
            <span key={f.key} style={{textAlign: "center"}}>
                    <div>{f.key}</div>
                    <div style={{fontWeight: "normal"}}>{f.name}</div>
                    <div style={{fontWeight: "normal", fontStyle: "italic"}}>[{f.type.name}]</div>
                </span>));


        return <Panel>
            <PageTitle>{this.isNew ? "Nowy rekord " : "Edycja rekordu " + this.record.getFullId()
            } repozytorium "{this.repo.name}"</PageTitle>

            <div style={{
                display: "flex"
            }}>

                <section
                    ref={tag => {
                        // new MutationObserver(mutations => {
                        //     mutations.forEach((mutation: MutationRecord) => {
                        //         console.log(mutation.type);
                        //     });
                        // }).observe(tag, {attributes: true, childList: true, characterData: true});

                    }}

                    style={{
                        flex: "auto",
                        display: "inline-block",
                        // resize: "horizontal",
                        // overflow: "auto",
                        padding: "8px",
                        border: "1px solid #aaa"
                    }}>

                    <table className="tbl" style={{width: "100%"}}>
                        <tbody>
                        {
                            this.record.fields.map((field: Field) => {

                                // if (this.isNew)
                                //     field.readOnly = false;

                                if (this.isNew && field.autoGenerated) return null;

                                return <tr key={field.key}>
                                    <td style={ {
                                        textAlign: "right",
                                        // verticalAlign: "top"
                                    } }>{field.name + ":"}</td>
                                    <td >
                                        <FieldController
                                            field={field}
                                            handleRequired={true}
                                            handleFieldError={true}
                                            handleFieldWarning={true}
                                            handleDescription={true}
                                        />
                                    </td>
                                    <td style={{
                                        padding: "4px"
                                    }}>
                                        <FieldComponent
                                            field={field}
                                            fieldCtrl={false}
                                            preview={false}
                                        />
                                    </td>
                                    <td >
                                        <FieldController field={field} handleDescription={true}/>
                                    </td>

                                </tr>
                            })
                        }

                        </tbody>
                    </table>

                    <div style={{textAlign: "right"}}>

                        <Button record={this.record}
                                crude={this.isNew ? CRUDE.CREATE : CRUDE.UPDATE}

                        > {this.isNew ? "Utwórz" : "Zapisz"} </Button>
                        {this.isNew ? null :
                            <Button confirm={"Czy na pewno usunąć rekord?"} record={this.record} crude={CRUDE.DELETE}>Usuń</Button>}
                        <Button>Anuluj</Button>
                    </div>

                </section>

                <div style={{flex: "auto", padding: "8px"}}>
                    <div>DTO:</div>
                    <JsonViewer object={this._displayDTO()} instance={e => this.viewer = e}/>
                </div>

            </div>
        </Panel>
    }
}