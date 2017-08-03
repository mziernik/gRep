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


    endpoint: Endpoint = this.props.route.endpoint;

    title: PageTitle = new PageTitle(this);
    icon: PageIcon = new PageIcon(this);
    buttons: PageButtons = new PageButtons(this);
    titleBar: PageTitleBar = new PageTitleBar(this);


    constructor() {
        super(...arguments);
        this.node.currentPage = this;
        Utils.makeFinal(this, ["endpoint", "buttons", "title", "icon", "buttons", "titleBar"]);

        const modal: ModalWindow = this.modal;

        if (modal)
            this.titleBar._render = () => {
                modal.buttons = this.buttons;
                modal.icon = this.icon.icon;
                modal.title = this.title._title;
                return null;
            };

        this.render = () => {
            try {
                this.node.currentPage = this;
                if (this.__error)
                    try {
                        return Page.renderError(this, this.__error);
                    } catch (e) {
                        window.console.error(e);
                    }

                if (this._waitingForRepo)
                    return <div>Oczekiwanie na gotowość repozytorium</div>;

                const result = this.__render();
                //       if (Is.array(result))
                return <Panel fit>
                    {this.titleBar.$}
                    {result}
                </Panel>;

            } catch (e) {
                Dev.error(this, e);
                return Page.renderError(this, e);
            }
        }
    }

    get modal(): ModalWindow {
        return this.node.tab ? this.node.tab.modalWindow : null;
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

    static renderError(context: any, e: string | Error | EError) {

        const err: EError = new EError(e);

        return <div style={{
            marginTop: "10%",
            textAlign: "center",
            fontSize: "20pt",
            fontWeight: "bold",
            color: "#c00",
            userSelect: "text"
        }}>
            <div>{Utils.className(context)}</div>
            <div>{Utils.toString(err.message)}</div>
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
    style: Object;

    constructor() {
        super(() => <div
            style={{float: "right", ...this.style}}>{Utils.forEach(this.buttons, (btn: Btn) => btn.$)}</div>);
    }

    insert(config: Btn | (button: Btn) => void): Btn {
        const btn = new Btn(config);
        this.buttons.unshift(btn);
        return btn;
    }

    add(config: Btn | (button: Btn) => void): Btn {
        const btn = new Btn(config);
        this.buttons.push(btn);
        return btn;
    }

}

export class PageTitle extends Dynamic {

    _title: string;

    constructor(page: Page) {
        super(() => <h5>{Utils.toString(this._title)}</h5>);
        this._title = page.endpoint._name;
    }

    set (title: string) {
        this._title = title;
        document.title = title;
    }

}

/**
 * Pasek zawierający ikonę, tytuł oraz przyciski akcji
 */
export class PageTitleBar extends Dynamic {

    title: string;

    constructor(page: Page) {
        super(() => <div className="c-title-bar">
            {page.icon.$}
            {page.title.$}
            <span style={{flex: "auto"}}/>
            {page.buttons.$}
            <hr style={{marginTop: "0"}}/>
        </div>);
    }

}
