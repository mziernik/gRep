import {React, Utils, Repository, Endpoint, CRUDE, Record} from "../../core";
import {Button, Page, MenuItem, PopupMenu, ModalWindow, Panel, Icon} from "../../components";
import {RepoAction} from "../../repository/Repository";
import {PageButtons} from "../../page/Page";
import {Btn} from "../Button";
import RecordCtrl from "./RecordCtrl";


export default class RepoCtrl {

    repo: Repository;
    _modal: ModalWindow;
    title: string;

    constructor(repo: Repository) {
        this.repo = repo;
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
                {this.render()}
            </Panel>;
            mw.title.set(this.title || this.repo.name);
            mw.mainStyle = {
                width: "50%"
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

    render() {
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

    renderActionButtons(buttons: PageButtons) {
        Utils.forEach(this.repo.config.actions, (act: RepoAction) => {
                if (act.rec) return;
                buttons.add((btn: Btn) => {
                    btn.key = act.key;
                    btn.icon = act.icon;
                    btn.text = act.name;
                    btn.confirm = act.confirm;
                    btn.onClick = e => {
                        if (act.children && act.children.length) {
                            PopupMenu.openMenu(e, Utils.forEach(act.children, (a: RepoAction) =>
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = a.name;
                                    item.icon = a.icon;
                                    item.onClick = (e, props) => a.execute()
                                })));
                            if (act.action)
                                act.action();
                            return;
                        }
                        act.execute();
                    }
                });
            }
        );
    }

}