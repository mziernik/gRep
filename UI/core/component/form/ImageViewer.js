// @flow
import {React, PropTypes, Utils, Field, Type, Check} from '../../core';
import {FormComponent, Icon} from '../../components';
import {ModalWindow} from "../ModalWindow";
import {BinaryData} from "../../repository/Type";

export default class ImageViewer {

    field: Field;

    constructor(field: Field) {
        this.field = field;
        Check.oneOf(field.type, Type.IMAGE);
    }

    show() {

        debugger;

        const data: BinaryData = this.field.value;

        ModalWindow.create((mw: ModalWindow) => {

        }).open()

    }

}