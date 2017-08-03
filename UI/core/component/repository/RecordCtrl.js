import {React, PropTypes, Type, Utils, Field, Repository, CRUDE, Record, EError, Dev, Is} from "../../core";
import {Button, Page, Icon, Spinner, Alert, Link, ModalWindow, MW_BUTTONS, Panel} from "../../components";
import AppStatus from "../../application/Status";
import {RepoAction} from "../../repository/Repository";
import JsonViewer from "../JsonViewer";
import DTO from "./DTO";
import AttributesRecord from "./AttributesRecord";
import {PageButtons} from "../../page/Page";
import {Btn} from "../Button";

export default class RecordCtrl {

    page: Page;
    record: Record;
    crude: CRUDE;
    spinner: boolean = true;
    viewer: JsonViewer;
    buttons: Btn[] = [];
    showAdvances: boolean;
    local: boolean;

    constructor(page: Page, record: Record) {
        this.page = page;
        this.record = record;
        this.crude = record.action;
    }


    goBack(isCommit: boolean) {
        if (!isCommit && (!this.page || !this.page.modal))
            window.history.back();
    }

    onReponse(object: any, spinner: Spinner) {
        if (spinner) spinner.hide();

        if (!this.page.modal)
            this.buttons.forEach(btn => btn.disabled = false);

        if (object instanceof Error || object instanceof EError)
            Alert.error(this, object);
    }

    commit(crude: CRUDE, onSuccess: () => void) {
        this.record.action = crude;

        if (!this.validate()) return false;

        this.buttons.forEach(btn => btn.disabled = true);
        const spinner = this.spinner ? new Spinner() : null;

        const ts = new Date().getTime();


        try {
            Repository.commit(this, [this.record])
                .then((e, f, g) => {
                    this.onReponse(e, spinner);
                    AppStatus.success(this, "Zaktualizowano dane", "Czas: " + (new Date().getTime() - ts) + " ms");
                    if (onSuccess)
                        onSuccess();
                })
                .catch((e) => this.onReponse(e, spinner));
        } catch (e) {
            Dev.error(this, e);
            this.onReponse(e, spinner);
        }
    }

    render(): AttributesRecord {
        return <AttributesRecord record={this.record} fill={true} edit={true} showAdvanced={this.showAdvances}
                                 local={this.local}/>
    }

    /** Dodaje przyciski obsługi rekordu do paska nawigacyjnego strony */
    createButtons(btns: PageButtons): [] {
        this.buttons.clear();
        Is.def(this.saveButton(), btn => btns.buttons.unshift(btn));
        Is.def(this.deleteButton(), btn => btns.buttons.unshift(btn));
        Is.def(this.cancelButton(), btn => btns.buttons.unshift(btn));
    }

    saveButton(onSuccess: () => void): Btn {

        if (!onSuccess)
            onSuccess = () => this.goBack(true);

        const btn = new Btn((btn: Btn) => {
            btn.key = "btnSave";
            btn.type = "success";
            btn.icon = Icon.CHECK;
            btn.text = this.crude === CRUDE.CREATE ? "Utwórz" : "Zapisz";
            btn.onClick = e => this.commit(this.crude, onSuccess);
        });
        this.buttons.push(btn);
        return btn;
    }


    cancelButton(onSuccess: (e) => void) {

        if (!onSuccess)
            onSuccess = e => this.goBack(true);

        const btn = new Btn((btn: Btn) => {
            btn.key = "btnCancel";
            btn.type = "default";
            btn.icon = Icon.CHEVRON_LEFT;
            btn.text = "Anuluj";
            btn.onClick = e => onSuccess(e);
        });
        this.buttons.push(btn);
        return btn;
    }

    deleteButton(confirm: string, onSuccess: (e) => void) {

        if (this.crude === CRUDE.CREATE) return null;

        if (confirm === undefined)
            confirm = "Czy na pewno usunąć " + Utils.escape(this.record.displayValue);


        const btn = new Btn((btn: Btn) => {
            btn.key = "btnDelete";
            btn.type = "danger";
            btn.icon = Icon.TIMES;
            btn.text = "Usuń";
            btn.onClick = e => this.commit(CRUDE.DELETE, onSuccess);
        });
        this.buttons.push(btn);
        return btn;
    }


    renderActionButtons(): [] {
        return Utils.forEach(this.record.repo.config.actions, (act: RepoAction) => !act.rec ? null : <Link
            key={act.key}
            icon={act.icon}
            title={act.name}
            confirm={act.confirm}
            onClick={e => {
                this.record.repo.storage.action(this.record.repo, act.key, this.record.pk, {})
            }}
        />);
    }

    renderDTO() {
        return <DTO record={this.record}/>
    }

    validate(): boolean {
        const errors = [];

        Utils.forEach(this.record.fields, (f: Field) => {
            if (!f.validate(true))
                errors.push(f.name + ": " + f.error);
        });

        if (!errors.isEmpty())
            AppStatus.error(this, errors.join("\n"), null, 1000);

        return errors.isEmpty();
    }

    renderEdit(modal: boolean, onConfirm: () => boolean) {


        ModalWindow.create((mw: ModalWindow) => {
            mw.content = <Panel fill>{this.render()}</Panel>;
            mw.title = this.record.action === CRUDE.CREATE
                ? "Tworzenie rekordu " + Utils.escape(this.record.repo.name)
                : "Edycja rekordu " + Utils.escape(this.record.displayValue);
            mw.buttons = MW_BUTTONS.OK_CANCEL;
            mw.onConfirm = () => {

                if (!this.validate())
                    return false;

                if (onConfirm)
                    return onConfirm();
                this.commit(CRUDE.UPDATE, () => mw.close());
            }

        }).open();
    }

}


