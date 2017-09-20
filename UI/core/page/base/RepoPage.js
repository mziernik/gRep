// @flow

import {React, Repository, Endpoint, Is, Record, CRUDE} from "../../core.js";
import {Page, Panel, Icon, Button} from "../../components.js";
import RepoTable from "../../component/repository/RepoTable";
import {object} from "../../utils/Is";
import {Btn} from "../../component/Button";
import RepoCtrl from "../../component/repository/RepoCtrl";
import {Utils} from "../../$utils";
import {MenuItem, PopupMenu} from "../../component/PopupMenu";
import RepoAction from "../../repository/RepoAction";
import Alert from "../../component/alert/Alert";
import ParamsWindow from "./ParamsWindow";
import Spinner from "../../component/Spinner";
import StatusHint from "../../component/application/StatusHint";
import AppStatus from "../../application/Status";
import RepoActions from "./RepoActions";


export default class RepoPage extends Page {

    repo: Repository;

    constructor(repository: Repository | string, props: Object, context: Object, updater: Object) {
        super(props, context, updater);
        this.repo = repository;

        let called = false;
        const callOnReady = (list: Repository[]) => {
            if (called) return;
            this.whenComponentIsReady.listen(this, () => this.onReady(this.repo, list));
            called = true;
        };

        const list: Repository[] = this.requireRepo(repository, (repos: Repository[]) => {
            if (!this.repo || !(this.repo instanceof Repository))
                this.repo = repos[0];
            callOnReady(repos);
            // this.onReady(this.repo, repos);
            this.forceUpdate(true);
        });
        if (list && (!this.repo || !(this.repo instanceof Repository)))
            this.repo = list[0];

        if (list)
            callOnReady(list);
    }

    waitForRepoCallback(record: Record) {

    }

    /** Repozytorium jest gotowe (zainicjowane), można na nim operować*/
    onReady(repo: Repository, list: Repository[]) {

    }

    renderActionButtons(record: Record): Btn[] {
        Utils.forEach(new RepoActions(this.repo, record).renderButtons(), btn => this.buttons.list.push(btn));
        this.buttons.update(true);
    }

}

