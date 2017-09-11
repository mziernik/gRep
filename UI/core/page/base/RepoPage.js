// @flow

import {React, Repository, Endpoint, Is, Record, CRUDE} from "../../core.js";
import {Page, Panel, Icon, Button} from "../../components.js";
import RepoTable from "../../component/repository/RepoTable";
import {object} from "../../utils/Is";
import {Btn} from "../../component/Button";
import RepoCtrl from "../../component/repository/RepoCtrl";
import {Utils} from "../../$utils";
import {MenuItem, PopupMenu} from "../../component/PopupMenu";
import RepoAction from "../../repository/RepoAction";
import Alert from "../../component/alert/Alert";
import ParamsWindow from "./ParamsWindow";
import Spinner from "../../component/Spinner";
import StatusHint from "../../component/application/StatusHint";
import AppStatus from "../../application/Status";


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

        let wnd: ParamsWindow;

        const exec = (act: RepoAction, confirmed: boolean, params: Object) => {

            if (act.confirm && !confirmed) {
                Alert.confirm(this, act.confirm, () => exec(act, true, null));
                return;
            }

            if (act.params && !params && Object.keys(act.params).length) {
                wnd = new ParamsWindow(act.params, params => exec(act, true, params));
                wnd.title = act.paramsTitle;
                wnd.confirmButtonLabel = act.paramsButtonLabel;
                wnd.open();
                return;
            }

            const spinner: Spinner = Spinner.modal("Wykonuję akcję " + Utils.escape(act.name));

            act.execute(record, params)
                .then(() => {
                    wnd && wnd.close();
                    spinner.hide();
                    AppStatus.success(this, "Wykonano akcję " + Utils.escape(act.name));
                })
                .catch(e => {
                    spinner.hide();
                    Alert.error(this, e);
                });
        };

        return Utils.forEach(this.repo.actions, (act: RepoAction) => {
                if (act.record !== !!record) return;

                if (act.record && act.edit === true && record.action !== CRUDE.UPDATE)
                    return;

                if (act.record && act.edit === false && record.action !== CRUDE.CREATE)
                    return;

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

