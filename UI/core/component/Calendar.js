// @flow
'use strict';
import {React, ReactDOM, AppEvent, Trigger} from "../core.js";
import {Component} from "../components.js";

export class Calendar extends Component {

    render() {
        return <iframe
            src="/sf/calendar.html"
            style={{
                width: "100%",
                height: "100%",
                border: "none"
            }}

            onLoad={(e: Event) => {
                const fra: HTMLIFrameElement = e.currentTarget;
                const wnd: Window = fra.contentWindow;
                const doc: HTMLDocument = wnd.document;
            }}

        />
    }


}