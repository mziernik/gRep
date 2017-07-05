// @flow
'use strict';

import {React, Endpoint, Application, AppEvent, Utils, AppNode} from "../core";
import {Component, FontAwesome} from "../components";
import {Switch} from 'react-router-dom';
import Page from "./Page";


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

    constructor(title: string) {
        this.title = title;
        tabs.push(this);
        this.element = document.createElement("div");
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
        this.title = title;
        if (tabsBar)
            tabsBar.forceUpdate();
    }

    setCurrent() {
        if (this._removed || currentTab === this) return;
        if (currentTab)
            containerElement.removeChild(currentTab.element);
        containerElement.appendChild(this.element);
        currentTab = this;
        history.push(this);
        tabsBar.forceUpdate();
    }

    renderContent() {

        if (!containerElement) return null;

        const map = Endpoint.all.map((page: Endpoint, idx: number) => page.route(idx));
        const children = <Switch key={this.id}>{map}</Switch>;

        if (!this.node) {
            containerElement.appendChild(this.element);
            this.node = Application.render(children, this.element, this);
            return this.node;
        }

        this.node.forceUpdate();
    }


}


export default class PageContainer extends Component {


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

            <div className="app-page-container" ref={e => {
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

        if (tabs.length <= 1)
            return null;

        return <div
            style={{
                backgroundColor: "#303336",
                color: "#fff",
                paddingLeft: "4px"
            }}>
            { tabs.map((tab: PageTab) => <span
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
                       onClick={e => tab.close()} className={FontAwesome.TIMES}/>

            </span>)}
        </div>
    }
}