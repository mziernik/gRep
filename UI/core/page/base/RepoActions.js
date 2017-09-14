import Repository from "../../repository/Repository";
import Record from "../../repository/Record";
import ParamsWindow from "./ParamsWindow";
import RepoAction from "../../repository/RepoAction";
import Alert from "../../component/alert/Alert";
import Spinner from "../../component/Spinner";
import AppStatus from "../../application/Status";
import * as Utils from "../../utils/Utils";
import {MenuItem, PopupMenu} from "../../component/PopupMenu";
import {Btn} from "../../component/Button";
import * as CRUDE from "../../repository/CRUDE";

export default class RepoActions {

    repo: Repository;
    record: Record;
    wnd: ParamsWindow;

    constructor(repo: Repository, record: Record) {
        this.repo = repo;
        this.record = record;
    }

    _exec(act: RepoAction, confirmed: boolean, params: Object) {

        if (act.confirm && !confirmed) {
            Alert.confirm(this, act.confirm, () => this._exec(act, true, null));
            return;
        }

        if (act.params && !params && Object.keys(act.params).length) {
            this.wnd = new ParamsWindow(act.params, params => this._exec(act, true, params));
            this.wnd.title = act.paramsTitle;
            this.wnd.confirmButtonLabel = act.paramsButtonLabel;
            this.wnd.open();
            return;
        }

        const spinner: Spinner = Spinner.modal("Wykonuję akcję " + Utils.escape(act.name));

        act.execute(this.record, params)
            .then(() => {
                this.wnd && this.wnd.close();
                spinner.hide();
                AppStatus.success(this, "Wykonano akcję " + Utils.escape(act.name));
            })
            .catch(e => {
                spinner.hide();
                Alert.error(this, e);
            });
    };

    _forEach(consumer: (act: RepoAction) => any) {
        return Utils.forEach(this.repo.actions, (act: RepoAction) => act.isVisible(this.record) ? consumer(act) : undefined);
    }

    _createMenuItem(act: RepoAction) {
        return MenuItem.create((item: MenuItem) => {
            item.name = act.name;
            item.icon = act.icon;

            if (act.children && act.children.length)
                item.subMenu = Utils.forEach(act.children, (a: RepoAction) => this._createMenuItem(a));
            else
                item.onClick = (e, props) => this._exec(act);
        });
    }

    renderMenuItems(): MenuItem[] {
        return this._forEach((act: RepoAction) => this._createMenuItem(act));
    }

    renderButtons(): Btn[] {
        return this._forEach((act: RepoAction) => new Btn((btn: Btn) => {
                btn.key = act.key;
                btn.type = act.type;
                btn.icon = act.icon;
                btn.text = act.name;
                btn.onClick = e => {
                    if (act.children && act.children.length) {
                        PopupMenu.open(e, Utils.forEach(act.children, (a: RepoAction) => this._createMenuItem(a)));
                        if (act.action)
                            act.action();
                        return;
                    }
                    this._exec(act);
                }
            })
        );
    }


}