/**
 * Definicja strony na potrzeby routingu
 */


import {React, AppEvent, Utils, Dispatcher} from "../core";
import Route from "react-router-dom/es/Route";

export default class Endpoint {

    static all: Endpoint[] = [];
    static onChange: Dispatcher = new Dispatcher();

    /** domyślna strona 404 */
    static NOT_FOUND: ?Endpoint;

    _name: ?string = null;
    _path: ?string = null;
    _exact: boolean = true;
    _component: ?React.Component = null;
    /** @type {boolean} Strona nie wyświetli się na liście stron  (np strona błędu) */
    _hidden: boolean = false;

    _defaultParams: Object = {};

    /** Właściwości danej strony przekazywane do obiektu */
    _props: Object = {};

    onNavigate: Dispatcher = new Dispatcher();

    static homePage: Endpoint;

    _parent: ?Endpoint = null;
    _children: Endpoint[] = [];


    constructor(name: string, path: string, component: React.Component) {
        this._name = name;
        this._path = path;
        this._component = component;
        Endpoint.all.push(this);

        if (Endpoint.NOT_FOUND) {
            // nawigacja do 404 musi być zawsze na końcu listy
            if (!Endpoint.all.remove(Endpoint.NOT_FOUND))
                throw new Error();
            Endpoint.all.push(Endpoint.NOT_FOUND);
        }

        if (!Endpoint.homePage && name === "/")
            Endpoint.homePage = this;

        Endpoint.onChange.dispatch(this);
    }


    static pageOf(component: React.Component): ?Endpoint {
        return Endpoint.all.find((page: Endpoint) => page._component === component);
    }

    hasLink() {
        return this._path && this._component;
    }

    child(name: string, path: string, component: React.Component): Endpoint {
        const page = new Endpoint(name, path, component);
        this._children.push(page);
        page._parent = this;
        return page;
    }

    exact(value: boolean): Endpoint {
        this._exact = value;
        return this;
    }

    defaultParams(value: Object): Endpoint {
        this._defaultParams = value;
        return this;
    }

    /** Zwraca link do strony, podstawia parametry do URL-a*/
    getLink(params: ?{} = null) {

        let result: String = this._path;

        Utils.forEach(params || this._defaultParams,
            (value: string, name: string) => result = result.split(":" + name).join(encodeURIComponent(value)));

        return result;
    }

    hidden(value: boolean): Endpoint {
        this._hidden = value;
        return this;
    }

    route(idx: number): Route {

        if (!this._path || !this._component) return null;

        return <Route
            key={"page_" + idx}
            exact={this._exact}
            path={this._path}
            children={(route: Object) => {

                const props = {};
                props.key = Utils.randomId(); // dodanie losowego kolucza zmsza reacta do ponownego utworzenia komponentu dziedziczącego po page

                this.onNavigate.dispatch(this, this);

                if (this._props)
                    for (let name in this._props)
                        props[name] = this._props[name];

                if (route.match && route.match.params)
                    for (let name in route.match.params)
                        props[name] = route.match.params[name];

                route.endpoint = this;
                props.route = route;
                AppEvent.NAVIGATE.send(this, this);
                return React.createElement(this._component, props, null);
            }}

        />
    }

}