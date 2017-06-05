/**
 * Definicja strony na potrzeby routingu
 */


import {React, AppEvent, Utils, Dispatcher} from "../core";
import Route from "react-router-dom/es/Route";

export default class PageDef {
    static all: PageDef[] = [];
    /** domyślna strona 404 */
    static NOT_FOUND: ?PageDef;

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

    static homePage: PageDef;

    _parent: ?PageDef = null;
    _children: PageDef[] = [];


    constructor(name: string, path: string, component: React.Component) {
        this._name = name;
        this._path = path;
        this._component = component;
        PageDef.all.push(this);

        if (PageDef.NOT_FOUND) {
            // nawigacja do 404 musi być zawsze na końcu listy
            if (!PageDef.all.remove(PageDef.NOT_FOUND))
                throw new Error();
            PageDef.all.push(PageDef.NOT_FOUND);
        }

        if (!PageDef.homePage && name === "/")
            PageDef.homePage = this;

    }


    static pageOf(component: React.Component): ?PageDef {
        return PageDef.all.find((page: PageDef) => page._component === component);
    }

    hasLink() {
        return this._path && this._component;
    }

    child(name: string, path: string, component: React.Component): PageDef {
        const page = new PageDef(name, path, component);
        this._children.push(page);
        page._parent = this;
        return page;
    }

    exact(value: boolean): PageDef {
        this._exact = value;
        return this;
    }

    defaultParams(value: Object): PageDef {
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

    hidden(value: boolean): PageDef {
        this._hidden = value;
        return this;
    }

    route(idx: number): Route {

        if (!this._path || !this._component) return null;

        return <Route
            key={"page_" + idx}
            exact={this._exact}
            path={this._path}
            children={(props: Object) => {

                this.onNavigate.dispatch(this, this);

                if (this._props)
                    for (let name in this._props)
                        props[name] = this._props[name];

                if (props.match && props.match.params)
                    for (let name in props.match.params)
                        props[name] = props.match.params[name];

                AppEvent.NAVIGATE.send(this, this);
                return React.createElement(this._component, props, null);
            }}

        />
    }

}