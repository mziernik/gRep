// @flow
'use strict';

import {Utils, Is, Check, Field, EError, Trigger, Dev} from "../core.js";
import {React, ReactUtils, PropTypes, AppNode, ReactComponent} from "../core.js";

import * as ContextObject from "../application/ContextObject";
import Dispatcher from "../utils/Dispatcher";

/**
 * Klasa bazowa, po której powinny dziedziczyć wszystkie komponenty pełniące role kontrolerów
 */


const DESTROYED = Symbol("destroyed");
const RENDER = Symbol("render");
const ON_DESTROY = Symbol("On component destroy");
const FORCE_UPDATE_TRIGGER = Symbol("Force update trigger");

export const NAME = Symbol("name");
export const NODE = Symbol("node");


let renderCount = 0; // ilość aktualnie renderowanych komponentów

let zIndex = 10;

// $FlowFixMe
export default class Component<DefaultProps: any, Props: any, State: any>
    extends ReactComponent<*, *, *> {

    static contextTypes = {
        router: PropTypes.object.isRequired,
        node: PropTypes.any.isRequired, //AppNode
    };

    static propTypes = {
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
        style: PropTypes.object,
        className: PropTypes.object,
    };

    static defaultProps = {
        ignore: false
    };

    /** Element drzewa dom, na którym bazuje komponent */
    element: HTMLElement;
    children: Children;

    [FORCE_UPDATE_TRIGGER]: Trigger = new Trigger();
    [ON_DESTROY] = [];
    [DESTROYED] = false;
    [NODE] = null;
    [NAME] = null;

    beforeRender: Dispatcher = new Dispatcher(this);

    whenComponentIsReady: Dispatcher = new Dispatcher(this);

    constructor(props: Object, context: Object, updater: Object) {
        super(...arguments);

        ContextObject.contextCreated(this);

        if (!props || typeof (props) !== "object" || !props.constructor || props.constructor.name !== "Object")
            throw new Error("Nieprawidłowe wywołanie konstruktora klasy " + this.constructor.name);

        if (!context || !context.router || !context.node)
            throw new Error("Nieprawidłowe wywołanie konstruktora klasy " + this.constructor.name);

        if (!updater || !updater.isMounted || !updater.enqueueCallback)
            throw new Error("Nieprawidłowe wywołanie konstruktora klasy " + this.constructor.name);

        this[NODE] = this.context.node;
        this.children = new Children(this);

        this.roles = this.props.roles;
        if (!this[NODE] && this instanceof AppNode)
        // $FlowFixMeoCol
            this[NODE] = (this: AppNode);
        if (!this[NODE])
            throw new Error("Brak zdefiniowanego modułu");

        this[NAME] = Utils.className(this);
        this[NODE].components.push(this);
        this[RENDER] = this.render;

        this.render = () => {
            if (this.props.ignore)
                return null;
            try {
                ++renderCount;
                this.beforeRender.dispatch(this, {});
                this[NODE].componentsStack.push(this);
                return Dev.duration(this, "Render", () => {
                    const result = this[RENDER]();
                    this[NODE].componentsStack.remove(this); // zdejmij ze stosu tylko jeśli nie zwróci wyjątku
                    return result;
                });
            } catch (e) {
                if (this[NODE] && this[NODE].currentPage) {
                    this[NODE].currentPage.__error = new EError(e);
                    this[NODE].currentPage.forceUpdate();
                }
                window.console.error(e);
                return null;
            } finally {
                --renderCount;
            }
        }
    }

    /**
     * Globalny indeks warstwy - używany gdy chcemy dodać warstwę na wierzchu
     * @return {number}
     */
    static get zIndex() {
        return ++zIndex;
    }

    get destroyed() {
        return this[DESTROYED];
    }

    setTimeout(func: () => void, delay: number, ...args: any) {
        let timeout = window.setTimeout(() => {
            timeout = null;
            func(...args);
        }, delay);
        this.onDestroy(() => {
            if (timeout !== null)
                window.clearTimeout(timeout);
        });
    }

    /** Podłączenie event listenera dla obiektu window z automatycznym usuwaniem w momencie zniszczenia komponentu*/
    addEventListener(name: string, func: () => void) {
        const callback = (...args) => func(...args);
        let res = window.addEventListener(name, callback);
        this.onDestroy(() => {
            window.removeEventListener(name, callback);
        });
    }

    toString() {
        return this[NAME];
    }

    renderChildren(children: ?any = null, onlyOne: boolean = false) {

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
            return Utils.forEach(children, c => process(c));

        return process(children);
    }


    onDestroy(callback: () => void): Component {
        Is.func(callback, () => this[ON_DESTROY].push(callback));
        return this;
    }

    componentWillUnmount() {
        this[DESTROYED] = true;
        this[NODE].components.remove(this);
        ContextObject.contextDestroyed(this);
        this[ON_DESTROY].forEach(func => func());
    }

    forceUpdate(delayed: boolean = true) {

        // komponent nie zamontowany
        if (!this._reactInternalInstance) return;

        this[FORCE_UPDATE_TRIGGER].cancel();

        const run = () => {
            if (this.destroyed)
                return;
            // zabezpieczenie przed błędem "Cannot update during an existing state transition..."
            if (ReactUtils.getCurrentlyRenderedComponent())
                setTimeout(() => run());
            else
                Dev.duration(this, "ForceUpdate", () => super.forceUpdate());
        };

        if (delayed)
            this[FORCE_UPDATE_TRIGGER].call(run, 10);
        else run();
    }

    setState(object: ?Object) {
        super.setState(object);
    }

    componentWillReceiveProps() {

    }

    shouldComponentUpdate() {

        return true;
    }

    componentWillMount() {
        this.whenComponentIsReady._onListen = (context: any, func: (data: Object) => ?any) => func({component: this});
        this.whenComponentIsReady.dispatch(this, {component: this});
    }


    componentWillUpdate() {

    }


    componentDidMount() {

    }

    componentDidUpdate() {

    }


}

