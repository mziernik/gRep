// @flow
'use strict';
import {React, PropTypes, Field, Check} from '../../core';
import {Component} from '../../components';


export default class FormComponent extends Component {

    field: Field;

    props: {
        field: Field
    };

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
    };

    constructor() {
        super(...arguments);
        this.field = Check.instanceOf(this.props.field, [Field]);
    }

    _handleChange(done: boolean, e: ?Event, value: any) {
        this.field.set(value);
        if (done)
            this.field.validate(true);
    }
};