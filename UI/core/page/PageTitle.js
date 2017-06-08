// @flow
'use strict';

import {React, PropTypes, EventType} from "../core";
import {Component} from "../components";


export const EVENT: EventType = new EventType();

export default class PageTitle extends Component {

    static renderer: ?(sender: PageTitle) => void = null;

    constructor() {
        super(...arguments);
    }

    render() {
        if (PageTitle.renderer)
            return PageTitle.renderer(this);

        return <div>
            <h5 style={ {
                color: "#39b",
                fontWeight: "bold",
                padding: "10px 0 0 20px"
            } }>{this.props.children}</h5>
            <hr style={ {marginTop: "0"} }/>
        </div>
    }

}



