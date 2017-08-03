import {React, Utils} from "../../core";
import {Page, Component, Table, Panel, ModalWindow, MW_BUTTONS} from "../../components";
import WebApi from "../../webapi/WebApi";
import RepoCtrl from "../../component/repository/RepoCtrl";
import * as WebApiRepo from "../../repository/WebApiRepo";
import RepoTable from "../../component/repository/RepoTable";
import {EWebApi} from "../../repository/WebApiRepo";
import JsonViewer from "../../component/JsonViewer";


export default class PWebApi extends Page {

    constructor() {
        super(...arguments);
        this.requireRepo(WebApiRepo.RWEBAPI);
    }

    render() {

        const api: WebApi = WebApi.instance;

        const rctrl: RepoCtrl = new RepoCtrl(this, WebApiRepo.RWEBAPI);

        return [
            <div>
                <span>URL:</span>
                <a href={api.url}>{api.url} </a>
            </div>,
            <RepoTable
                key={Utils.randomId()}
                repository={WebApiRepo.RWEBAPI}
                onClick={(rec: EWebApi, row, column, instance, e) => {
                    ModalWindow.create((mw: ModalWindow) => {
                        mw.content = <JsonViewer object={rec.DATA.value}/>
                        mw.title = "Dane";
                    }).open();
                }}/>
        ]
    }

}

