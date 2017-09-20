// @flow
'use strict';
//FixMe importy
import {React} from "../../core/core.js";
import {Component, Icon} from "../../core/components.js";
import Breadcrumb from "../../core/component/Breadcrumbs";
import WebApiStatus from "../../core/component/application/WebApiStatus";
import {MenuItem, PopupMenu} from "../../core/component/PopupMenu";
import Login from "../Login";
import {Endpoint, Dev} from "../../core/core";
import {DEBUG_MODE, PROCESS_ENV} from "../../core/Dev";
import {UserData} from "../../core/application/UserData";
import ApplicationData from "../../core/application/ApplicationData";
import * as Utils from "../../core/utils/Utils";
import Link from "../../core/component/Link";
import PNotification from "../notification/PNotification";
import Application from "../../core/application/Application";


let context;

export default class Header extends Component {

    constructor() {
        super(...arguments);
        context = this.context;
        ApplicationData.onChange.listen(this, () => this.forceUpdate());
    }

    render() {

        function frmt(date: date) {
            if (!date) return null;
            const parts = date.toLocaleString().split(" ");
            const d = parts[0].split(".");
            const t = parts[1].split(":");
            return <span key={Utils.randomId()}>{d[0] + "/" + d[1] + " " + t[0] + ":" + t[1]} </span>
        }

        return (
            <div>
                <img src="/res/logo.png" onClick={e => Endpoint.navigate("/", e)}/>
                <a className="fa fa-exclamation-triangle" title="Dodaj zgłoszenie" onClick={e => PNotification.add(e)}/>
                <Breadcrumb/>
                {DEBUG_MODE ?
                    <div className="hdr-version-info">
                        <div title="Wersja UI">
                            <span style={{marginRight: "10px"}}>{ApplicationData.uiVersion}</span>
                            {frmt(ApplicationData.uiDate)}
                        </div>
                        <div title="Wersja usługi">
                            {frmt(ApplicationData.serviceDate)}
                        </div>
                    </div> : null}


                {DEBUG_MODE ? <WebApiStatus/> : null}
                {DEBUG_MODE ? <a className="fa fa-bug" onClick={e => PopupMenu.open(e, Dev.TOOLS)}/> : null}

                <a className="fa fa-user" onClick={(e) => {
                    PopupMenu.open(e, MENU_ITEMS);
                }}><span>{UserData.current && UserData.current.firstname || null}</span></a>
            </div>
        );
    }
}

const MENU_ITEMS = [

    MenuItem.create((item: MenuItem) => {
        item.name = "Dane użytkownika";
        //  item.hint = "Wpisuje do konsoli nazwę pola i jego wartość";
        item.onClick = () => {
            debugger;

            //  Application.router.transitionTo('/');
        }
    }),

    MenuItem.create((item: MenuItem) => {
        item.name = "Wyloguj";
        item.icon = Icon.POWER_OFF;
        //  item.hint = "Wpisuje do konsoli nazwę pola i jego wartość";
        item.onClick = () => {
            Login.logout();
        }
    }),
];