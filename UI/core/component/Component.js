// @flow
'use strict';

import {React, PropTypes, Utils, If, AppNode} from "../core";
import * as ContextObject from "../application/ContextObject";

/**
 * Klasa bazowa, po której powinny dziedziczyć wszystkie komponenty pełniące role kontrolerów
 */

// $FlowFixMe
export default class Component<DefaultProps: any, Props: any, State: any>
    extends React.Component<*, *, *> {

    static contextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.instanceOf(AppNode).isRequired,
    };


    static defaultProps = {};

    _compoenntIsRendering: boolean = false;

    /** @type {AppNode}*/
    node: AppNode;
    /** Element drzewa dom, na którym bazuje komponent */
    element: HTMLElement;

    _onDestroy: [] = [];

    /** @type {string} Nazwa gałęzi - do celów deweloperskiech  */
    name: ?string = null;

    constructor(props: Object, context: Object, updater: Object) {
        super(...arguments);

        ContextObject.contextCreated(this);

        if (!props || typeof (props) !== "object" || !props.constructor || props.constructor.name !== "Object")
            throw new Error("Nieprawidłowe wywołanie konstruktora klasy " + this.constructor.name);

        if (!context || !context.router || !context.node)
            throw new Error("Nieprawidłowe wywołanie konstruktora klasy " + this.constructor.name);

        if (!updater || !updater.isMounted || !updater.enqueueCallback)
            throw new Error("Nieprawidłowe wywołanie konstruktora klasy " + this.constructor.name);

        this.node = this.context.node;

        this.roles = this.props.roles;
        if (!this.node && this instanceof AppNode)
        // $FlowFixMe
            this.node = (this: AppNode);
        if (!this.node)
            throw new Error("Brak zdefiniowanego modułu");

        this.name = Utils.className(this);

        this.node.components.push(this);
    }


    /** Podłączenie event listenera dla obiektu window z automatycznym usuwaniem w momencie zniszczenia komponentu*/
    addEventListener(name: string, func: () => void) {
        const callback = (...args) => func(...args);
        let res = window.addEventListener(name, callback);
        this.onDestroy(() => {
            window.removeEventListener(name, callback);
        });
    }

    /**
     * Utwórz komponent reacta (wykorzystywany w metodzie render)
     * @param type
     * @param props
     * @return {*}
     */
    create(type: string, props: ? Object) {

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

    toString() {
        return this.name;
    }

    renderChildren(children: ?any = null) {

        //ToDo weryfikacja poprawności danych
        return children || this.props.children;
    }


//
// componentWillUpdate(nextProps, nextState) {
//     debugger;
// }
//
// componentWillMount() {
//
// }


    onDestroy(callback: () => void): Component {
        If.isFunction(callback, () => this._onDestroy.push(callback));
        return this;
    }

    componentWillUnmount() {
        this.node.components.remove(this);
        ContextObject.contextDestroyed(this);
        this._onDestroy.forEach(func => func());
    }

    forceUpdate() {

        super.forceUpdate();
    }

    setState(object: ?Object) {
        super.setState(object);
    }

    componentWillReceiveProps() {

    }

    shouldComponentUpdate() {

        return true;
    }

    componentWillUpdate() {
        this._compoenntIsRendering = true;
    }

    render() {
        return null;
    }

    componentDidUpdate() {
        this._compoenntIsRendering = false;
    }


}

