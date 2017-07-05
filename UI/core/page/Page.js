// @flow
'use strict';
import {React, Record, Repository, Endpoint, Utils, If, EError, Debug} from "../core";
import {Component, Spinner, Panel} from "../components";

export default class Page extends Component {


    static pageTitleRenderer: (page: Page, title: string) => any = null
    endpoint: Endpoint;

    constructor(scrollable: boolean) {
        super(...arguments);
        this.endpoint = this.props.route.endpoint;
        Utils.makeFinal(this, ["endpoint"]);
    }

    renderTitle(title: string) {

        title = Utils.toString(title);
        document.title = title;
        if (this.node.tab)
            this.node.tab.setTitle(title);

        if (Page.pageTitleRenderer)
            return Page.pageTitleRenderer(this, title);

        return <div>
            <h5 style={ {
                color: "#39b",
                fontWeight: "bold",
                padding: "10px 0 0 20px"
            } }>{title}</h5>
            <hr style={ {marginTop: "0"} }/>
        </div>
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

    draw() {
        return null;
    }

    render() {

        try {
            return this.draw();
        } catch (e) {
            Debug.error(this, e);
            return Page.renderError(e);
        }

    }

    static renderError(e: string | Error | EError) {

        const err: EError = new EError(e);

        return <div style={{
            marginTop: "10%",
            textAlign: "center",
            fontSize: "20pt",
            fontWeight: "bold",
            color: "#c00",
        }}>
            <span>{err.message}</span>
        </div>
    }
}



