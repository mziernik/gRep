import {React, Utils, Field, Column, AppStatus, DEBUG_MODE} from "../../core.js";
import {Icon} from "../../components.js";
import {ModalWindow} from "../../component/ModalWindow";
import {Btn} from "../../component/Button";
import {PageButtons} from "../../page/Page";
import {Attr, Attributes} from "../../component/form/Attributes";

export default class ParamsWindow {

    params: Field[];
    title: string;
    onSuccess: (params: {}) => void;

    constructor(params: {}, onSuccess: (params: {}) => void) {
        this.onSuccess = onSuccess;

        this.params = Utils.forEach(params, (obj, name) =>
            new Field((c: Column) => {
                c.key = name;
                for (let n in obj)
                    c[n] = obj[n];
            }));
    }

    validate(): boolean {
        const errors = [];

        Utils.forEach(this.params, (f: Field) => {
            if (!f.validate(true))
                errors.push(f.name + ": " + f.error);
        });

        if (!errors.isEmpty())
            AppStatus.error(this, errors.join("\n"), null, 1000);

        return errors.isEmpty();
    }

    render() {
        return <div style={{padding: "30px", width: "100%"}}>
            <Attributes edit fit>
                {Utils.forEach(this.params, (f: Field) => <Attr field={f}/>)}
            </Attributes>
        </div>
    }

    open() {
        ModalWindow.create((mw: ModalWindow) => {
            this._modal = mw;
            mw.title.set(this.title || "Parametry");
            mw.icon.set(Icon.TH_LIST);
            mw.content = this.render();

            const btns: PageButtons = mw.buttons = new PageButtons();

            btns.add((btn: Btn) => {
                btn.type = "primary";
                btn.text = "OK";
                btn.modalClose = false;
                btn.onClick = e => {
                    if (!this.validate()) return;
                    const result = {};
                    Utils.forEach(this.params, (field: Field) => result[field.key] = field.serializedValue);
                    this.onSuccess(result);
                    mw.close(e);
                };
            });

        }).open();
    }


}

