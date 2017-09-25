// @flow
import {React, PropTypes, Utils, Field, Type, Check} from '../../core';
import {FormComponent, Icon} from '../../components';
import {ModalWindow} from "../modal/ModalWindow";
import {BinaryData, UploadData} from "../../repository/Type";
import API from "../../application/API";
import {Btn} from "../Button";

export default class ImageViewer {

    field: Field;
    img: HTMLImageElement;
    input: HTMLInputElement;
    editable: boolean;

    constructor(field: Field, editable: boolean) {
        this.field = field;
        this.editable = editable;
        Check.oneOf(field.type, Type.IMAGE);
    }


    _display(data: BinaryData) {

        // klon pola
        const field: Field = this.field.clone();

        ModalWindow.create((mw: ModalWindow) => {

            mw.title.set("Podgląd " + Utils.escape(this.field.name));

            if (this.editable) {
                mw.button((btn: Btn) => {
                    btn.title = btn.text = "Przeglądaj";
                    btn.type = "primary";
                    btn.modalClose = false;
                    btn.onClick = e => this.input && this.input.click(e);
                });


                mw.button((btn: Btn) => {
                    btn.title = btn.text = "Usuń";
                    btn.type = "danger";
                    btn.modalClose = true;
                    btn.onClick = e => this.field.value = null;
                });


                mw.button((btn: Btn) => {
                    btn.title = btn.text = "Zapisz";
                    btn.type = "success";
                    btn.modalClose = true;
                    btn.onClick = e => {
                        debugger;
                        this.field.value = field.value;
                    };
                });
            }

            mw.content = <div>
                <img
                    ref={e => {
                        this.img = e;
                        const udata: UploadData = data;
                        if (!e || !(data instanceof UploadData) || !udata.file) return;
                        // wczytanie obrazka, który został podmieniony (oczekuje na upload)
                        const reader: FileReader = new FileReader();
                        reader.onload = e => this.img.src = reader.result;
                        reader.readAsDataURL(udata.file);
                    }}
                    src={data.href} style={{
                    margin: "10px",
                    boxShadow: "4px 4px 4px #888",
                    border: "1px solid #aaa"
                }}
                    onClick={e => this.input && this.input.click(e)}
                />
                <input
                    ref={e => this.input = e}
                    accept="image/*"
                    type="file"
                    name={field.key}
                    style={{display: "none", cursor: "pointer"}}
                    onChange={e => {
                        const file: File = e.currentTarget.files[0];

                        if (!this.img || !file) return;

                        const reader: FileReader = new FileReader();
                        reader.onload = e => this.img.src = reader.result;
                        reader.readAsDataURL(file);

                        API.uploadFile(field, e.currentTarget);
                    }}
                />

            </div>;
        }).open()
    }

    show() {
        const data: BinaryData = this.field.value;

        if (!data.href) {
            API.downloadFile(this.field, (d: BinaryData) => this._display(d));
            return;
        }
        this._display(data);
    }

}