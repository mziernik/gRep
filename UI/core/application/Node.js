// @flow
'use strict';

import {React, ReactComponent, ReactDOM, PropTypes, Application} from "../core";
import {Component, Page} from "../components";
import {PageTab} from "../page/PageContainer";


//
// import React from 'react';
// import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
// import Application from "./Application";
// import Component from "../component/Component";


/**
 * Klasa będąca rootem dla struktury komponentów w danej strukturze aplikacji
 */

export default class AppNode extends ReactComponent {


    static  propTypes = {
        tab: PropTypes.instanceOf(PageTab),
    };

    /** ostatnio wyrenderowana strona */
    currentPage: Page;

    /** * @type {HTMLElement} - Element drzewa dom */
    element: HTMLElement = this.props.element;

    /** @type {string} Nazwa gałęzi - do celów deweloperskich  */
    name: ?string = null;

    /** @type {Component} Lista wszystkich komponentów aktualnie wyświetlanych w danej gałęzi  */
    components: Component[] = [];

    /**
     * Czy gałąź, na której bazuje widok jest własnością widoku (zostanie usunięta razem z nim)
     * @type {boolean}
     */
    ownHtmlNode: boolean = false;

    tab: PageTab;

    constructor() {
        super(...arguments);
        this.tab = this.props.tab;
    }


    /**
     * Wymagane w połączeniu z static childContextTypes
     * @return {*}
     */
    getChildContext() {
        const ctx = Application.getContext();
        ctx.node = this;
        return ctx;
    }


    render() {
        return this.props.children || null;
    }

    remove() {
        Application.nodes.splice(Application.nodes.indexOf(this), 1);
        ReactDOM.unmountComponentAtNode(this.element);
        if (this.ownHtmlNode)
            this.element.remove();
    }


    forceUpdate() {
        super.forceUpdate();
    }


    static childContextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.instanceOf(AppNode).isRequired
    };

    static propTypes = {
        element: PropTypes.instanceOf(HTMLElement).isRequired
    };
}
