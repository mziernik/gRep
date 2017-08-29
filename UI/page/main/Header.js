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


let context;

export default class Header extends Component {

    constructor() {
        super(...arguments);
        context = this.context;
    }

    render() {
        return (
            <div>
                <img src="/res/logo.png" onClick={e => Endpoint.navigate("/", e)}/>
                <Breadcrumb/>
                {DEBUG_MODE ?
                    <div className="hdr-version-info">
                        <div>wersja {PROCESS_ENV.BUILD_VERSION},</div>
                        <div>{new Date(PROCESS_ENV.BUILD_DATE).toLocaleString().replace(",", "")}</div>
                    </div> : null}
                <WebApiStatus/>
                <a className="fa fa-user" onClick={(e) => {
                    PopupMenu.openMenu(e, MENU_ITEMS);
                }}/>
            </div>
        );
    }
}

const MENU_ITEMS = [

    MenuItem.createItem((item: MenuItem) => {
        item.name = "Dane użytkownika";
        //  item.hint = "Wpisuje do konsoli nazwę pola i jego wartość";
        item.onClick = () => {
            debugger;

            //  Application.router.transitionTo('/');
        }
    }),

    MenuItem.createItem((item: MenuItem) => {
        item.name = "Wyloguj";
        item.icon = Icon.POWER_OFF;
        //  item.hint = "Wpisuje do konsoli nazwę pola i jego wartość";
        item.onClick = () => {
            Login.logout();
        }
    }),
];