// @flow
'use strict';
import {React, PropTypes, Field, Check} from '../core';
import {Component, FieldController} from '../components';

//ToDo: Dodać property style
export default class FormComponent extends Component {

    field: Field;

    /** domyślny FieldController do błędów i ostrzeżeń */
    _fieldCtrlErr: ?FieldController = null;
    /** domyślny FieldController do inforamcji i wymaganych */
    _fieldCtrlInfo: ?FieldController = null;

    props: {
        field: Field,
        fieldCtrl: boolean
    };

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
        fieldCtrl: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        this.field = Check.instanceOf(this.props.field, [Field]);

        if (this.props.fieldCtrl === undefined || this.props.fieldCtrl) {
            //$FlowFixMe
            this._fieldCtrlErr =
                <FieldController
                    field={this.props.field}
                    handleFieldError={true}
                    handleFieldWarning={true}
                />;
            //$FlowFixMe
            this._fieldCtrlInfo =
                <FieldController
                    field={this.props.field}
                    handleRequired={true}
                    handleInformation={true}
                />;
        }
    }

    _handleChange(done: boolean, e: ?Event, value: any) {
        this.field.set(value);
        if (done)
            this.field.validate(true);
    }
};