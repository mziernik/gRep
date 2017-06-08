//@Flow
'use strict';
import {React, PropTypes} from '../core';
import {FormComponent, FontAwesome} from '../components';
import {DropdownList} from 'react-widgets';

export default class Select extends FormComponent {

    /** @private */
    _enumerate: [] = [];
    /** @private */
    _multiselectProps: {} = null;
    /** @private */
    _selected: boolean = false;

    props: {
        units: ?boolean
    };

    static PropTypes = {
        units: PropTypes.bool
    };


    constructor() {
        super(...arguments);
        this.state = {open: undefined};
        if (this.props.units) {
            for (let [key, value] of this.field._units)
                this._enumerate.push({text: value, value: key});
        } else {
            this.field._enumerate.map((item) => {
                this._enumerate.push({text: item[0], value: item[1], checked: false});
            });

            if (this.field._multiple)
                this._multiselectProps = {
                    onFocus: () => {
                        this.setState({open: true});
                        this._selected = true;
                    },
                    onBlur: () => this.setState({open: false}),
                    onClick: (e) => this._handleClick(e),
                    valueComponent: (props) => this._valueRenderer(props),
                    itemComponent: (props) => this._itemRenderer(props),
                    onToggle: () => {
                    }
                };
        }
    }

    /** @private */
    _handleSelect(item: { text: string, value: any, checked: boolean }) {
        if (this.props.units) {
            this.field._unit = item.value;
        } else {
            let tmp = item.value;
            if (this.field._multiple) {
                item.checked = !item.checked;
                tmp = this.field.isEmpty() ? [] : this.field._value.slice();
                if (!tmp.contains(item.value))
                    tmp.push(item.value);
                else tmp.remove(item.value);
            }
            if (tmp !== this.field._value)
                this._handleChange(false, null, tmp);
            this._selected = true;
        }
    }

    /** @private */
    _valueRenderer(props: { item: { text: string, value: any } }) {
        if (this.field.isEmpty()) return null;
        const n = this.field._value.length;
        if (n === 0) return null;
        let text = 'Wybranych pozycji: ' + n;
        return <span>{text}</span>;
    }

    /** @private */
    _itemRenderer(props: { item: { text: string, value: any, checked: boolean } }) {
        let checked = false;
        if (!this.field.isEmpty())
            checked = this.field._value.contains(props.item.value);
        return (
            <span>
                <span className={props.item.checked ? FontAwesome.CHECK_SQUARE_O : FontAwesome.SQUARE_O}
                      style={{width: '20px'}}/>
                {props.item.text}
            </span>);
    }

    /** @private */
    _handleSearch(item: { text: string, value: any, checked: boolean }, search: string): boolean {
        return item.text.contains(search);
    }

    _handleClick(e: Event) {
        if (!this._selected)
            this.setState({open: !this.state.open});
        else
            this._selected = false;
    }

    render() {
        return (
            <span style={{...this.props.style}}>
                {this._fieldCtrlInfo}
                <DropdownList
                    {...this._multiselectProps}
                    open={this.state.open}
                    filter={(this._enumerate.length < 10 || this.field._multiple || this.props.units) ? null : (item, search) => this._handleSearch(item, search)}
                    data={this._enumerate}
                    readOnly={this.field._readOnly}
                    placeholder={this.field._title}
                    onSelect={(value) => this._handleSelect(value)}
                    textField='text'
                    valueField='value'
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