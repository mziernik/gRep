import {React, PropTypes, Utils, Field, Repository, Record, CRUDE, Column, AppStatus, Endpoint} from '../../../core';
import {Component, Page, FCtrl, Panel, Resizer, Btn, Icon} from '../../../components';
import BaseRecordPage from "../../base/BaseRecordPage";
import AttributesRecord from "../../../component/repository/AttributesRecord";
import DTO from "../../../component/repository/DTO";

export default class PRecord extends BaseRecordPage {
    _saveTs: number;

    static propTypes = {
        repo: PropTypes.string,
        rec: PropTypes.string
    };

    constructor(props: any, context: any, state: any) {
        super(props.repo, ...arguments);

    }

    onReady(repo: Repository, list: Repository[]) {
        super.onReady(repo, list);

        this.buttons.insert((btn: Btn) => {
            btn.key = "btnDetails";
            btn.type = "default";
            btn.link = Endpoint.devRouter.REPO_DETAILS.getLink({repo: repo.key});
            btn.title = "Szczegóły repozytorium";
            btn.icon = Icon.INFO;
            btn.text = "Szczegóły";
        });

        this.record.onChange.listen(this, data => {
            if (!this._saveTs)
                return;
            let changes = Utils.forEach(data.changes, (arr: [], col: Column) =>
                col.key + ": " + Utils.escape(arr[0]) + " => " + Utils.escape(arr[1]));
            AppStatus.debug(this, "Czas: " + (new Date().getTime() - this._saveTs) + " ms", changes.join("\n"), 30000);
            this._saveTs = null;
        });
    }


    render() {

        this.title.set((this.isNew ? "Nowy rekord" : "Edycja rekordu "
            + Utils.escape(this.record.displayValue) + " (" + this.repo.primaryKeyColumn.key + "="
            + Utils.escape(this.record.pk) + ")" ) + " repozytorium " + Utils.escape(this.repo.name));

        return <Panel fit>

            <Panel fit scrollable vertical>

                <div style={{flex: "auto"}}>
                    <AttributesRecord
                        recordCtrl={this.controller}
                        fit
                        edit
                        showAdvanced={null}
                        local={null}
                    />
                </div>

                <DTO record={this.record}/>

            </Panel>

        </Panel>
    }


}
