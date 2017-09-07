// @flow
'use strict';

import {React, PropTypes, Check, Record, Repository, CRUDE} from "../../core.js";
import RecordCtrl from "../../component/repository/RecordCtrl";
import RepoPage from "./RepoPage";
import {TabSet} from "../../component/TabSet";
import Config from "../../config/CoreConfig";

/** Klasa bazowa dla formatek edycji rekordu, parametrem jest zawsze id */
export default class BaseRecordPage extends RepoPage {

    static propTypes = {
        id: PropTypes.string,
        recCtrl: PropTypes.any
    };

    isNew: boolean;
    record: Record;
    controller: RecordCtrl;
    tabSet: TabSet;
    // czy po utworzeniu nowego rekordu wykonać funkcję history.back();
    historyBackOnCreate: boolean = Config.ui.historyBackOnCreate.value;

    //   afterSaveNavigate: string;

    constructor(repo: Repository | string, props: any, context: any, state: any) {
        super(repo, props, context, state);

        if (this.props.recCtrl) {
            this.controller = Check.instanceOf(this.props.recCtrl, [RecordCtrl]);
            this.record = this.controller.record;//Check.instanceOf(this.props.record, [Record]);
            this.repo = this.record.repo;
            this.isNew = this.record.action === CRUDE.CREATE;
            return;
        }

        Check.isDefined(this.props.id);
    }


    onReady(repo: Repository, list: Repository[]) {

        super.onReady(repo, list);


        if (!this.record) {
            this.isNew = this.props.id === "~new";
            this.repo = repo instanceof Repository ? repo : Repository.get(repo, true);
            this.record = this.isNew ? this.repo.createRecord(this, this.isNew
                ? CRUDE.CREATE : CRUDE.UPDATE)
                : this.repo.get(this, this.props.id, true);

            this.controller = new RecordCtrl(this.record);
            this.controller.local = false;
            this.controller.showAdvanced = false;
        }

        this.renderActionButtons(this.record);

        this.buttons.list.push(this.controller.btnBack);
        if (!this.isNew)
            this.buttons.list.push(this.controller.btnDelete);
        this.buttons.list.push(this.controller.btnSave);
        this.controller.btnDelete._visible = !this.isNew;

        this.controller.onCommit.listen(this, () => {
            if (this.isNew && this.historyBackOnCreate)
                window.history.back();
        });
    }
}