//@Flow
'use strict';
import {React, ReactDOM, PropTypes, Utils, Type, Is} from '../../core';
import {FormComponent, Icon} from '../../components';
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

    static propTypes = {
        /** ista jednostek */
        units: PropTypes.array,
        readOnly: PropTypes.bool
    };

    state: {
        open: ?boolean // czy rozwinięty
    };

    constructor() {
        super(...arguments);
        this.state = {open: undefined};
        this._multiSelect = !this.field.type.single || this.field.type === Type.ENUMS;
        if (!this.props.units && this._multiSelect)
            this._multiselectProps = {
                onBlur: () => this.setState({open: false}),
                onClick: (e) => this._handleClick(e),
                valueComponent: (props) => this._valueRenderer(props),
                itemComponent: (props) => this._itemRenderer(props),
                // onToggle: () => {
                // }
            };
        this._wheelListener = () => this._setDropdown(null, true);
        window.addEventListener('wheel', this._wheelListener, {passive: true});
    }

    componentWillUnmount() {
        super.componentWillUnmount(...arguments);
        window.removeEventListener('wheel', this._wheelListener, {passive: true});
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
            <div>
                <span className={props.item.checked ? Icon.CHECK_SQUARE_O : Icon.SQUARE_O}
                      style={{width: '20px'}}/>
                {props.item.text}
            </div>);
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

    _setDropdown(select, open) {
        if (!this._tag) {
            if (!select) return;
            this._tag = ReactDOM.findDOMNode(select);
        }
        if (!open) return;
        const poff = this._tag.getBoundingClientRect();
        const child = this._tag.children[2];
        if (!child) return;
        child.style.top = (poff.top + poff.height) + 'px';
        child.style.left = (poff.left) + 'px';
        child.style.width = (poff.width) + 'px';
    }


    render() {
        if (!this.field) return null;

        if (this.props.units) {
            this._enumerate = Utils.forEach(this.props.units, (item) => {
                return {text: item[1], value: item}
            });
        } else {
            this._enumerate = Utils.forEach(this.field.enumerate, (value, key) => {
                return {
                    text: Utils.toString(value),
                    value: Utils.toString(key),
                    checked: false
                }
            });
        }
        const value = this.props.units ? this.field.unit : Is.defined(this.field.value) ? Utils.toString(this.field.value) : this.field.value;
        return (
            <div className="c-select" style={{...this.props.style}}>
                <DropdownList
                    ref={elem => this._setDropdown(elem)}
                    {...this._multiselectProps}
                    textField='text'
                    valueField='value'
                    data={this._enumerate}
                    value={value}
                    onChange={() => this.forceUpdate(true)}
                    title={this.field.hint}
                    open={this.state.open}
                    filter={(this._enumerate.length < 10 || this._multiSelect || this.props.units) ? null : (item, search) => this._handleSearch(item, search)}
                    readOnly={this.props.readOnly || this.field.readOnly}
                    placeholder={this.field.name}
                    onSelect={(value) => this._handleSelect(value)}
                    duration={100}
                    onToggle={(open) => {
                        if (open) this._setDropdown(null, open)
                    }}
                    messages={{
                        open: 'Rozwiń',
                        filterPlaceholder: 'Wyszukaj...',
                        emptyList: 'Brak pozycji do wyświetlenia.',
                        emptyFilter: 'Brak wyników.'
                    }}
                />
            </div>
        )
    }
}