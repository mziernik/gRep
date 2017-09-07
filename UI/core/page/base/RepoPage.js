// @flow

import {React, Repository, Endpoint, Is, Record} from "../../core.js";
import {Page, Panel, Icon, Button} from "../../components.js";
import RepoTable from "../../component/repository/RepoTable";
import {object} from "../../utils/Is";
import {Btn} from "../../component/Button";
import RepoCtrl from "../../component/repository/RepoCtrl";
import {Utils} from "../../$utils";
import {MenuItem, PopupMenu} from "../../component/PopupMenu";
import {RepoAction} from "../../repository/Repository";
import Alert from "../../component/alert/Alert";
import ParamsWindow from "./ParamsWindow";


export default class RepoPage extends Page {

    repo: Repository;

    constructor(repository: Repository | string, props: Object, context: Object, updater: Object) {
        super(props, context, updater);
        this.repo = repository;

        const callOnReady = (list: Repository[]) => this.whenComponentIsReady.listen(this, () => this.onReady(this.repo, list));

        const list: Repository[] = this.requireRepo(repository, (repos: Repository[]) => {
            if (!this.repo || !(this.repo instanceof Repository))
                this.repo = repos[0];
            callOnReady(repos);
            // this.onReady(this.repo, repos);
            this.forceUpdate(true);
        });
        if (list && (!this.repo || !(this.repo instanceof Repository)))
            this.repo = list[0];

        if (list)
            callOnReady(list);
    }

    /** Repozytorium jest gotowe (zainicjowane), można na nim operować*/
    onReady(repo: Repository, list: Repository[]) {

    }

    renderActionButtons(record: Record): Btn[] {

        const exec = (act: RepoAction, confirmed: boolean) => {

            if (act.confirm && !confirmed) {
                Alert.confirm(this, act.confirm, () => exec(act, true));
                return;
            }


            if (Object.keys(act.params).length) {
                new ParamsWindow(act.params, params => act.execute(record, params)).open();
                return;
            }


            act.execute(record);
        };

        return Utils.forEach(this.repo.actions, (act: RepoAction) => {


                if (act.record !== !!record) return;

                return this.buttons.add((btn: Btn) => {
                    btn.key = act.key;
                    btn.type = act.type;
                    btn.icon = act.icon;
                    btn.text = act.name;
                    btn.confirm = act.confirm;
                    btn.onClick = e => {
                        if (act.children && act.children.length) {
                            PopupMenu.openMenu(e, Utils.forEach(act.children, (a: RepoAction) =>
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = a.name;
                                    item.icon = a.icon;
                                    item.onClick = (e, props) => exec(a);
                                })));
                            if (act.action)
                                act.action();
                            return;
                        }
                        exec(act);
                    }
                })
            }
        );
    }

}

