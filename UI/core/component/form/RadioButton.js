// @flow
'use strict';
import {React, PropTypes, Utils} from '../../core';
import {FormComponent, Icon} from '../../components';

export default class RadioButton extends FormComponent {

    static propTypes = {
        /** lista opcji RadioButtonOption */
        options: PropTypes.array,
        /** czy rysowane w jednej linii */
        inline: PropTypes.bool,
        /** czy tylko do odczytu */
        readOnly: PropTypes.bool
    };

    static defaultProps = {
        inline: false,
        options: null,
        readOnly: false
    };

    /** tworzy obiekt RadioButtonOption
     * @param key unikalny klucz pozycji
     * @param name nazwa wyświetlana
     * @param value wartość
     * @param description opis (title)
     * @returns {RadioButtonOption}
     */
    static createOption(key: string, name: string, value: ?any, description: ?string): RadioButtonOption {
        const option = new RadioButtonOption();
        option.key = key;
        option.name = name;
        option.value = value;
        option.description = description;
        return option;
    }

    /** aktualnie zaznaczona pozycja */
    _selected: ?RadioButtonOption = null;
    /** lista pozycji */
    _options: [] = [];


    constructor() {
        super(...arguments);
        this.field = this.props.field;
        if (this.props.options)
            this._options = this.props.options;
        else if (this.props.field) {
            this._options = Utils.forEach(this.props.field.enumerate, (pos, idx) => {
                return {
                    key: idx,
                    name: pos,
                    description: pos,
                    value: idx
                }
            })
        }
        if (this.field)
            this._selected = this._options.find((option) => option.value === this.field.value);
    }

    /** zaznacza podany obiekt i zmienia wartość fielda
     * @param option obiekt do zaznczenia
     * @param e
     */
    select(option: ?RadioButtonOption, e: ?Event = null) {
        if (this.props.readOnly) return;
        if (this._selected && this._selected.key === option.key) return;
        this._selected = option;
        this._handleChange(true, e, option.value);
        this.forceUpdate(true);
    }

    /** sprawdza czy dany obiekt jest zaznaczony
     * @param option
     * @returns {boolean}
     * @private
     */
    _isSelected(option: ?RadioButtonOption): boolean {
        if (!this._selected) return false;
        return this._selected.key === option.key;
    }

    /** zwraca radio buttona dla podanego obiektu
     * @param option
     * @returns {[XML,XML]}
     */
    renderRadioButton(option: RadioButtonOption) {
        const options = [<span key={option.key}
                               className={"c-radio-button-icon " + (this._isSelected(option) ? Icon.DOT_CIRCLE_O : Icon.CIRCLE_O)}
                               title={option.description}
                               onClick={this.props.readOnly ? null : (e) => {
                                   e.stopPropagation();
                                   this.select(option, e);
                               }}/>,
            <span key={option.key + '_label'}
                  className="c-radio-button-label"
                  title={option.description}
                  onClick={this.props.readOnly ? null : (e) => {
                      e.stopPropagation();
                      this.select(option, e);
                  }}>{option.name}</span>];
        if (!this.props.inline)
            options.push(<br/>);
        return options;
    }

    render() {
        return <div className="c-radio-button">
            {Utils.forEach(this._options, (option) => this.renderRadioButton(option))}
        </div>;
    }
}

/** reprezentacja pozycji na liście opcji */
class RadioButtonOption {
    key: ?string = null;
    name: ?string = null;
    description: ?string = null;
    value: ?any = null;
}