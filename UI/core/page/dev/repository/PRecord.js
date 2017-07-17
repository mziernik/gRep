import {React, PropTypes, Utils, Field, Repository, Record, CRUDE, Column, AppStatus} from '../../../core';
import {Component, Page, FCtrl, Panel, Resizer} from '../../../components';
import WebApiRepositoryStorage from "../../../repository/storage/WebApiRepoStorage";
import JsonViewer from "../../../component/JsonViewer";
import RecordCtrl from "../../../component/form/RecordCtrl";


export default class PRecord extends Page {

    record: ?Record = null;
    repo: Repository;
    isNew: boolean;
    viewer: JsonViewer;
    _saveTs: number;

    static propTypes = {
        repo: PropTypes.string,
        rec: PropTypes.string
    };

    constructor() {
        super(...arguments);
        this.waitForRepo(this.props.repo);
    }


    render() {

        this.repo = Repository.get(this.props.repo, true);

        this.isNew = !this.props.rec || this.props.rec === "~new";

        if (this.isNew)
            this.record = this.repo.createRecord(this);

        this.record = this.record || this.repo.get(this, this.props.rec);

        this.record.onChange.listen(this, (map: Map) => {
            if (!this._saveTs) return;
            let changes = Utils.forEach(map, (arr: [], col: Column) =>
            col.key + ": " + Utils.escape(arr[0]) + " => " + Utils.escape(arr[1]));
            AppStatus.debug(this, "Czas: " + (new Date().getTime() - this._saveTs) + " ms", changes.join("\n"), 30000);
            this._saveTs = null;
        });

        this.record.onFieldChange.listen(this, e => {
            if (!this.viewer)
                return;
            this.viewer.update(this._displayDTO());
        });

        const preview = !this.record.canUpdate;

        const columns = [];

        columns.push(<span key="#action" style={{textAlign: "center"}}>Akcje</span>);

        columns.addAll(this.repo.columns.map((c: Column) =>
            <span key={c.key} style={{textAlign: "center"}}>
                    <div>{c.key}</div>
                    <div style={{fontWeight: "normal"}}>{c.name}</div>
                    <div style={{fontWeight: "normal", fontStyle: "italic"}}>[{c.type.name}]</div>
                </span>));


        const ctrl: RecordCtrl = new RecordCtrl(this, this.record, this.isNew ? CRUDE.CREATE : CRUDE.UPDATE);

        return <Panel fit>
            {super.renderTitle((this.isNew ? "Nowy rekord" : "Edycja rekordu " + this.record.fullId ) + " repozytorium " + this.repo.name)}

            <div style={{
                display: "flex"
            }}>

                <Panel resizable
                       style={{
                           display: "inline-block",
                           width: "60%",
                           // resize: "horizontal",
                           // overflow: "auto",
                           padding: "8px",
                           border: "1px solid rgba(0, 0, 0, 0.15)"
                       }}>

                    <table className="tbl" style={{width: "100%"}}>
                        <tbody>
                        {
                            Utils.forEach(this.record.fields, (field: Field) => {

                                // if (this.isNew)
                                //     field.readOnly = false;

                                if (this.isNew && field.config.autoGenerated) return null;

                                return <tr key={field.key}>
                                    {/*<Title field={field}/>*/}
                                    <td >
                                        <FCtrl
                                            field={field}
                                            required
                                            error
                                            name
                                        />
                                    </td>
                                    <td style={{
                                        padding: "4px"
                                    }}>
                                        <FCtrl
                                            field={field}
                                            preview={preview}
                                            value
                                            fit
                                        />
                                    </td>
                                    <td >
                                        <FCtrl field={field} description/>
                                    </td>

                                </tr>
                            })
                        }

                        </tbody>
                    </table>

                </Panel>

                {this.renderToolBar([
                    ctrl.createDeleteButton(`Czy na pewno usunąć rekord ${Utils.escape(this.record.displayName)}?`),
                    ctrl.createSaveButton()
                ])}

                <div style={{flex: "auto", padding: "8px"}}>
                    <div>DTO:</div>
                    <JsonViewer object={this._displayDTO()} instance={e => this.viewer = e}/>
                </div>

            </div>

        </Panel>
    }


    _displayDTO() {
        let dto = WebApiRepositoryStorage.buildDTO([this.record], true);
        dto = dto[this.record.repo.key];
        if (!dto) return;
        dto = dto[0];
        if (!dto) return;
        return dto;
    }
}

class Title extends Component {

    field: Field;
    updated: boolean = false;

    constructor() {
        super(...arguments);
        this.field = this.props.field;
        this.field.onUpdate.listen(this, () => {
            this.updated = true;
            this.forceUpdate();
        });
    }

    render() {
        return <td style={ {
            textAlign: "right",
            color: this.updated ? "blue" : null,
            fontWeight: this.updated ? "bold" : null,
            // verticalAlign: "top"
        } }>{this.field.name + ":"}</td>
    }


}