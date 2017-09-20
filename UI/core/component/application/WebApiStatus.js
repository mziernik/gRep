// @flow
import React from 'react';
import Component from "../Component";
import {State} from "../../webapi/Transport";
import {MenuItem, PopupMenu} from "../PopupMenu";
import * as Utils from "../../utils/Utils";
import Icon from "../glyph/Icon";
import {R_WEBAPI} from "../../repository/WebApiRepo";
import RepoCtrl from "../repository/RepoCtrl";
import {DEBUG_MODE, DEV_MODE} from "../../Dev";
import Dev from "../../Dev";

export default class WebApiStatus extends Component {

    constructor() {
        super(...arguments);
        State.onChange.listen(this, data => this.forceUpdate());
    }

    render() {
        const items = [];

        if (DEBUG_MODE)
            items.push(MenuItem.create((c: MenuItem) => {
                c.name = "Komunikacja WebApi";
                c.icon = Icon.TH_LIST;
                c.onClick = e => new RepoCtrl(R_WEBAPI).modalEdit();
            }));


        return <a
            style={{color: State.current.color}}
            className="fa fa-rss" title={"Status połączenia WebApi: " + State.current.name}
            onClick={e => State.reconnect()}
            onContextMenu={items.length ? e => PopupMenu.open(e, items) : null}
        />
    }
}

addEventListener("load", () => Dev.TOOLS.push(MenuItem.create((c: MenuItem) => {
        c.name = "Komunikacja WebApi";
        c.icon = Icon.TH_LIST;
        c.onClick = e => new RepoCtrl(R_WEBAPI).modalEdit();
    }
)));