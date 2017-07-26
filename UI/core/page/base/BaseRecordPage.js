// @flow
'use strict';

import {React, Check, Record, Repository, CRUDE} from "../../core.js";
import Page from "../Page";
import RecordCtrl from "../../component/repository/RecordCtrl";

/** Klasa bazowa dla formatek edycji rekordu, parametrem jest zawsze id */
export default class BaseRecordPage extends Page {

    repo: Repository;
    isNew: boolean;
    record: Record;
    controller: RecordCtrl;
    afterSaveNavigate: string;

    constructor(repo: Repository | string, props: any, context: any, state: any) {
        super(props, context, state);

        Check.isDefined(this.props.id);

        const init = () => {
            this.isNew = this.props.id === "~new";
            this.repo = repo instanceof Repository ? repo : Repository.get(repo, true);
            this.record = this.isNew ? this.repo.createRecord(this) : this.repo.get(this, this.props.id, true);
            this.controller = new RecordCtrl(this, this.record, this.isNew ? CRUDE.CREATE : CRUDE.UPDATE);
        };

        if (this.requireRepo(repo, () => {
                init();
                this.forceUpdate(true);
            })) init();
    }
}