export class Children {

    component: Component;
    _filter: ?(child: Child) => boolean;

    constructor(component: Component) {
        this.component = component;
    }

    filter(filter: (child: Child) => boolean): Children {
        this._filter = filter;
        return this;
    }


    render(children: Object | Array) {

        children = children || this.component.props.children;

        const list = [];

        const visit = (children: Object | Array) =>
            Utils.forEach(Utils.asArray(children), el => {

                if (el instanceof Array) {
                    visit(el);
                    return;
                }

                const child: Child = new Child(this, el);

                if (this.nonEmpty && child.isEmptyString)
                    return undefined;

                if (this._filter && this._filter(child) === false)
                    return undefined;

                list.push(child);
            });

        visit(children);

        const result = Utils.forEach(list, (child: Child) => {

            if (this._filter) {
                const props = {};
                Utils.forEach(child.allowedProps, name => {
                    const val = child.props[name];
                    if (val !== undefined)
                        props[name] = val;
                });
                return React.cloneElement(child.element, props);
            }

            return child.element;
        });

        return result.length > 1 ? result : result[0];

    }
}

export class Child {
    children: Children;
    element: any;
    props: {} = {};


    constructor(children: Children, element: any) {
        this.children = children;
        this.element = element;

        if (this.isReactComponent)
            this.props = Utils.clone(this.element.props);
    }

    get allowedProps(): string[] {
        const allowed: string[] = this.element.type && this.element.type.propTypes
            ? Object.keys(this.element.type.propTypes)
            : [];
        allowed.push("key");
        return allowed;
    }

    get type(): string {
        return Utils.className(this.isReactComponent ? this.element.type : this.element);
    }

    get isReactComponent(): boolean {
        return !!(this.element && this.element.$$typeof && this.element.props);
    }

    get isEmptyString(): boolean {
        return typeof this.element === "string" && (this.element: string).trim() === "";
    }


}

type T = any;

export class Dynamic<T> {

    _ref: DynamicComponent;
    _render: () => any;
    _key: string;
    _value: ?T;
    _visible: boolean | () => boolean = true;


    constructor(value: T, render: (value: T) => ReactComponent) {
        this._render = render || (() => this.render());
        this._value = value;
        //this._key = Utils.className(this);
    }

    get $(): DynamicComponent {
        return <DynamicComponent dyn={this} key={this._key}/>
    }

    render() {
        return this._render();
    }

    update(delayed: boolean = true) {
        if (this._ref)
            this._ref.forceUpdate(delayed);
    }


    set(value: ?T): Dynamic<T> {
        if (value === this._value) return;
        this._value = value;
        this.update(true);
        return this;
    }

    set visible(visible: boolean | () => boolean) {
        //   if (visible === this._visible) return;

        Dev.log([this, this._key], "visible: " + visible);
        this._visible = visible;
        this.update(true);
        return this;
    }

    get visible(): boolean | () => boolean {
        return this._visible;
    }

    set value(value: ?T) {
        this.set(value);
    }

    get(): ?T {
        return this._value;
    }

    get value(): ?T {
        return this.get();
    }

}

export class DynamicComponent extends Component {

    static propTypes = {
        dyn: PropTypes.instanceOf(Dynamic)
    };

    constructor() {
        super(...arguments);
        this.props.dyn._ref = this;
    }

    render() {
        const dyn: Dynamic = this.props.dyn;
        let visible = dyn.visible;
        Is.func(visible, v => visible = v());
        if (!visible)
            return null;
        return dyn._render(dyn.value);
    }
}