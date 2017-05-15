// @flow
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {BrowserRouter} from 'react-router-dom';
import AppNode from "./Node";
import AppEvent from "./Event";
//import {Component as ReactComponent} from 'react';
/** @type {function[]} */
const beforeUpdate: (() => void)[] = [];

export default class Application extends React.Component {

    /** @type {AppNode[]} */
    static nodes: AppNode[] = [];

    /** @type {Application} */
    static instance: ?Application = null;

    static initialized: boolean = false;


    /**
     * ReactDOM.render
     * @param {Component} child
     * @param {HTMLElement|string} element
     * @return {AppNode}
     */
    static render(child: React.Component<*, *, *>, element: Node): AppNode {

        if (!Application.initialized) {
            ReactDOM.render(<BrowserRouter><Application/></BrowserRouter>, document.createElement("span"));
            Application.initialized = true;
        }

        let own = false;
        if (!element) {
            element = document.createElement("span");
            own = true;
        }

        if (!(element instanceof HTMLElement))
            element = window.document.querySelector(element);

        const appNode: AppNode = ReactDOM.render(<AppNode element={element}>{child}</AppNode>, element);
        appNode.ownHtmlNode = own;
        Application.nodes.push(appNode);
        return appNode;
    }


    static getContext(): Object {
        // $FlowFixMe
        return Application.instance.context;
    }

    static beforeUpdate(callback: () => void) {
        if (typeof callback === "function")
            beforeUpdate.push(callback);
    }

    /**
     * Zaktualizuj wszystkie komponenty
     */

    static updateAll(): void {
        beforeUpdate.forEach(callback => callback());
        Application.nodes.forEach(node => {
            if (node.canUpdate)
                node.forceUpdate();
        });
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
        // zmienił się URL, przerysuj wszystko
        Application.updateAll();
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.instanceOf(AppNode)
    }
}

Object.preventExtensions(Application);

