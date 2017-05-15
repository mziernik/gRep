// @flow
'use strict';

import React from 'react';
import Debug from "../../core/Debug";
import {Link} from 'react-router-dom';
import Component from "../../core/Component";
import Events from "../../model/Events";
import API from "../../model/API";
import SignalR from "../../model/SignalR";
import Login from "../Login";

class WebApiStatus extends Component<*, *, { state: ["init", "connecting", "connected", "disconnected"] }> {


    constructor() {
        super(...arguments);
        this.on(Events.WEB_API_STATUS, state => this.forceUpdate());
    }

    render() {
        let color = null;
        let name = null;
        switch (SignalR.state) {
            case "init":
                color = "gray";
                name = "oczekujące";
                break;
            case "connecting":
                color = "aqua";
                name = "łączenie"
                break;
            case "connected":
                color = "lime";
                name = "połączone";
                break;
            case "disconnected":
                color = "red";
                name = "rozłączone";
                break;
        }

        return <a className="fa fa-rss" title={"Status połączenia WebApi: " + name}
                  style={{color: color}}/>
    }


}

export default class Header extends Component<*, *, { title: ?string }> {

    state = {
        title: ""
    };

    constructor() {
        super(...arguments);
        this.on(Events.HEADER_TITLE, title => this.setState({title: title}));
    }

    render() {
        Debug.log(this, "Render");

        return (
            <header id="app-header">

                <Link className="fa fa-home" to="/"/>
                <img src="/res/logo.png"/>
                <span style={{marginRight: "20px"}}>CK technik</span>


                <input type="search"/>
                <Link style={{marginRight: "60px"}} className="fa fa-search" to="/search"/>

                <Link className="fa fa-calendar-check-o" to="/calendar"/>
                <Link className="fa fa-warning" to="/calendar"/>


                <span>{this.state.title}</span>

                <span style={{float: "right"}}>

                    <WebApiStatus/>

                    <Link className="fa fa-user" to="/user"/>
                    <Link className="fa fa-bell" to="/alerts"/>
                    <Link className="fa fa-list" to="/tasks"/>

                    <Link className="fa fa-info-circle" to="/toolbar"/>
                    <Link className="fa fa-map" to="/toolbar"/>
                    <Link className="fa fa-weixin" to="/stream"/>
                    <a className="fa fa-power-off" onClick={() => Login.logout()}/>
                </span>


            </header>
        );
    }
}
