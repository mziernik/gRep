//@Flow
'use strict';
import {React, PropTypes, Utils, Type} from '../core';
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
    _multiSelect: boolean = false;

    props: {
        /** czy jest to lista jednostek */
            units: ?boolean,
        readOnly: ?boolean
    };

    static propTypes = {
        /** czy jest to lista jednostek */
        units: PropTypes.array,
        readOnly: PropTypes.bool
    };


    constructor() {
        super(...arguments);
        this.state = {open: undefined};
        this._multiSelect = !this.field.type.single || this.field.type === Type.ENUMS;
        if (this.props.units) {
            this._enumerate = Utils.forEach(this.props.units, (item) => {
                return {text: item[1], value: item}
            });
        } else {

            Utils.forEach(this.field.enumerate, (value, key) => this._enumerate.push({
                    text: value,
                    value: key,
                    checked: false
                })
            );

            if (this._multiSelect)
                this._multiselectProps = {
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
            this.field.unit = item.value;
        } else {
            let tmp = item.value;
            if (this._multiSelect) {
                item.checked = !item.checked;
                tmp = [];
                Utils.forEach(this._enumerate, (item) => {
                    if (item.checked) tmp.push(item.value)
                });
                if (tmp.length === 0)
                    tmp = null;
            }
            if (tmp !== this.field.value)
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
        if (this.field.isEmpty) return null;
        const n = this.field.value.length;
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
        if (!this.field.isEmpty)
            props.item.checked = this.field.value.contains(props.item.value);
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
                    textField='text'
                    valueField='value'
                    data={this._enumerate}
                    defaultValue={this.props.units ? this.field.unit : this.field.value}
                    title={this.field.hint}
                    open={this.state.open}
                    filter={(this._enumerate.length < 10 || this._multiSelect || this.props.units) ? null : (item, search) => this._handleSearch(item, search)}
                    readOnly={this.props.readOnly || this.field.readOnly}
                    placeholder={this.field.name}
                    onSelect={(value) => this._handleSelect(value)}
                    duration={100}
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