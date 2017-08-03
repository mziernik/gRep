// @flow

import {React, Repository, Endpoint, Is, Record} from "../../core.js";
import {Page, Panel, Icon, Button} from "../../components.js";
import RepoTable from "../../component/repository/RepoTable";
import {object} from "../../utils/Is";
import {Btn} from "../../component/Button";
import RepoPage from "./RepoPage";

export default class BaseRepositoryPage extends RepoPage {


    recordEndpoint: Endpoint;
    modalEdit: boolean;
    defaultTarget: string = null; //tab, popup

    constructor(repository: Repository, recordEndpoint: Endpoint, props: Object, context: Object, updater: Object) {
        super(repository, props, context, updater);
        this.recordEndpoint = recordEndpoint;

        this.buttons.add((btn: Btn) => {
            btn.type = "primary";
            btn.text = "Dodaj";
            btn.icon = Icon.USER_PLUS;
            btn.onClick = e => this.navigate(null, this.defaultTarget || e);
        })
    }

    navigate(rec: Record, e: Event) {
        this.recordEndpoint.navigate({id: rec ? rec.pk : "~new"}, this.defaultTarget || e);
    }

    render() {
        return <RepoTable
            modalEdit={this.modalEdit}
            repository={this.repo}
            onClick={(...args) => this.navigate(...args)}
        />
    }
}

