import {React, PropTypes, Utils, Field, Repository, Record, CRUDE, Column, AppStatus, Endpoint} from '../../../core';
import {Component, Page, FCtrl, Panel, Resizer, Button, Icon} from '../../../components';
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


    render() {

        this.record.onChange.listen(this, data => {
            if (!this._saveTs) return;
            let changes = Utils.forEach(data.changes, (arr: [], col: Column) =>
                col.key + ": " + Utils.escape(arr[0]) + " => " + Utils.escape(arr[1]));
            AppStatus.debug(this, "Czas: " + (new Date().getTime() - this._saveTs) + " ms", changes.join("\n"), 30000);
            this._saveTs = null;
        });


        return <Panel fit>
            {super.renderTitle((this.isNew ? "Nowy rekord" : "Edycja rekordu "
                + Utils.escape(this.record.displayValue) + " (" + this.repo.primaryKeyColumn.key + "="
                + Utils.escape(this.record.pk) + ")" ) + " repozytorium " + this.repo.name)}


            <Panel fit scrollable vertical>

                <div style={{flex: "auto"}}>
                    <AttributesRecord record={this.record} fill edit advancedCheckBox/>
                </div>

                <DTO record={this.record}/>

            </Panel>

            {this.renderToolBar(
                <Button
                    key="btnDetails"
                    type="default"
                    link={Endpoint.devRouter.REPO_DETAILS.getLink({repo: this.record.repo.key})}
                    title="Szczegóły repozytorium"
                    icon={Icon.INFO}>Szczegóły</Button>,
                this.controller.createButtons())}

        </Panel>
    }


}
