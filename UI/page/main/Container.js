// @flow
'use strict';

import {React, Endpoint, AppEvent} from "../../core/core";
import {Component} from "../../core/components";
import {Switch} from 'react-router-dom';


const containers = [];


export default class Container extends Component {

    constructor() {
        super(...arguments);
        // zmienił się URL strony, odśwież kontener
        AppEvent.APPLICATION__BEFORE_UPDATE.listen(this, () => this.node.forceUpdate());
    }

    render() {
        const map = Endpoint.all.map((page: Endpoint, idx: number) => page.route(idx));
        return <Switch>{map}</Switch>
    }


};
