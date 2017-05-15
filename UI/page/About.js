import React from 'react';
import {Route, BrowserRouter, Link, Redirect, Switch, Miss} from 'react-router-dom';
import Page from "./Page";

export default class AboutRouter extends React.Component {

    render() {

        return (
            <Switch>
                <Route path="/:dir/license" component={License}/>
                <Route path="/:dir/" component={About}/>
            </Switch>
        );

        return (
            <h1>Informacje o programie...</h1>
        );
    }
}

class About extends Page {
    constructor() {
        super("O programie...", ...arguments);
    }

    componentWillMount() {
        super.componentWillMount();
    }


    render() {
        return (
            <h1>Informacje o programie...</h1>
        );
    }
}

class License extends Page {
    constructor() {
        super("Licencja", ...arguments);
    }

    render() {
        return (
            <h1>Licencja</h1>
        );
    }
}


