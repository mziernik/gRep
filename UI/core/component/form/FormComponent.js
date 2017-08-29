// @flow
'use strict';
import {React, PropTypes, Field, Check, EError, Utils} from '../../core';
import {Component} from '../../components';


export default class FormComponent extends Component {

    field: Field;


    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
    };

    constructor() {
        super(...arguments);
        this.field = Check.instanceOf(this.props.field, [Field]);
    }

    _handleChange(done: boolean, e: ?Event, value: any) {
        let x = Utils.className(value);

        try {
            this.field.set(value);
            if (done)
                this.field.validate(true);
        } catch (e) {
            this.field.error = new EError(e).message;
        }
    }
};