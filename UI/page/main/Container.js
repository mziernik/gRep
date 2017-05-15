// @flow
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter, Link, Redirect, Switch, Miss} from 'react-router-dom';

import About from "../About";
import NotFound from "../NotFound";
import Application from "../../core/Application";
import Component from "../../core/Component";
import AppRoot from "../../core/Node";
import User from "../User";
import Dashboard from "../Dashboard";

const containers = [];

let _beforeUpdate;

export default class Container extends Component {

    constructor() {
        super(...arguments);
        if (!_beforeUpdate)
            Application.beforeUpdate(_beforeUpdate = () =>
                containers.forEach(container => removeRoot(container)));
    }


    route() {
        return <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route path="/about" component={About}/>
            <Route exact path="/user" component={User}/>
            <Route path="*" component={NotFound}/>
        </Switch>;
    }


    componentWillMount() {
        this.componentWillUpdate(true);
    }


    componentWillUpdate() {

        // if (ctrTag.children.length)
        //     Application.remove(ctrTag.children[0].component, false);

        let div = document.createElement("div");
        // $FlowFixMe
        containers.push(Application.render(this.route(), div));
        window.document.getElementById("app-container").appendChild(div);
    }

    render() {
        return null;
    }

}

// usuń kontener potomny uwzględniając animację
function removeRoot(root: AppRoot): void {


// zablokuj aktualizacje bieżących kontenerów
    root.canUpdate = false;


    // setTimeout(() => {
    //     "use strict";
    //
    //     root.remove();
    //     root.element.remove();
    //
    // }, 1000);


}
