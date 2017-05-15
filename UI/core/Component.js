// @flow
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Utils from "./utils/Utils";
import AppNode from "./Node";
import AppEvent, {EventHandler, EventType} from "./Event";

/**
 * Klasa bazowa, po której powinny dziedziczyć wszystkie komponenty pełniące role kontrolerów
 */

// $FlowFixMe
export default class Component<DefaultProps: any, Props: any, State: any>
    extends React.Component<DefaultProps, Props, State> {

    /** @type {AppNode}*/
    node: AppNode = this.context.node;
    element: HTMLElement;
    style: Object = {};

    constructor() {
        super(...arguments);

        if (!this.node && this instanceof AppNode)
        // $FlowFixMe
            this.node = (this: AppNode);
        if (!this.node)
            throw new Error("Brak zdefiniowanego modułu");
    }


    /**
     * Utwórz komponent reacta (wykorzystywany w metodzie render)
     * @param type
     * @param props
     * @return {*}
     */
    create(type: string, props: ?Object) {

        props = props || {};

        if (this.props && this.props.style) {
            // dodaj do styli zadeklarowanych w atrybutach te, które są we właściwościach
            props.style = props.style || {};
            for (let name in this.props.style)
                props.style[name] = this.props.style[name];
        }

        const ref = props.ref;

        props.ref = (elm) => {
            this.element = elm;
            if (ref)
                ref(elm);
        };

        return React.createElement(type, props, this.props.children);
    }


    //
    // componentWillUpdate(nextProps, nextState) {
    //     debugger;
    // }
    //
    // componentWillMount() {
    //
    // }

    /**
     * Deklaracja chęci obsługi zdarzeń danego typu
     * @param {EventType} type
     * @param {function} callback
     * @return {Component}
     */
    on(type: EventType, callback: (value: any, event: AppEvent) => any) {
        Utils.checkInstance(callback, "function");
        Utils.checkInstance(type, EventType);
        this.node.eventHandlers.push(new EventHandler(type, callback));
        return this;
    }

    /**
     * Wyślij zdarzenie do wszystkich komponentów bieżącej gałęzi
     * @param {EventType} type
     * @param {any}value
     * @return {AppEvent}
     */
    event(type: EventType, value: any): AppEvent {
        return new AppEvent(this, type, value);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.instanceOf(AppNode).isRequired,
        css: PropTypes.any
    };

    forceUpdate() {
        super.forceUpdate();
    }

}

