// @flow

import {React, Repository, Endpoint, Is, Record} from "../../core.js";
import {Page, Panel, Icon, Button} from "../../components.js";
import RepoTable from "../../component/repository/RepoTable";
import {object} from "../../utils/Is";
import {Btn} from "../../component/Button";

export default class RepoPage extends Page {

    repo: Repository;

    constructor(repository: Repository | string, props: Object, context: Object, updater: Object) {
        super(props, context, updater);
        this.repo = repository;
        const list: Repository[] = this.requireRepo(repository, (repos: Repository[]) => {
            if (!this.repo || !(this.repo instanceof Repository))
                this.repo = repos[0];
            this.onReady(this.repo, repos);
            this.forceUpdate(true);
        });
        if (list && (!this.repo || !(this.repo instanceof Repository)))
            this.repo = list[0];

        if (list)
            this.onReady(this.repo, list);
    }

    /** Repozytorium jest gotowe (zainicjowane), można na nim operować*/
    onReady(repo: Repository, list: Repository[]) {
    }

}

