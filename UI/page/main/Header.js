// @flow
'use strict';
//FixMe importy
import {React} from "../../core/core.js";
import Component from "../../core/component/Component";
import Breadcrumb from "../../core/component/Breadcrumbs";
import WebApiStatus from "../../core/component/application/WebApiStatus";
import {MenuItem, PopupMenu} from "../../core/component/PopupMenu";
import FontAwesome from "../../core/component/glyph/FontAwesome";


let context;

export default class Header extends Component<*, *, { title: ?string }> {

    constructor() {
        super(...arguments);
        context = this.context;
    }

    render() {

        return (
            <header id="app-header">

                <img src="/res/logo.png"/>
                <span style={{marginRight: "20px"}}>CK technik</span>


                {/*<input type="search"/>*/}
                {/*<Link style={{marginRight: "60px"}} className="fa fa-search" to="/search"/>*/}

                {/*<Link className="fa fa-calendar-check-o" to="/calendar"/>*/}
                {/*<Link className="fa fa-warning" to="/calendar"/>*/}


                <Breadcrumb/>

                <span style={{float: "right"}}>

                    <WebApiStatus/>
                     <a className="fa fa-user" onClick={(e) => {



                         //PopupMenu.openMenu(e, MENU_ITEMS);
                     }}/>
                </span>


            </header>
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
        item.icon = FontAwesome.POWER_OFF;
        //  item.hint = "Wpisuje do konsoli nazwę pola i jego wartość";
        item.onClick = () => {
            alert("aaaaaaaaaa");
        }
    }),
];