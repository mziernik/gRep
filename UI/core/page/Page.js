// @flow
'use strict';
import {
    React,
    PropTypes,
    ReactComponent,
    Repository,
    Endpoint,
    Utils,
    If,
    EError,
    Debug,
    DEV_MODE,
    Ready,
    CRUDE,
    Record
} from "../core";
import {Component, Spinner, Panel} from "../components";
import ToolBar from "../component/ToolBar";
import {TitleBar} from "../component/TitleBar";
import WebApiRepoStorage from "../repository/storage/WebApiRepoStorage";

export default class Page extends Component {

    /** @private */
    __render: () => any;
    __error: EError;
    _toolBar: any;
    _waitingForRepo: boolean;

    static pageTitleRenderer: (page: Page, title: string) => any = null;
    endpoint: Endpoint;

    constructor(scrollable: boolean) {
        super(...arguments);
        this.endpoint = this.props.route.endpoint;
        Utils.makeFinal(this, ["endpoint"]);

        this.render = () => {
            try {
                this.node.currentPage = this;
                if (this.__error)
                    try {
                        return Page.renderError(this.__error);
                    } catch (e) {
                        window.console.error(e);
                    }

                if (this._waitingForRepo)
                    return <div>Oczekiwanie na gotowość repozytorium</div>;

                return this.__render();
            } catch (e) {
                Debug.error(this, e);
                return Page.renderError(e);
            }
        }
    }

    renderTitle(title: string): ReactComponent {

        title = Utils.toString(title);
        document.title = title;
        if (this.node.tab)
            this.node.tab.setTitle(title);

        if (Page.pageTitleRenderer)
            return Page.pageTitleRenderer(this, title);

        return <TitleBar page={this} title={title} toolbar={() => this._toolBar}/>

    }

    renderToolBar(...items: Component): ReactComponent {
        this._toolBar = <ToolBar>{items}</ToolBar>;
        return null;
    }

    /**
     * Zwraca tru jeśli repozytoria [repos] zostały zainicjowane, w przeciwnym razie czeka na inicjalizację i wywołuje forceUpdate na stronie
     * @param {Repository | String | function} repos (może to być również tablica)
     * @param {function} onReady
     * */

    requireRepo(repos: Repository | Repository[] | string | () => Repository, onReady: ?() => void = null,
                onChange: ?(crude: CRUDE, rec: Record, changes: Map) => void = null): boolean {

        let ready = false;


        Ready.onReady(this, [WebApiRepoStorage], () => {

            const list: Repository[] = Utils.forEach(Utils.asArray(repos), r => If.isFunction(r) ? r()
                : If.isString(r) ? Repository.get(r, true) : r);

            list.forEach((repo: Repository) => {

                repo.onChange.listen(this, (action: CRUDE, rec: Record, changes: Map) => {
                    if (this._waitingForRepo) return;
                    if (If.isFunction(onChange)) {
                        onChange(action, rec, changes);
                        return;
                    }
                    if (action !== CRUDE.UPDATE)  // ignorujemy aktualizacje komórek - obsługiwane będą przez FCtrl
                        this.forceUpdate(true);
                })
            });

            ready = Ready.waitFor(this, list, () => {
                    this._waitingForRepo = false;
                    If.isFunction(onReady, f => f(), () => this.forceUpdate());
                },
                (e: Error) => {
                    this.__error = new EError(e);
                    this.forceUpdate(true);
                }
            );

        });

        this._waitingForRepo = !ready;
        return ready;
    }


    componentWillMount() {
        super.componentWillMount();
        //  this._watcher.watch(true);
    }

    componentDidMount() {
        super.componentDidMount();
        //   this._watcher.watch(false);
    }

    componentWillUpdate() {
        super.componentWillUpdate();
        //   this._watcher.watch(true);
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        //    this._watcher.watch(false);
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
            <span>{Utils.toString(err.message)}</span>
        </div>
    }
}



