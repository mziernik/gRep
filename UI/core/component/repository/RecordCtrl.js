import {
    React, PropTypes, Type, Utils, Field, Cell, Repository, CRUDE, Record, EError, Dev, Is, Column
} from "../../core";
import {Button, Page, Icon, Spinner, Alert, Link, ModalWindow, MW_BUTTONS, Panel} from "../../components";
import AppStatus from "../../application/Status";
import {RepoAction} from "../../repository/Repository";
import JsonViewer from "../JsonViewer";
import DTO from "./DTO";
import AttributesRecord from "./AttributesRecord";
import {PageButtons} from "../../page/Page";
import {Btn} from "../Button";

export default class RecordCtrl {

    record: Record;
    crude: CRUDE;
    spinner: boolean = true;
    viewer: JsonViewer;
    buttons: Btn[] = [];
    showAdvanced: boolean = false;
    local: boolean = false;
    title: string;
    _modal: ModalWindow;
    _onSuccess: () => void;
    showSuccessHint: boolean = true;

    _btnSave: Btn;
    _btnCancel: Btn;
    _btnDelete: Btn;
    _btnNew: Btn;


    get btnNew(): Btn {
        return this._btnNew || (this._btnNew = new Btn((btn: Btn) => {
            this.buttons.push(btn);
            btn.key = "new";
            btn.type = "primary";
            btn.icon = Icon.PLUS;
            btn.text = "Nowy";
            btn.onClick = e => {
                new RecordCtrl(this.record.repo.createRecord(this, CRUDE.CREATE)).modalEdit();
                if (this._modal)
                    this._modal.close(e);
            };
            btn.modalClose = !this._modal;
        }));

    }

    get btnSave(): Btn {
        return this._btnSave || (this._btnSave = new Btn((btn: Btn) => {
            this.buttons.push(btn);
            btn.key = "save";
            btn.type = "success";
            btn.icon = Icon.CHECK;
            btn.text = this.crude === CRUDE.CREATE ? "Utwórz" : "Zapisz";
            btn.onClick = e => this.commit(this.crude);
            btn.modalClose = !this._modal;
        }));

    }

    get btnBack(): Btn {
        return this._btnCancel || (this._btnCancel = new Btn((btn: Btn) => {
            this.buttons.push(btn);
            btn.key = "back";
            btn.type = "default";
            btn.icon = Icon.CHEVRON_LEFT;
            btn.text = "Anuluj";
            btn.onClick = e => this.goBack(false);
        }));
    }

    get btnDelete(): Btn {
        return this._btnDelete || (this._btnDelete = new Btn((btn: Btn) => {
            this.buttons.push(btn);
            btn.key = "delete";
            btn.type = "danger";
            btn.icon = Icon.TIMES;
            btn.text = "Usuń";
            btn.confirm = "Czy na pewno usunąć " + Utils.escape(this.record.displayValue);
            btn.onClick = e => this.commit(CRUDE.DELETE);
            btn.modalClose = !this._modal;
            //    btn._visible = this.crude === CRUDE.CREATE;
        }));
    }


    constructor(record: Record) {
        this.record = record;
        this.crude = record.action;
        this.title = record.repo.name;
    }


    goBack(isCommit: boolean) {
        if (!isCommit && (!this._modal))
            window.history.back();
    }

    onReponse(object: any, spinner: Spinner) {
        if (spinner) spinner.hide();

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
                    if (this.showSuccessHint)
                        AppStatus.success(this, "Zaktualizowano dane", "Czas: " + (new Date().getTime() - ts) + " ms");
                    if (onSuccess)
                        onSuccess();
                    if (this._onSuccess)
                        this._onSuccess();
                    if (this._modal)
                        this._modal.close();
                })
                .catch((e) => this.onReponse(e, spinner));
        } catch (e) {
            Dev.error(this, e);
            this.onReponse(e, spinner);
        }
    }

    renderNavBar() {

        if (this.record.action === CRUDE.CREATE) return null;

        const pk = this.record.pk;

        let prevPk = null;
        let nextPk = null;
        let found = false;


        Utils.forEach(this.record.repo.rows, (val, key, stop) => {
            if (found) {
                nextPk = key;
                stop();
                return;
            }
            if (key === pk) {
                found = true;
                return;
            }
            prevPk = key;

        });

        if (!nextPk && !prevPk) return null;


        const prev: Record = this.record.repo.get(null, prevPk, false);
        const next: Record = this.record.repo.get(null, nextPk, false);

        return <div className="record-navigator">
            {!prev ? null :
                <div>
                    <div onClick={e => {
                        new RecordCtrl(prev).modalEdit();
                        this._modal.close(e);
                    }}>
                        <span className={Icon.CHEVRON_LEFT}/>
                        <span>{prev.displayValue}</span>
                    </div>
                </div>
            }

            {!next ? null :
                <div style={{textAlign: "right"}}>
                    <div onClick={e => {
                        new RecordCtrl(next).modalEdit();
                        this._modal.close(e);
                    }}>
                        <span>{next.displayValue}</span>
                        <span className={Icon.CHEVRON_RIGHT}/>
                    </div>
                </div>
            }
        </div>
    }

    render(): AttributesRecord {

        return <div>
            {this.renderNavBar()}
            <AttributesRecord
                recordCtrl={this}
                fit={true}
                edit={true}
                showAdvanced={this.showAdvanced}
                local={this.local}
            />
        </div>

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


    modalEdit(onSuccess: () => void) {
        this._onSuccess = onSuccess;
        ModalWindow.create((mw: ModalWindow) => {
            this._modal = mw;
            mw.content = <Panel fit style={{padding: "30px"}}>
                {this.render()}
            </Panel>;
            mw.title.set(this.title || (this.record.action === CRUDE.CREATE
                ? "Tworzenie rekordu " + Utils.escape(this.record.repo.name)
                : "Edycja rekordu " + Utils.escape(this.record.displayValue)));


            const btns: PageButtons = mw.buttons = new PageButtons();

            btns.list.push(mw.btnCancel);
            if (this.record.action !== CRUDE.CREATE)
                btns.list.push(this.btnNew);
            btns.list.push(this.btnDelete);
            btns.list.push(this.btnSave);

            this.btnDelete._visible = this.record.action !== CRUDE.CREATE;
            mw.onClose = () => this._modal = null;

        }).open();
    }

}


