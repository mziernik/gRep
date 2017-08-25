// @flow
'use strict';

import {React, Check, Record, Repository, CRUDE} from "../../core.js";
import Page from "../Page";
import RecordCtrl from "../../component/repository/RecordCtrl";
import RepoPage from "./RepoPage";
import {TabSet} from "../../component/TabSet";

/** Klasa bazowa dla formatek edycji rekordu, parametrem jest zawsze id */
export default class BaseRecordPage extends RepoPage {

    isNew: boolean;
    record: Record;
    controller: RecordCtrl;
    tabSet: TabSet;

    //   afterSaveNavigate: string;

    constructor(repo: Repository | string, props: any, context: any, state: any) {
        super(repo, props, context, state);
        Check.isDefined(this.props.id);
    }


    onReady(repo: Repository, list: Repository[]) {
        this.isNew = this.props.id === "~new";
        this.repo = repo instanceof Repository ? repo : Repository.get(repo, true);
        this.record = this.isNew ? this.repo.createRecord(this, this.isNew
            ? CRUDE.CREATE : CRUDE.UPDATE)
            : this.repo.get(this, this.props.id, true);
        this.controller = new RecordCtrl(this.record);
        this.controller.local = false;
        this.controller.showAdvanced = false;

        this.buttons.list.push(this.controller.btnBack);
        if (!this.isNew)
            this.buttons.list.push(this.controller.btnDelete);
        this.buttons.list.push(this.controller.btnSave);
        this.controller.btnDelete._visible = !this.isNew;
    }
}