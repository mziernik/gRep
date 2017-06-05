// @flow
'use strict';

//FixMe importy
import React from 'react'
import Component from "../../core/component/Component";

export default class StatusBar extends Component<*, *, { text: ?string }> {

    state = {
        text: null
    };

    constructor() {
        super(...arguments);
     //   Events.STATUS_BAR_TEXT.listen(this, (text: string, event: AppEvent) => this.setState({text: text}));
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

