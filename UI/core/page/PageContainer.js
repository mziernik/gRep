// @flow
'use strict';

import {React, Endpoint, Application, AppEvent, Utils, AppNode, If, Check} from "../core";
import {Component, Icon} from "../components";
import {Switch} from 'react-router-dom';
import Page from "./Page";
import {ModalWindow} from "../component/ModalWindow";
import * as E from "../application/Endpoint";


const containers = [];
let containerElement: HTMLElement;
let pageContainer: PageContainer;
let tabsBar: TabsBar;
const tabs: PageTab[] = [];
let currentTab: PageTab;
const history: PageTab[] = [];

export class PageTab {
    title: string;
    id: string = Utils.randomId();
    node: AppNode;
    element: HTMLElement;
    _removed: boolean = false;
    modal: boolean;

    constructor(title: string, modal: boolean = false) {
        this.title = title;
        this.modal = modal;
        tabs.push(this);
        this.element = document.createElement("div");
        this.element.className = "app-tabs-page";
        const s = this.element.style;
        s.position = "relative";
        s.width = "100%";
        s.height = "100%";
    }

    close() {
        if (tabs.length === 1) return;

        this._removed = true;
        history.remove(this);
        tabs.remove(this);

        if (currentTab === this) {
            let tab: PageTab = history[history.length - 1];
            if (tab) {
                tab.setCurrent();
                return;
            }
        }

        tabsBar.forceUpdate();
    }

    setTitle(title: string) {
        if (title === this.title) return;

        this.title = title;
        if (tabsBar)
            tabsBar.forceUpdate();
    }

    setCurrent() {
        if (this._removed || currentTab === this) return;

        if (currentTab && !this.modal && !currentTab.modal)
            containerElement.removeChild(currentTab.element);

        if (!this.modal)
            containerElement.appendChild(this.element);

        currentTab = this;
        history.push(this);
        tabsBar.forceUpdate();
    }

    renderContent() {

        if (!containerElement) return null;
        const children = <Switch key={this.id}>{Endpoint.routeMap()}</Switch>;

        if (!this.node) {
            if (this.modal) {
                this.node = children;
                ModalWindow.create((mw: ModalWindow) => {
                    mw.content = this.node;
                    mw.closeButton = true;
                    //       mw.icon = null;
                    mw.onClose = (e: Event, result: boolean) => this.close() || true;
                }).open();
            } else {
                containerElement.appendChild(this.element);
                this.node = Application.render(children, this.element, this);
            }
            return this.node;
        }

        this.node.forceUpdate();
    }


}


export default class PageContainer extends Component {

    /** Pzy najbliższym żądaniu, nawigacja zostanie skierowana do okna modalnego*/
    static _navigateToModal: ?string = null;


    constructor() {
        super(...arguments);
        pageContainer = this;

        // zmienił się URL strony, odśwież kontener
        AppEvent.APPLICATION__BEFORE_UPDATE.listen(this, () => currentTab.renderContent());
    }


    render() {

        return <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }}>
            <TabsBar/>

            <div
                className="app-page-container"
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%"
                }}
                ref={e => {
                    if (containerElement)
                        return;
                    containerElement = e;
                    if (!currentTab)
                        if (tabs.length)
                            tabs[0].setCurrent();
                        else
                            new PageTab(null).setCurrent();

                    currentTab.renderContent();
                } }>

            </div>
        </div>
    }
};

class TabsBar extends Component {

    constructor() {
        super(...arguments);
        tabsBar = this;
    }


    render() {

        let tabsCount = 0;
        tabs.forEach((tab: PageTab) => tabsCount += tab.modal ? 0 : 1);

        if (tabsCount <= 1)
            return null;

        return <div
            style={{
                backgroundColor: "#303336",
                color: "#fff",
                paddingLeft: "4px"
            }}>
            { tabs.map((tab: PageTab) => tab.modal ? null : <span
                key={tab.id}
                style={{
                    fontSize: "13px",
                    display: "inline-block",
                    padding: "4px 8px",
                    margin: "2px 2px 0 2px",
                    cursor: "pointer",
                    color: "#333",
                    // borderLeft: "1px solid #000",
                    // borderTop: "1px solid #000",
                    // borderRight: "1px solid #000",
                    backgroundColor: currentTab === tab ? "#ddd" : "#aaa",
                    borderRadius: "4px 4px 0 0"
                }}
                onClick={e => tab.setCurrent()}
            >
                <span style={{
                    display: "inline-block",
                    minWidth: "100px",
                }}>{tab.title}</span>
                 <span style={{
                     padding: "5px",
                     margin: "-5px"
                 }}
                       onClick={e => tab.close()} className={Icon.TIMES}/>

            </span>)}
        </div>
    }
}


Endpoint.navigate = (link: string, target: string | MouseEvent = null) => {
    if (target && target.ctrlKey !== undefined && target.shiftKey !== undefined)
        target = (target: MouseEvent).ctrlKey ? "tab" : (target: MouseEvent).shiftKey ? "popup" : null;

    if (!target) target = null;

    Check.oneOf(target, [null, E.ENDPOINT_TARGET_TAB, E.ENDPOINT_TARGET_POPUP]);

    if (target === E.ENDPOINT_TARGET_TAB)
        new PageTab(this._name, false).setCurrent();

    if (target === E.ENDPOINT_TARGET_POPUP)
        new PageTab(this._name, true).setCurrent();

    Application.router.history.push(link);
};