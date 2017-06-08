// @flow
'use strict';

import {React, ReactDOM, PropTypes, AppNode, AppEvent, Utils, Dispatcher} from "../core";
import {BrowserRouter} from 'react-router-dom';

export const onCreate: Dispatcher = new Dispatcher();

export default class Application extends React.Component {

    /** @type {AppNode[]} */
    static nodes: AppNode[] = [];

    context: Application;

    /** @type {Application} */
    static instance: ?Application = null;

    static initialized: boolean = false;


    /**
     * ReactDOM.render
     * @param {Component} child
     * @param {HTMLElement|string} element
     * @return {AppNode}
     */
    static render(child: React.Component<*, *, *>, element: ?HTMLElement | ?string, name: ?string = null): AppNode {

        if (!Application.initialized) {
            ReactDOM.render(<BrowserRouter><Application/></BrowserRouter>, document.createElement("span"));
            Application.initialized = true;
            onCreate.dispatch(this);
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

        name = name || Utils.className(child.type);

        const node: AppNode = ReactDOM.render(<AppNode element={element}>{child}</AppNode>, element);
        node.ownHtmlNode = own;
        node.name = node.name || name;
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

    componentWillUpdate() {
        AppEvent.APPLICATION__BEFORE_UPDATE.send(this);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.instanceOf(AppNode)
    }
}

export const DEV_MODE = process && process.env ? process.env.NODE_ENV !== 'production' : false;

Object.preventExtensions(Application);

