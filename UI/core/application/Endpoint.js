/**
 * Definicja strony na potrzeby routingu
 */
import {React, ReactComponent, AppEvent, Utils, Dispatcher, Check} from "../core";
import Route from "react-router-dom/es/Route";
import Glyph from "../component/glyph/Glyph";

export const ENDPOINT_TARGET_TAB = "tab";
export const ENDPOINT_TARGET_POPUP = "popup";

export default class Endpoint {

    static ALL: Map<String, Endpoint> = new Map();
    static onChange: Dispatcher = new Dispatcher();

    /** domyślna strona 404 */
    static NOT_FOUND: ?Endpoint;

    _icon: ?Glyph = null;
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


    constructor(key: string, name: string, path: ?string, component: ?ReactComponent) {
        this.key = Check.id(key, ".");
        this._name = Check.nonEmptyString(name);
        if (path && !path.startsWith("/") && path !== "*")
            throw new Error(`Ścieżka (${Utils.escape(key)}) musi zaczynać się od "/", aktualnie ${Utils.escape(path)}`);
        this._path = path;
        this._component = component;
        Endpoint.ALL.set(key, this);

        if (Endpoint.NOT_FOUND) {
            // nawigacja do 404 musi być zawsze na końcu listy
            if (!Endpoint.ALL.delete(Endpoint.NOT_FOUND.key, Endpoint.NOT_FOUND))
                throw new Error();
            Endpoint.ALL.set(Endpoint.NOT_FOUND.key, Endpoint.NOT_FOUND);
        }

        if (!Endpoint.homePage && name === "/")
            Endpoint.homePage = this;

        Endpoint.onChange.dispatch(this);
    }


    static pageOf(component: React.Component): ?Endpoint {
        return Endpoint.ALL.find((page: Endpoint) => page._component === component);
    }

    static navigate(link: string, target: string | MouseEvent = null) {
        throw new Error("Metoda nie została nadpisana przez PageContainer.navigate");
    }

    navigate(params: ?Object = null, target: string | MouseEvent = null) {
        if (this.canNavigate)
            Endpoint.navigate(this.getLink(params), target);
    }

    get canNavigate() {
        return this._path && this._component;
    }

    child(key: string, name: string, path: string, component: React.Component): Endpoint {
        const page = new Endpoint(this.key + "." + Check.id(key), name, path, component);
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

    icon(icon: Glyph): Endpoint {
        this._icon = icon;
        return this;
    }


    hidden(value: boolean): Endpoint {
        this._hidden = value === undefined ? true : value;
        return this;
    }

    static routeMap(): Map {
        return Utils.forEach(Endpoint.ALL, (page: Endpoint) => page.route());
    }

    route(idx: number): Route {

        if (!this._path || !this._component) return null;

        return <Route
            key={this.key}
            exact={this._exact}
            path={this._path}
            children={(route: Object) => {

                const props = {};
                props.key = Utils.randomId(); // dodanie losowego klucza zmusza reacta do ponownego utworzenia komponentu dziedziczącego po page

                this.onNavigate.dispatch(this, this);

                if (this._props)
                    for (let name in this._props)
                        props[name] = this._props[name];

                if (route.match && route.match.params)
                    for (let name in route.match.params)
                        props[name] = route.match.params[name];

                route.endpoint = this;
                props.route = route;

                const el = React.createElement(this._component, props, null);
                AppEvent.NAVIGATE.send(this, this, props);
                return el;
            }}

        />
    }

}