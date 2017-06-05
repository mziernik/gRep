//@Flow
'use strict';
import {React, PropTypes} from '../core';
import {FormComponent} from '../components';
import {DropdownList} from 'react-widgets';

export default class Select extends FormComponent {

    constructor() {
        super(...arguments);
    }

    render() {
        return (
            <span>
                {this._fieldCtrlInfo}
                <DropdownList
                    data={this.field._enumerate}
                    readOnly={this.field._readOnly}
                    placeholder={this.field._title}
                    onChange={(value) => this._handleChange(false, null, value)}
                    messages={{
                        open: 'Rozwiń',
                        filterPlaceholder: 'Wyszukaj...',
                        emptyList: 'Brak pozycji do wyświetlenia.',
                        emptyFilter: 'Brak wyników.'
                    }}
                />
                {this._fieldCtrlErr}
            </span>
        )
    }
}