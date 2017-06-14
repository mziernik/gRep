// @flow
'use strict';

import React from 'react';
import Component from "../../core/component/Component";
import PropTypes from 'prop-types';
import PageTitle from "../../core/page/PageTitle";
import FontAwesome from "../../core/component/glyph/FontAwesome";
import AppStatus from "../../core/application/Status";

let instance: TitleBar;

export class Status extends AppStatus {

    publish() {
        setTimeout(() => TitleBar.setStatus(this));
    }

    hide() {
        setTimeout(() => TitleBar.setStatus(null));
    }

}

export default class TitleBar extends Component {

    constructor() {
        super(...arguments);
        instance = this;
        this.state = {
            title: null,
            status: null
        }
    }

    static setTitle(sender: PageTitle) {
        setTimeout(() => instance.setState({title: sender.props.children}));
    }

    static setStatus(status: AppStatus) {
        setTimeout(() => instance.setState({status: status}));
    }

    render() {

        let info = null;

        if (this.state.status) {

            let icon: FontAwesome;
            let background: string;
            let border: string;
            switch (this.state.status.type) {
                case "debug":
                    icon = FontAwesome.BUG;
                    border = "#555";
                    background = "#ccc";
                    break;
                case "info":
                    icon = FontAwesome.INFO;
                    border = "#459";
                    background = "#ade";
                    break;
                case "success":
                    icon = FontAwesome.CHECK;
                    border = "#595";
                    background = "#aea";
                    break;
                case "warning" :
                    icon = FontAwesome.EXCLAMATION_TRIANGLE;
                    border = "#963";
                    background = "#eda";
                    break;
                case "error":
                    icon = FontAwesome.TIMES;
                    border = "#b55";
                    background = "#eaa";
                    break;
            }

            info = <span
                style={{
                    display: "inline-block",
                    position: "absolute",
                    right: "0",
                    top: "0",
                    border: "1px solid " + border,
                    backgroundColor: background,
                    paddingLeft: "10px",
                    height: "100%",
                    minWidth: "30%"
                 }}
            >
                <span style={ {
                    fontSize: "24px",
                    width: "30px",
                    color: border,
                    verticalAlign: "baseline",
                    margin: "4px"
                } } className={icon}/>

                <span style={ {
                    fontSize: "16px",
                    verticalAlign: "baseline",
                    fontWeight: "bold",
                    margin: "4px",
                    paddingLeft: "4px",
                    color: "#333",
                } }
                >{this.state.status.message}</span>
            </span>;

        }
        return <div style={{position: "relative"}}>
                   <span>
                    <h5 style={ {
                        color: "#39b",
                        fontWeight: "bold",
                        padding: "10px 0 0 20px",
                        display: "inline-block"
                    } }
                    >{this.state.title}</h5>
                </span>
            {info}
        </div>

    }
}



