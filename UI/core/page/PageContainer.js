// @flow
'use strict';

import {React, Endpoint, Application, AppEvent, Utils, AppNode, Is, Check} from "../core";
import {Component, Icon} from "../components";
import {Switch} from 'react-router-dom';
import Page from "./Page";
import {ModalWindow} from "../component/ModalWindow";


const containers = [];
let containerElement: HTMLElement;
let pageContainer: PageContainer;
let tabsBar: TabsBar;
const tabs: PageTab[] = [];
let currentTab: PageTab;
const history: PageTab[] = [];

export class PageTab {
    title: string;
    key: string;
    id: string = Utils.randomId();
    node: AppNode;
    element: ?HTMLElement = null; // dla zakładki
    _removed: boolean = false;
    modal: boolean;
    currentURL: string;
    modalWindow: ModalWindow;

    constructor(key: string, title: string, modal: boolean = false) {
        this.title = title;
        this.modal = modal;
        this.key = key;
        tabs.push(this);
        if (modal) return;
        this.element = document.createElement("div");
        this.element.className = "app-page";
        this.element.setAttribute("data-page", key);
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

        if (this.currentURL && this.currentURL !== window.location.pathname) {
            window.history.replaceState(
                {},
                this.title,
                this.currentURL
            );
        }
    }

    renderContent() {

        if (!containerElement) return null;
        const children = <Switch key={this.id}>{Endpoint.routeMap()}</Switch>;

        if (!this.node)
            if (this.modal) {

                this.modalWindow = ModalWindow.create((mw: ModalWindow) => {
                    mw.content = children;
                    mw.closeButton = true;
                    mw.contentStyle = {
                        padding: "20px"
                    };
                    mw.onClose = (e: Event, result: boolean) => this.close() || true;
                });
                this.node = this.modalWindow.open(this);
            } else {
                containerElement.appendChild(this.element);
                this.node = Application.render(children, this.element, this);
            }
        else
            this.node.forceUpdate();

        this.currentURL = window.location.pathname;

        //    tabs.forEach((tab: PageTab) => Is.condition(tab.node === this.node, () => tab.onNavigate(this)));

        if (this.node.currentPage)
            this.node.element.setAttribute("data-page", this.node.currentPage.endpoint.key);
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
                            new PageTab(null, null).setCurrent();

                    currentTab.renderContent();
                }}>

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
            {tabs.map((tab: PageTab) => tab.modal ? null : <span
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
