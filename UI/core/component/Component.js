// @flow
'use strict';

import {React, ReactUtils, PropTypes, ReactComponent, Utils, If, AppNode, Check, Field} from "../core.js";
import * as ContextObject from "../application/ContextObject";

/**
 * Klasa bazowa, po której powinny dziedziczyć wszystkie komponenty pełniące role kontrolerów
 */


// $FlowFixMe
export default class Component<DefaultProps: any, Props: any, State: any>
    extends ReactComponent<*, *, *> {

    /** @private */
    __render: () => any;

    static contextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.instanceOf(AppNode).isRequired,
    };

    static propTypes = {
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
    };

    static defaultProps = {
        ignore: false
    };

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

        this.__render = this.render;

        this.render = () => {
            if (this.props.ignore)
                return null;
            try {
                return this.__render();
            } catch (e) {
                throw e;
            }
        }
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

    renderChildren(children: ?any = null, onlyOne: boolean = false,) {

        Check.isBoolean(onlyOne);


        children = children || this.props.children;
        if (onlyOne) {
            if (children instanceof Array) {
                children = Utils.forEach(children, el => typeof el === "string" && el.trim() === "" ? undefined : el);
                if (children.length > 1)
                    throw new Error("Nieprawidłowa liczba elementów");
                return children[0];
            }
            children = React.Children.only(children);
        }

        const process = (child: any) => {

            if (child instanceof Field)
                return (child: Field).displayValue;

            // if (!If.isString(child) && !ReactUtils.isReactElement(child))
            //     debugger;

            return child;
        };

        if (children instanceof Array)
            return Utils.forEach(children, c => process(c))


        return process(children);
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


    componentDidUpdate() {
        this._compoenntIsRendering = false;
    }


}

