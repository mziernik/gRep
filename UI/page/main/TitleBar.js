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
        TitleBar.setStatus(this);
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

        const info = this.state.status ? <span
            style={{
                display: "inline-block",
                position: "absolute",
                right: "0",
                top: "0",
                border: "1px solid #595",
                backgroundColor: "#cec",
                paddingLeft: "10px",
                height: "100%",
                minWidth: "30%",
                borderRadius: "4px 0 0 4px",
                boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.4)"
            }}
        >
                  <span style={ {
                      fontSize: "24px",
                      verticalAlign: "baseline",
                      margin: "4px"
                  } } className={FontAwesome.INFO}/>

                <span style={ {
                    fontSize: "14px",
                    verticalAlign: "baseline",
                    margin: "4px",
                    paddingLeft: "4px",
                    color: "#666",
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)"
                } }
                >{this.state.status.message}</span>
            </span> : null;

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



