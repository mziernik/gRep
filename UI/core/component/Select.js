//@Flow
'use strict';
import {React, PropTypes, Utils} from '../core';
import {FormComponent, FontAwesome} from '../components';
import {DropdownList} from 'react-widgets';

export default class Select extends FormComponent {

    /** lista pozycji do wyświetlenia
     * @type {Array}
     * @private
     */
    _enumerate: [] = [];
    /** Propsy dla multiselecta
     * @type {null}
     * @private
     */
    _multiselectProps: {} = null;
    /** Zapobiega zamknięciu się listy multiselecta gdy została wybrana pozycja
     * @type {boolean}
     * @private
     */
    _selected: boolean = false;

    props: {
        /** czy jest to lista jednostek */
            units: ?boolean,
        readOnly: ?boolean
    };

    static PropTypes = {
        /** czy jest to lista jednostek */
        units: PropTypes.bool
    };


    constructor() {
        super(...arguments);
        this.state = {open: undefined};
        if (this.props.units) {
            for (let [key, value] of this.field._units)
                this._enumerate.push({text: value, value: key});
        } else {
            Utils.forEach(this.field._enumerate, (item) => this._enumerate.push({
                text: item[0],
                value: item[1],
                checked: false
            }));

            if (this.field.type.multiple)
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

    /** Obsługa wybrania pozycji
     * @param item - wybrana pozycja
     * @private
     */
    _handleSelect(item: { text: string, value: any, checked: boolean }) {
        if (this.props.units) {
            this.field._unit = item.value;
        } else {
            let tmp = item.value;
            if (this.field.type.multiple) {
                item.checked = !item.checked;
                tmp = [];
                Utils.forEach(this._enumerate, (item) => {
                    if (item.checked) tmp.push(item.value)
                });
                if (tmp.length === 0)
                    tmp = null;
            }
            if (tmp !== this.field._value)
                this._handleChange(false, null, tmp);
            this._selected = true;
        }
    }

    /** metoda do rysowania wybranych pozycji
     * @param props - wybrana pozycja (niewykorzystywane)
     * @returns {*}
     * @private
     */
    _valueRenderer(props: { item: { text: string, value: any } }) {
        if (this.field.isEmpty()) return null;
        const n = this.field._value.length;
        if (n === 0) return null;
        let text = 'Wybranych pozycji: ' + n;
        return <span>{text}</span>;
    }

    /** metoda do rysowania pozycji na liście wyboru
     * @param props - pozycja do narysowania
     * @returns {XML}
     * @private
     */
    _itemRenderer(props: { item: { text: string, value: any, checked: boolean } }) {
        if (!this.field.isEmpty())
            props.item.checked = this.field._value.contains(props.item.value);
        return (
            <span>
                <span className={props.item.checked ? FontAwesome.CHECK_SQUARE_O : FontAwesome.SQUARE_O}
                      style={{width: '20px'}}/>
                {props.item.text}
            </span>);
    }

    /** obsługa wyszukiwania pozycji na liście
     * @param item - aktualnie sprawdzany element
     * @param search - wyszukiwana wartość
     * @returns {*} - wynik wyszukiwania
     * @private
     */
    _handleSearch(item: { text: string, value: any, checked: boolean }, search: string): boolean {
        return item.text.contains(search);
    }

    /** Obsługa zdarzenia kliknięcia
     * @param e - obiekt zdarzenia
     * @private
     */
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

                    defaultValue={this.field.get()}
                    title={this.field._title}
                    open={this.state.open}
                    filter={(this._enumerate.length < 10 || this.field.type.multiple || this.props.units) ? null : (item, search) => this._handleSearch(item, search)}
                    data={this._enumerate}
                    readOnly={this.props.readOnly || this.field._readOnly}
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