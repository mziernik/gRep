// @flow
'use strict';

import {React, PropTypes, EventType} from "../core";
import {Component} from "../components";


export default class PageToolBar extends Component {

    static renderer: ?(sender: PageToolBar) => void = null;

    constructor() {
        super(...arguments);
    }

    render() {
        if (PageToolBar.renderer)
            return PageToolBar.renderer(this);

        return <div
            style={ {
                border: "1px solid #555",
                padding: "4px",
                fontSize: "24px"
            } }
        >
            {super.renderChildren()}
        </div>
    }

}



