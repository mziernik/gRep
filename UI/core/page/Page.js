// @flow
'use strict';
import {
    React,
    PropTypes,
    ReactUtils,
    ReactComponent,
    Repository,
    Endpoint,
    Utils,
    Is,
    EError,
    Dev,
    DEV_MODE,
    Ready,
    CRUDE,
    Record
} from "../core";
import {Component, Spinner, Panel, Icon} from "../components";
import ToolBar from "../component/ToolBar";
import {TitleBar} from "../component/TitleBar";
import WebApiRepoStorage from "../repository/storage/WebApiRepoStorage";
import {ModalWindow} from "../component/ModalWindow";
import {Btn} from "../component/Button";
import {Dynamic} from "../component/Component";

export default class Page extends Component {

    /** @private */
    __render: () => any;
    __error: EError;
    _toolBar: any;
    _waitingForRepo: boolean;

    title: string;

    endpoint: Endpoint = this.props.route.endpoint;

    _pageTitle: PageTitle = new PageTitle(this);
    icon: PageIcon = new PageIcon(this);
    buttons: PageButtons = new PageButtons(this);
    titleBar: PageTitleBar = new PageTitleBar(this);

    static pageTitleRenderer: (page: Page, title: string) => any = null;


    constructor() {
        super(...arguments);
        this.icon = this.endpoint._icon;
        this.title = this.endpoint._name;
        this._pageTitle.title = this.endpoint._name;
        this.node.currentPage = this;
        Utils.makeFinal(this, ["endpoint", "buttons"]);

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

                const result = this.__render();
                if (Is.array(result))
                    return <Panel fit>{result}</Panel>;
                return result;
            } catch (e) {
                Dev.error(this, e);
                return Page.renderError(e);
            }
        }
    }

    get modal(): ModalWindow {
        return this.node.tab ? this.node.tab.modalWindow : null;
    }

    renderTitle(title: ?string = null): ReactComponent {
        if (title)
            this.title = Utils.toString(title);

        title = this.title;
        document.title = title;

        if (this.node.tab)
            this.node.tab.setTitle(title);

        if (Page.pageTitleRenderer)
            return Page.pageTitleRenderer(this, title);

        const modal = this.modal;
        if (modal) {
            modal.title = title;
            return null;
        }

        return <TitleBar page={this} title={title} toolbar={() => this._toolBar}/>

    }

    renderToolBar(...items: Component): ReactComponent {
        this._toolBar = <ToolBar>{items}</ToolBar>;
        if (this.node.tab && this.node.tab.modalWindow)
            this.node.tab.modalWindow.buttons = items;

        return null;
    }


    /**
     * Zwraca tru jeśli repozytoria [repos] zostały zainicjowane, w przeciwnym razie czeka na inicjalizację i wywołuje forceUpdate na stronie
     * @param {Repository | String | function} repos (może to być również tablica)
     * @param {function} onReady
     * @param onChange
     * */

    requireRepo(repos: Repository | Repository[] | string | () => Repository, onReady: ?() => void = null,
                onChange: ?(crude: CRUDE, rec: Record, changes: Map) => void = null): ?Repository[] {

        let ready = false;

        const list: Repository[] = [];


        Ready.onReady(this, [WebApiRepoStorage], () => {

            list.addAll(Utils.forEach(Utils.asArray(repos),
                r => Is.func(r) ? r() : Is.string(r) ? Repository.get(r, true) : r));

            list.forEach((repo: Repository) => {

                repo.onChange.listen(this, data => {
                    if (this._waitingForRepo) return;
                    if (Is.func(onChange)) {
                        onChange(data.action, data.record, data.changed);
                        return;
                    }
                    if (data.action !== CRUDE.UPDATE)  // ignorujemy aktualizacje komórek - obsługiwane będą przez FCtrl
                        this.forceUpdate(true);
                })
            });

            ready = Ready.waitFor(this, list, () => {
                    this._waitingForRepo = false;
                    Is.func(onReady, f => f(list), () => this.forceUpdate(true));
                },
                (e: Error) => {
                    this.__error = new EError(e);
                    this.forceUpdate(true);
                }
            );

            if (ready && this._waitingForRepo) {
                this._waitingForRepo = false;
                Is.func(onReady, f => f(list), () => this.forceUpdate(true));
            }

        });

        this._waitingForRepo = !ready;
        return ready ? list : null;
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
            userSelect: "text"
        }}>
            <span>{Utils.toString(err.message)}</span>
        </div>
    }
}


export class PageIcon extends Dynamic {
    icon: Icon;

    constructor(page: Page) {
        super(() => <span className={"c-title-bar-icon " + this.icon}/>);
        this.icon = page.endpoint._icon;
    }
}


export class PageButtons extends Dynamic {

    buttons: Btn[] = [];

    constructor(page: Page) {
        super(() => <div>{Utils.toString(this.title)}</div>);
    }

}

export class PageTitle extends Dynamic {

    title: string;

    constructor(page: Page) {
        super(() => <h5>{Utils.toString(this.title)}</h5>);
        this.title = page.endpoint._name;
    }

}

/**
 * Pasek zawierający ikonę, tytuł oraz przyciski akcji
 */
export class PageTitleBar extends Dynamic {

    title: string;

    constructor(page: Page) {
        super(() => <div>{Utils.toString(this.title)}</div>);
    }

}

function CTitleBar(props) {
    return <div>0943093r5094320934</div>;

    /*
          page: PropTypes.any.isRequired, //Page
        title: PropTypes.string.isRequired,
        toolbar: PropTypes.func,
     */
    const items = this.props.toolbar ? this.props.toolbar() : null;

    if (this.node.tab && this.node.tab.modalWindow) {
        // const modal: ModalWindow = this.node.tab.modalWindow;
        // modal.buttons = items;
        // modal.title = this.props.title;
        return null;
    }

    const page: Page = this.props.page;

    return <div className="c-title-bar">
        {page.endpoint._icon ? <span className={"c-title-bar-icon " + page.endpoint._icon}/> : null}
        <h5>{this.props.title}</h5>

        <span style={{flex: "auto"}}/>

        {items}

        <hr style={{marginTop: "0"}}/>
    </div>

}


