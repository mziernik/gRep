// @flow
'use strict';

import {React, PropTypes, EventType} from "../core";
import {Component, Page, ModalWindow} from "../components";
import "./components.css";

export class TitleBar extends Component {

    static propTypes = {
        page: PropTypes.any.isRequired, //Page
        title: PropTypes.string.isRequired,
        toolbar: PropTypes.func,
    };

    constructor() {
        super(...arguments);
    }

    render() {

        const items = this.props.toolbar ? this.props.toolbar() : null;

        if (this.node.tab && this.node.tab.modalWindow) {
            // const modal: ModalWindow = this.node.tab.modalWindow;
            // modal.buttons = items;
            // modal.title = this.props.title;
            return null;
        }

        const page: Page = this.props.page;

        return <div className="c-title-bar">
            {page.endpoint._icon ? <span className={"c-title-bar-icon " + page.endpoint._icon}/> : null}
            <h5>{this.props.title}</h5>

            <span style={{flex: "auto"}}/>

            {items}

            <hr style={{marginTop: "0"}}/>
        </div>
    }
}
