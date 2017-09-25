// @flow
'use strict';

import {React, ReactComponent, ReactDOM, PropTypes, AppNode, AppEvent, Utils, Dispatcher} from "../core.js";
import {BrowserRouter} from 'react-router-dom';
import {PageTab} from "../page/PageContainer";
import {object} from "../utils/Is";

export const onCreate: Dispatcher = new Dispatcher();

export default class Application extends ReactComponent {

    /** @type {AppNode[]} */
    static nodes: AppNode[] = [];
    static router: Object = null;

    context: Application;

    /** @type {Application} */
    static instance: ?Application = null;
    /** Bie¿¹ca lokalizacja */
    static location: ?Location = null;
    static initialized: boolean = false;

    /**
     * ReactDOM.render
     * @param {Component} child
     * @param {HTMLElement|string} element
     * @return {AppNode}
     */
    static render(child: React.Component<*, *, *>, element: ?HTMLElement | ?string, tab: PageTab): AppNode {

        if (!Application.initialized) {
            ReactDOM.render(<BrowserRouter ref={e => Application.router = e}>
                <Application/></BrowserRouter>, document.createElement("span"));
            Application.initialized = true;
            onCreate.dispatch(this, {child: child, element: element});
        }

        let own = false;
        if (!element) {
            element = document.createElement("span");
            own = true;
        }

        if (!(element instanceof HTMLElement))
            element = window.document.querySelector(element);

        if (!element)
            throw new Error("Nie znaleziono elementu");


        const node: AppNode = ReactDOM.render(<AppNode tab={tab} element={element}>{child}</AppNode>, element);
        node.ownHtmlNode = own;
        node.name = Utils.className(child.type);
        Application.nodes.push(node);
        return node;
    }


    static getContext(): Object {
        // $FlowFixMe
        return Application.instance.context;
    }

    constructor() {
        super(...arguments);
        Application.instance = this;
    }

    render() {
        return null;
    }

    componentWillMount() {
        Application.location = new Location(this.context.router.route.location);
    }

    componentWillUpdate() {
        const loc: Location = new Location(this.context.router.history.location);
        if (loc.pathname === Application.location.pathname && loc.search === Application.location.search)
            AppEvent.APPLICATION__HASH_CHANGE.send(this);
        else
            AppEvent.APPLICATION__LOCATION_CHANGE.send(this);
        Application.location = loc;
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.instanceOf(AppNode)
    }
}

let previousURL: string;

export const DEV_MODE = process && process.env ? process.env.NODE_ENV !== 'production' : false;
Object.preventExtensions(Application);

export class Location {
    hash: string;
    key: string;
    pathname: string;
    search: string;
    state: Object;

    constructor(loc) {
        this.hash = loc.hash;
        this.key = loc.key;
        this.pathname = loc.pathname;
        this.search = loc.search;
        this.state = loc.state;
    }
}