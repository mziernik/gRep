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
import Busy from "../component/Busy";

export default class Page extends Component {

    static propTypes = {
        modal: PropTypes.any // ModalWindow
    };

    /** @private */
    __render: () => any;
    __error: EError;
    _waitingForRepo: boolean;


    endpoint: ?Endpoint = this.props.route ? this.props.route.endpoint : null;

    title: PageTitle = new PageTitle(this);
    icon: PageIcon = new PageIcon(this);
    buttons: PageButtons = new PageButtons(this);
    titleBar: PageTitleBar = new PageTitleBar(this);


    constructor() {
        super(...arguments);
        this.node.currentPage = this;
        Utils.makeFinal(this, ["endpoint", "buttons", "title", "icon", "buttons", "titleBar"]);
        this.node.componentsStack.length = 0;

        const modal: ModalWindow = this.modal;

        if (modal)
            this.titleBar._render = () => {
                modal.buttons = this.buttons;
                modal.icon.set(this.icon.value);
                modal.title.set(this.title.value);
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
                    return <Busy fit label="Proszę czekać..."/>;

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
        return this.props.modal || (this.node.tab ? this.node.tab.modalWindow : null);
    }

    static renderError(context: any, e: string | Error | EError) {

        const err: EError = new EError(e);

        const comp: Component = context instanceof Component ? context : null;

        return <div style={{
            marginTop: "10%",
            textAlign: "center",
            userSelect: "text"
        }}>
            <div style={{
                fontWeight: "bold",
            }}>{Utils.className(context)}</div>
            <div>{comp && comp.node && comp.node.componentsStack ? comp.node.componentsStack.map((c: Component) => c.name).join(", ") : null}</div>
            <div style={{
                fontSize: "20pt",
                fontWeight: "bold",
                color: "#c00",
            }}>{Utils.toString(err.message)}</div>
        </div>
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
}


export class PageIcon extends Dynamic<Icon> {
    constructor(page: Page) {
        super(page.endpoint ? page.endpoint._icon : page.modal ? page.modal.icon : null,
            v => v ? <span className={"c-title-bar-icon " + v}/> : null);
    }
}


export class PageButtons extends Dynamic {

    list: Btn[] = [];
    style: Object;

    constructor() {
        super(null, () => <div
            className="c-title-bar-buttons"
            style={{...this.style}}>{Utils.forEach(this.list, (btn: Btn) => {
            if (!btn._key)
                btn._key = Utils.randomId();
            return btn.$
        })}</div>);
    }

    remove(btn: Btn) {
        this.list.remove(btn);
    }

    insert(config: Btn | (button: Btn) => void): Btn {
        const btn = new Btn(config);
        this.list.unshift(btn);
        this.update(true);
        return btn;
    }

    add(config: Btn | (button: Btn) => void): Btn {
        const btn = new Btn(config);
        this.list.push(btn);
        this.update(true);
        return btn;
    }

}

export class PageTitle extends Dynamic<string> {

    constructor(page: Page) {
        super(page.endpoint ? page.endpoint._name : page.modal ? page.modal.title.value : null,
            v => <h5>{Utils.toString(v)}</h5>);
    }

    set(title: string) {
        super.set(title);
        document.title = title;
    }

}

/**
 * Pasek zawierający ikonę, tytuł oraz przyciski akcji
 */
export class PageTitleBar extends Dynamic {

    visible: boolean = true;

    constructor(page: Page) {
        super(null, () => !this.visible ? null : <div className="c-title-bar">
            <div>
                {page.icon.$}
                {page.title.$}
                <span style={{flex: "auto"}}/>
                {page.buttons.$}
            </div>
            <hr style={{marginTop: "0"}}/>
        </div>);
    }

}
