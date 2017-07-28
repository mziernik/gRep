// @flow

import {React, Repository, Endpoint, Is} from "../../core.js";
import {Page, Panel, Icon, Button} from "../../components.js";
import RepoTable from "../../component/repository/RepoTable";

export default class BaseRepositoryPage extends Page {

    repo: Repository;
    recordEndpoint: Endpoint;
    endpointParams: Object;
    buttons: [] = [];

    constructor(repository: Repository, endpoint: Endpoint, name: string, props: Object, context: Object, updater: Object) {
        super(props, context, updater);
        this.repo = repository;
        this.title = name;
        this.recordEndpoint = endpoint;
        const list: Repository[] = this.requireRepo(repository, (repos: Repository[]) => {
            if (!this.repo || !(this.repo instanceof Repository))
                this.repo = repos[0];
            this.forceUpdate(true);
        });
        if (list && (!this.repo || !(this.repo instanceof Repository)))
            this.repo = list[0];
    }

    render() {
        return [
            this.renderTitle(this.title),
            this.renderToolBar([...this.buttons,
                <Button type="primary" icon={Icon.USER_PLUS}
                        link={this.recordEndpoint.getLink({id: "~new", ...this.endpointParams})}>Dodaj</Button>]),
            <RepoTable repository={this.repo} endpoint={this.recordEndpoint} endpointParams={this.endpointParams}/>
        ]
    }
}

