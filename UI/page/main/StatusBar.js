// @flow
'use strict';

import React, {Element} from 'react'
import Notify from "../../core/Notify";
import Component from "../../core/Component";
import Events from "../../model/Events";
import AppEvent from "../../core/Event";

export default class StatusBar extends Component<*, *, { text: ?string }> {

    state = {
        text: null
    };

    constructor() {
        super(...arguments);
        this.on(Events.STATUS_BAR_TEXT, (text: string, event: AppEvent) => this.setState({text: text}));
    }

    render() {

        let text = this.state.text;

        if (!text)
            text = '\xa0'; // nbsp

        return (
            <footer id="app-footer">
                {text}
            </footer>
        );
    }
}

