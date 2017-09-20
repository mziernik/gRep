import {
    React, PropTypes, Type, Utils, Field, Cell, Repository, CRUDE, Record, EError, Dev, Is, Column, DEBUG_MODE, Endpoint
} from "../../core";
import {Button, Page, Icon, Spinner, Alert, Link, ModalWindow, MW_BUTTONS, Panel} from "../../components";
import AppStatus from "../../application/Status";
import {RepoAction} from "../../repository/Repository";
import JsonViewer from "../JsonViewer";
import DTO from "./DTO";
import AttributesRecord from "./AttributesRecord";
import {PageButtons} from "../../page/Page";
import {Btn} from "../Button";
import Dispatcher from "../../utils/Dispatcher";
import * as Check from "../../utils/Check";


export default class RecordCtrl {

    record: Record;
    crude: CRUDE;
    /** Kontrolery rekordu powiązane z bieżącym (commit zostanie wykonany na wszystkich razem)*/
    _linked: RecordCtrl[] = [];
    spinner: boolean = true;
    viewer: JsonViewer;
    buttons: Btn[] = [];
    showAdvanced: boolean = false;
    local: boolean = false;
    title: string;
    _modal: ModalWindow;
    _onSuccess: (e) => void;
    showSuccessHint: boolean = true;

    _btnSave: Btn;
    _btnCancel: Btn;
    _btnDelete: Btn;
    _btnNew: Btn;

    onCommit: Dispatcher = new Dispatcher(this);

    constructor(record: Record) {
        this.record = Check.instanceOf(record, [Record]);
        this.crude = record.action;
        this.title = (record.repo.config.group ? record.repo.config.group + " :: " : "" ) + record.repo.name;
    }

    /**
     * Kliknięto przycisk "Dodaj" lub wybrano akcje menu kontekstowego
     * @param repo
     */
    static actionCreate(repo: Repository, e: Event) {
        Endpoint.devRouter.RECORD.navigate({
            repo: repo.key,
            id: "~new"
        }, e);
    }


    addLink(rec: Record | RecordCtrl) {

        if (rec instanceof RecordCtrl) {
            this._linked.push(rec);
            return rec;
        }

        if (rec instanceof Record) {
            const ctrl = new RecordCtrl(rec);
            this._linked.push(ctrl);
            return ctrl;
        }

        Check.instanceOf(rec, [Record, RecordCtrl]);
    }

    /**
     * Kliknięto przycisk "Usuń" lub wybrano akcje menu kontekstowego
     * @param repo
     */
    actionDelete(e: Event) {
        Alert.confirm(this, "Czy na pewno usunąć " + Utils.escape(this.record.repo.name)
            + " » " + Utils.escape(this.record.displayValue),
            () => this.commit(CRUDE.DELETE));
    }

    get btnNew(): Btn {
        return this._btnNew || (this._btnNew = new Btn((btn: Btn) => {
            this.buttons.push(btn);
            btn.key = "new";
            btn.type = "primary";
            btn.icon = Icon.PLUS;
            btn.text = "Nowy";
            btn.onClick = e => {
                const ctrl = new RecordCtrl(this.record.repo.createRecord(this, CRUDE.CREATE));
                ctrl.onCommit.listen(this, data => this.onCommit.dispatch(this, data));
                ctrl.modalEdit();
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
            // btn.icon = Icon.CHEVRON_LEFT;
            btn.text = "Wstecz";
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
            btn.onClick = e => this.actionDelete(e);
            btn.modalClose = !this._modal;
            //    btn._visible = this.crude === CRUDE.CREATE;
        }));
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

    get allControllers(): RecordCtrl[] {
        const result = [];
        const visit = (ctrl: RecordCtrl) => {
            result.push(ctrl);
            Utils.forEach(ctrl._linked, c => visit(c));
        };
        visit(this);
        return result;
    }

    commit(crude: ?CRUDE, onSuccess: () => void) {

        if (!crude)
            crude = this.record.action;
        this.record.action = crude;

        const all: RecordCtrl[] = this.allControllers;

        if (crude !== CRUDE.DELETE && Utils.find(all, (c: RecordCtrl) => !c.validate())) return false;

        this.buttons.forEach(btn => btn.disabled = true);
        const spinner = this.spinner ? Spinner.create() : null;

        const ts = new Date().getTime();

        try {
            Repository.commit(this, Utils.forEach(all, c => c.record))
                .then((e) => {

                    const arr = Utils.asArray(e);


                    this.onReponse(e, spinner);
                    if (this.showSuccessHint)
                        if (arr.length === 1 && arr[0] === null)
                            AppStatus.info(this, "Brak zmian");
                        else
                            AppStatus.success(this, "Zaktualizowano dane", DEBUG_MODE ? "Czas: " + (new Date().getTime() - ts) + " ms" : null);

                    if (onSuccess)
                        onSuccess();

                    this.onCommit.dispatch(this, {
                        record: this.record,
                        result: e
                    });

                    if (this._onSuccess)
                        this._onSuccess(e);
                    if (this._modal)
                        this._modal.close();
                })
                .catch((e) => this.onReponse(e, spinner));
        } catch (e) {
            Dev.error(this, e);
            this.onReponse(e, spinner);
        }
    }

    /*
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
                            <span className="record-navigator-label">{prev.displayValue}</span>
                        </div>
                    </div>
                }

                {!next ? null :
                    <div style={{textAlign: "right"}}>
                        <div onClick={e => {
                            new RecordCtrl(next).modalEdit();
                            this._modal.close(e);
                        }}>
                            <span className="record-navigator-label">{next.displayValue}</span>
                            <span className={Icon.CHEVRON_RIGHT}/>
                        </div>
                    </div>
                }
            </div>
        }
    */
    render(modal: ModalWindow): AttributesRecord {

        const page = this.record.repo.recordPage;
        const props = {
            modal: modal,
            recordCtrl: this,
            record: this.record,
            repository: this.record.repo,
            id: this.record.action === CRUDE.CREATE ? "~new" : this.record.pk
        };

        if (Is.clazz(page))
            return React.createElement(page, props, null);

        if (Is.func(page))
            return page(props);


        const repo: Repository = this.record.repo;
        return <div>
            <AttributesRecord
                recordCtrl={this}
                fit={true}
                edit={repo.canUpdate || repo.canCreate}
                showAdvanced={this.showAdvanced}
                local={this.local}
            />
            {/*{this.renderNavBar()}*/}
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
                {this.render(mw)}
            </Panel>;
            mw.mainStyle = {
                minWidth: "50%",
                minHeight: "50%"
            };

            mw.title.set(this.title || (this.record.action === CRUDE.CREATE
                ? "Tworzenie rekordu " + Utils.escape(this.record.repo.name)
                : "Edycja rekordu " + Utils.escape(this.record.displayValue)));


            const btns: PageButtons = mw.buttons = new PageButtons();

            const repo: Repository = this.record.repo;

            btns.list.push(mw.btnCancel);
            if (repo.canCreate && this.record.action !== CRUDE.CREATE)
                btns.list.push(this.btnNew);

            btns.list.push(repo.canDelete && this.btnDelete);
            btns.list.push((repo.canUpdate || repo.canCreate) && this.btnSave);

            this.btnDelete._visible = this.record.action !== CRUDE.CREATE;
            mw.onClose = () => this._modal = null;

        }).open();
    }

}


