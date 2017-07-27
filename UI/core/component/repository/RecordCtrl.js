import {React, PropTypes, Type, Utils, Field, Repository, CRUDE, Record, EError, Dev} from "../../core";
import {Button, Page, Icon, Spinner, Alert, Link, ModalWindow, MW_BUTTONS, Panel} from "../../components";
import AppStatus from "../../application/Status";
import {RepoAction} from "../../repository/Repository";
import JsonViewer from "../JsonViewer";
import DTO from "./DTO";
import AttributesRecord from "./AttributesRecord";

export default class RecordCtrl {

    page: Page;
    record: Record;
    crude: CRUDE;
    buttons: Button[] = [];
    spinner: boolean = true;
    viewer: JsonViewer;

    constructor(page: Page, record: Record) {
        this.page = page;
        this.record = record;
        this.crude = record.action;
    }


    onReponse(object: any, spinner: Spinner) {
        if (spinner) spinner.hide();
        this.buttons.forEach(btn => btn.setState({disabled: false}));

        if (object instanceof Error || object instanceof EError)
            Alert.error(this, object);
    }

    commit(crude: CRUDE, onSuccess: () => void) {
        this.record.action = crude;

        if (!this.validate())
            return false;

        this.buttons.forEach(btn => btn.setState({disabled: true}));
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
        return <AttributesRecord record={this.record} fill={true} edit={true}/>
    }

    createButtons(): [] {
        return [this.createCancelButton(), this.createDeleteButton(), this.createSaveButton()];
    }

    createSaveButton(onSuccess: () => void) {

        if (!onSuccess)
            onSuccess = () => window.history.back();

        return <Button
            key="btnSave"
            ref={btn => this.buttons.push(btn)}
            icon={Icon.CHECK}
            type="success"
            onClick={e => this.commit(this.crude, onSuccess)}
        > {this.crude === CRUDE.CREATE ? "Utwórz" : "Zapisz"} </Button>
    }


    createCancelButton(onSuccess: () => void) {
        return <Button
            key="btnCancel"
            ref={btn => this.buttons.push(btn)}
            icon={Icon.CHEVRON_LEFT}
            type="default"
            onClick={e => window.history.back()}
        >Anuluj</Button>
    }

    createDeleteButton(confirm: string) {

        if (confirm === undefined)
            confirm = "Czy na pewno usunąć " + Utils.escape(this.record.displayValue);

        return this.crude === CRUDE.CREATE ? null :
            <Button
                key="btnDelete"
                ref={btn => this.buttons.push(btn)}
                icon={Icon.TIMES}
                type="danger"
                confirm={confirm} onClick={e => this.commit(CRUDE.DELETE)}>Usuń</Button>
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
        return Utils.forEach(this.record.fields, (f: Field) => f.validate(true) ? undefined : true).length === 0;
    }

    editModal(onConfirm: () => boolean) {


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


