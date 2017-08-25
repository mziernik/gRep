import {React, EventType} from '../core';
import RepoPage from "../page/base/RepoPage";
import {RCONFIG} from "./ConfigRepo";
import RepoTable from "../component/repository/RepoTable";
import ConfigField from "./Config";

export default class PConfig extends RepoPage {

    constructor(props: Object, context: Object, updater: Object) {
        super(RCONFIG, props, context, updater);
    }

    render() {
        return <RepoTable
            modalEdit
            repository={RCONFIG}
        />
    }
}

new ConfigField("string", "test1", "test 1111", "sdgfdgsfdsoifdu fg98e98reu9f8ph9u");