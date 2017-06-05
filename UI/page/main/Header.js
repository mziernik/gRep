// @flow
'use strict';
//FixMe importy
import React from 'react';
import {Link} from 'react-router-dom';
import Component from "../../core/component/Component";
import Login from "../Login";
import Breadcrumb from "../../core/component/Breadcrumbs";

export type State = "init" | "connecting" | "connected" | "disconnected";

class WebApiStatus extends Component<*, *, { state: ["init", "connecting", "connected", "disconnected"] }> {


    constructor() {
        super(...arguments);
  //      Events.WEB_API_STATUS.listen(this, () => this.forceUpdate());
    }

    render() {
        let color = null;
        let name = null;
        switch ("init") {
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

    constructor() {
        super(...arguments);
    }

    render() {

        return (
            <header id="app-header">

                <Link className="fa fa-home" to="/"/>
                <img src="/res/logo.png"/>
                <span style={{marginRight: "20px"}}>CK technik</span>


                <input type="search"/>
                <Link style={{marginRight: "60px"}} className="fa fa-search" to="/search"/>

                <Link className="fa fa-calendar-check-o" to="/calendar"/>
                <Link className="fa fa-warning" to="/calendar"/>


                <Breadcrumb/>

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
