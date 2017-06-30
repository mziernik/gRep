// @flow
'use strict';
import {React, Record, Repository, Endpoint, Utils, If} from "../core";
import {Component, Spinner} from "../components";

export default class Page extends Component {


    endpoint: Endpoint;

    constructor(scrollable: boolean) {
        super(...arguments);
        this.endpoint = this.props.route.endpoint;
        Utils.makeFinal(this, ["endpoint"])
    }

    /** Zwraca tru jeśli repozytoria [repos] zostały zainicjowane, w przeciwnym razie czeka na inicjalizację i wywołuje forceUpdate na stronie */
    waitForRepo(repos: Repository | Repository[], onReady: ?() => void = null): boolean {
        repos = If.isArray(repos) ? repos : [repos];
        const notReady: Repository[] = Utils.forEach(repos, (repo: Repository) => repo.isReady ? undefined : repo);
        if (notReady.isEmpty())
            return true;

        notReady.forEach((repo: Repository) => {
            repo.onChange.listen(this, () => {
                if (notReady.isEmpty())
                    return;
                notReady.remove(repo);
                if (notReady.isEmpty())
                    onReady ? onReady() : this.forceUpdate();
            });
        });
        return false;
    }
}



