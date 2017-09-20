import {React, Utils, Repository, Endpoint, CRUDE, Record} from "../../core";
import {Button, Page, MenuItem, PopupMenu, ModalWindow, Panel, Icon} from "../../components";
import {RepoAction} from "../../repository/Repository";
import {PageButtons} from "../../page/Page";
import {Btn} from "../Button";
import RecordCtrl from "./RecordCtrl";
import * as Check from "../../utils/Check";
import * as Is from "../../utils/Is";


export default class RepoCtrl {

    repo: Repository;
    _modal: ModalWindow;
    title: string;

    constructor(repo: Repository) {
        this.repo = Check.instanceOf(repo, [Repository]);
    }


    addModal() {
        const rec: Record = this.repo.createRecord(this, CRUDE.CREATE);
        new RecordCtrl(rec).modalEdit();
        return false;
    }

    modalEdit() {
        ModalWindow.create((mw: ModalWindow) => {
            this._modal = mw;
            mw.content = <Panel fit noPadding>
                {this.render(mw)}
            </Panel>;
            mw.title.set(this.title || this.repo.name);
            mw.mainStyle = {
                width: "60%",
                height: "80%"
            };

            const btns: PageButtons = mw.buttons = new PageButtons();
            btns.add((btn: Btn) => {
                btn.type = "primary";
                btn.text = "Dodaj";
                btn.icon = Icon.PLUS;
                btn.modalClose = false;
                btn.onClick = e => this.addModal();
            });
            mw.onClose = () => this._modal = null;

        }).open();

    }


    render(modal: ModalWindow) {

        const page = this.repo.repoPage;
        const props = {
            modal: modal,
            repoCtrl: this,
            repository: this.repo,
            id: this.repo.key
        };

        if (Is.clazz(page))
            return React.createElement(page, props, null);

        if (Is.func(page))
            return page(props);

        const RepoTable = require("./RepoTable").default;
        return <RepoTable
            style={{border: "none"}}
            modalEdit={true}
            repository={this.repo}
        />
    }

    tabEdit() {
        Endpoint.devRouter.REPO.navigate({repo: this.repo.key}, "tab");
    }
}