// @flow
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Application from "./Application";
import {EventHandler} from "./Event";
import AppEvent from "./Event";

/**
 * Klasa będąca rootem dla struktury komponentów w danej strukturze aplikacji
 */

export default class AppNode extends React.Component {

    /** @type {EventHandler[]} */
    eventHandlers = [];
    /** * @type {HTMLElement} - Element drzewa dom */
    element: HTMLElement = this.props.element;
    /** @type {boolean} czy można odbierać żądania aktualizacji komponentów oraz zdarzenia  */
    canUpdate = true;

    /**
     * Czy gałąź, na której bazuje widok jest własnością widoku (zostanie usunięta razem z nim)
     * @type {boolean}
     */
    ownHtmlNode: boolean = false;

    constructor() {
        super(...arguments);
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

    /**
     * Roześlij zdarzenie do wszystkich komponentów potomnych
     * @param {AppEvent} event
     */
    dispatchEvent(event: AppEvent): void {

        this.eventHandlers.forEach(handler => {
            if (handler.type === event.type) {

                if (typeof event.canHandle === "boolean" && !event.canHandle)
                    return;

                if (typeof event.canHandle === "function") {
                    let result = event.canHandle();
                    if (typeof result !== "boolean")
                        throw new Error("Rezultat [event.canHandle] musi być typu boolean");
                    if (!result)
                        return;
                }
                handler.callback(event.value, event);
                event.handlers.push(handler);
            }
        });
    }

    static childContextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.instanceOf(AppNode).isRequired
    };

    static propTypes = {
        element: PropTypes.instanceOf(HTMLElement).isRequired
    };
}
