// @flow
'use strict';
//FixMe importy
import React from 'react';
import Component from "../Component";
import {State} from "../../webapi/Transport";

export default class WebApiStatus extends Component {

    constructor() {
        super(...arguments);
        State.onChange.listen(this, (state: State) => this.forceUpdate());
    }

    render() {
        return <a style={{color: State.current.color}}
                  className="fa fa-rss" title={"Status połączenia WebApi: " + State.current.name}
                  onClick={e => State.reconnect()}
        />
    }
}