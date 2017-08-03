// @flow
'use strict';

import {Utils, Is, Check, Field, EError, Trigger, Dev} from "../core.js";
import {React, ReactUtils, PropTypes, AppNode, ReactComponent} from "../core.js";

import * as ContextObject from "../application/ContextObject";

/**
 * Klasa bazowa, po której powinny dziedziczyć wszystkie komponenty pełniące role kontrolerów
 */


let renderCount = 0; // ilość aktualnie renderowanych komponentów

let zIndex = 10;

// $FlowFixMe
export default class Component<DefaultProps: any, Props: any, State: any>
    extends ReactComponent<*, *, *> {

    /** @private */
    __render: () => any;

    static get zIndex() {
        return ++zIndex;
    }

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

    /** @type {AppNode}*/
    node: AppNode;
    /** Element drzewa dom, na którym bazuje komponent */
    element: HTMLElement;

    children: Children;

    _forceUpdateTrigger: Trigger = new Trigger();

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
        this.children = new Children(this);

        this.roles = this.props.roles;
        if (!this.node && this instanceof AppNode)
        // $FlowFixMeoCol
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
                ++renderCount;
                return Dev.duration(this, "Render", () => this.__render());
            } catch (e) {
                if (this.node && this.node.currentPage) {
                    this.node.currentPage.__error = new EError(e);
                    this.node.currentPage.forceUpdate();
                }
                window.console.error(e);
                return null;
            } finally {
                --renderCount;
            }
        }
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


    // /**
    //  * Utwórz komponent reacta (wykorzystywany w metodzie render)
    //  * @param type
    //  * @param props
    //  * @return {*}
    //  */
    // create(type: string, props: ? Object) {
    //
    //     props = props || {};
    //
    //     if (this.props && this.props.style) {
    //         // dodaj do styli zadeklarowanych w atrybutach te, które są we właściwościach
    //         props.style = props.style || {};
    //         for (let name in this.props.style)
    //             props.style[name] = this.props.style[name];
    //     }
    //
    //     const ref = props.ref;
    //
    //     props.ref = (elm) => {
    //         this.element = elm;
    //         if (ref)
    //             ref(elm);
    //     };
    //
    //     return React.createElement(type, props, this.props.children);
    // }

    toString() {
        return this.name;
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
        Is.func(callback, () => this._onDestroy.push(callback));
        return this;
    }


    componentWillUnmount() {
        this.node.components.remove(this);
        ContextObject.contextDestroyed(this);
        this._onDestroy.forEach(func => func());
    }

    forceUpdate(delayed: boolean = true) {

        const doUpdate = () => Dev.duration(this, "ForceUpdate", () => super.forceUpdate());

        this._forceUpdateTrigger.cancel();

        const run = () => {
            // zabezpieczenie przed błędem "Cannot update during an existing state transition..."
            if (ReactUtils.getCurrentlyRenderedComponent())
                setTimeout(() => doUpdate());
            else
                doUpdate();
        };


        if (delayed)
            this._forceUpdateTrigger.call(run, 10);
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
    _nonEmpty: boolean = false;
    _filter: ?(child: Child) => boolean;
    _props: Object;
    _instances: [];

    constructor(component: Component) {
        this.component = component;
    }

    props(props: Object): Children {
        this._props = props;
        return this;
    }

    /** Weryfikacja typów komponentów */
    instanceOf(instances: any | any[]): Children {
        this._instances = Utils.asArray(instances);
        return this;
    }

    filter(filter: (child: Child) => boolean): Children {
        this._filter = filter;
        return this;
    }

    nonEmpty(): Children {
        this._nonEmpty = true;
        return this;
    }

    render(children: Object | Array) {

        children = children || this.component.props.children;

        let childrenList = [];


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
            let changed = false;
            // weryfikacja czy obiekt właściwości uległ zmianie
            if (child._propsChanged) {
                const oryginalProps = child.element.props;
                const currProps = child.props;


                changed = (Object.values(oryginalProps).length !== Object.values(currProps));
                if (!changed)
                    for (let key in oryginalProps) {
                        const src = oryginalProps[key];
                        const dst = currProps[key];
                        if (src !== dst) {
                            changed = true;
                            break;
                        }
                    }
            }

            if (changed) {
                const props = {};
                child.allowedProps.forEach((name: string) => {
                    if (child.props[name] !== undefined)
                        props[name] = child.props[name];
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
    _propsChanged: boolean;


    constructor(children: Children, element: any) {
        this.children = children;
        this.element = element;

        if (this.isReactComponent) {
            this.props = Utils.clone(this.element.props);
            this._propsChanged = true;
        }

        Utils.forEach(children._props, (v, k) => {
            if (v !== undefined)
                this.props[k] = v;
        });
        this._propsChanged = this._propsChanged || Object.values(this.props).length;
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

export class Dynamic {

    _ref: DynamicComponent;
    _render: () => any;
    _props: Object = {};
    _state: Object = {};

    constructor(render: () => ReactComponent): Dynamic {
        this._render = render || (() => this.render());
    }

    render() {
        return this._render();
    }

    update(delayed: boolean = true) {
        if (this._ref)
            this._ref.forceUpdate(delayed);
    }

    state(state: Object) {
        this._state = state;
        this.update();
    }

    get $() {
        return <DynamicComponent dyn={this}/>
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
        return dyn._render(dyn._state || {});
    }
}