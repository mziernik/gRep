import {
    React,
    Utils,
    Check,
    If,
    Field,
    Repository,
    Dispatcher,
    Debug,
    CRUDE,
    Record,
    EError,
    ContextObject
} from "../../core";
import {Component, Button, Page, Icon, Spinner, Alert, Link, Attributes} from "../../components";
import AppStatus from "../../application/Status";
import {RepoAction} from "../../repository/Repository";

export default class RecordCtrl {

    page: Page;
    record: Record;
    crude: CRUDE;
    buttons: Button[] = [];
    spinner: boolean = true;

    constructor(page: Page, record: Record, crude: CRUDE) {
        this.page = page;
        this.record = record;
        this.crude = crude;
    }


    onReponse(object: any, spinner: Spinner) {
        if (spinner) spinner.hide();
        this.buttons.forEach(btn => btn.setState({disabled: false}));

        if (object instanceof Error || object instanceof EError)
            Alert.error(this, object);
    }

    commit(crude: CRUDE, onSuccess: () => void) {

        this.buttons.forEach(btn => btn.setState({disabled: true}));

        const spinner = this.spinner ? new Spinner() : null;

        const ts = new Date().getTime();

        Utils.forEach(this.record.fields, (f: Field) => f.validate(true));

        try {
            Repository.commit(this, [this.record], crude)
                .then((e, f, g) => {
                    this.onReponse(e, spinner);
                    AppStatus.success(this, "Zaktualizowano dane", "Czas: " + (new Date().getTime() - ts) + " ms");
                    if (onSuccess)
                        onSuccess();
                })
                .catch((e) => this.onReponse(e, spinner));
        } catch (e) {
            this.onReponse(e, spinner);
        }
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
            confirm = "Czy na pewno usunąć " + Utils.escape(this.record.displayName);

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

    render() {
        return <div>
            {Attributes.renderRecord(this.record, true)}
        </div>;
    }


//        onClick={e => this._saveTs = new Date().getTime()                                }
}