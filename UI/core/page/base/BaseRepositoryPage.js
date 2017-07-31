// @flow

import {React, Repository, Endpoint, Is, Record} from "../../core.js";
import {Page, Panel, Icon, Button} from "../../components.js";
import RepoTable from "../../component/repository/RepoTable";
import {object} from "../../utils/Is";

export default class BaseRepositoryPage extends Page {

    repo: Repository;
    recordEndpoint: Endpoint;
    buttons: [] = [];

    constructor(repository: Repository, recordEndpoint: Endpoint, props: Object, context: Object, updater: Object) {
        super(props, context, updater);
        this.repo = repository;
        this.recordEndpoint = recordEndpoint;
        const list: Repository[] = this.requireRepo(repository, (repos: Repository[]) => {
            if (!this.repo || !(this.repo instanceof Repository))
                this.repo = repos[0];
            this.forceUpdate(true);
        });
        if (list && (!this.repo || !(this.repo instanceof Repository)))
            this.repo = list[0];
    }

    navigate(rec: Record, e: Event) {
        this.recordEndpoint.navigate({id: rec.pk}, e);
    }

    render() {
        return [
            this.renderTitle(this.title),
            this.renderToolBar([...this.buttons,
                <Button type="primary" icon={Icon.USER_PLUS}
                        link={this.recordEndpoint.getLink({id: "~new", ...this.endpointParams})}>Dodaj</Button>]),
            <RepoTable repository={this.repo} onClick={(...args) => this.navigate(...args)}/>
        ]
    }
}

