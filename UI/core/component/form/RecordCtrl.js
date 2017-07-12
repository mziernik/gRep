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
import {Component, Button, Page, FontAwesome, Spinner, Alert} from "../../components";
import AppStatus from "../../application/Status";

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


        /* if (this.props.crude && this.props.record)
         (this.props.record: Record).onFieldChange.listen(this, (field: Field) => {
         let ok = true;
         this.props.record.fields.forEach((field: Field) => {
         if (!field.isValid)
         ok = false;
         });
         this.setState({disabled: !ok});
         });*/
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

    createSaveButton(onSuccess: () => void) {
        return <Button
            key="btnSave"
            ref={btn => this.buttons.push(btn)}
            icon={FontAwesome.CHECK}
            type="success"
            onClick={e => this.commit(this.crude, onSuccess)}
        > {this.crude === CRUDE.CREATE ? "Utwórz" : "Zapisz"} </Button>
    }

    createDeleteButton(confirm: string) {
        return this.crude === CRUDE.CREATE ? null :
            <Button
                key="btnDelete"
                ref={btn => this.buttons.push(btn)}
                icon={FontAwesome.TIMES}
                type="danger"
                confirm={confirm} onClick={e => this.commit(CRUDE.DELETE)}>Usuń</Button>
    }

//        onClick={e => this._saveTs = new Date().getTime()                                }
}