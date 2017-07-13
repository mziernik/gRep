// @flow
'use strict';

import {React, PropTypes, EventType} from "../core";
import {Component, Page} from "../components";
import "./components.css";


export default class ToolBar extends Component {

    static renderer: ?(sender: ToolBar) => void = null;
    static propTypes = {
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
    };


    constructor() {
        super(...arguments);
    }

    render() {
        if (ToolBar.renderer)
            return ToolBar.renderer(this);

        const items = this.props.items ? this.props.items() : null;

        return <div className="c-tool-bar">
            {this.children.render()}
        </div>
    }

}



