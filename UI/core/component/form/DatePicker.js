// @flow
'use strict';
import {React, ReactDOM, PropTypes} from '../../core';
import {FormComponent} from '../../components'
import {DateTimePicker} from "react-widgets";
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Moment from "moment";
import "react-widgets/dist/css/react-widgets.css";

//FixMe: Wojtek: Pierwsze rozwinięcie listy godzin i kliknięcie na pozycję powoduje wybranie wartości 00:00
//FixMe: Wojtek: Nie da się wpisać czasu !!!
//ToDo: Wojtek: DatePicker powinien obsługiwać klawisze góra/dół

export default class DatePicker extends FormComponent {

    static propTypes = {
        dtpProps: PropTypes.object,
        preview: PropTypes.bool
    };

    constructor() {
        super(...arguments);
        Moment.locale('pl');
        momentLocalizer(Moment);
        this._wheelListener = () => this._setDropdown(null, true);
        window.addEventListener('wheel', this._wheelListener, {passive: true});
        this._currentDate = this.field.value || new Date();
        this._dropUp = false;
    }

    componentWillUnmount() {
        super.componentWillUnmount(...arguments);
        window.removeEventListener('wheel', this._wheelListener, {passive: true});
    }

    /** Funkcja rysująca dni
     * @param props - aktualnie rysowany dzień
     * @returns {XML}
     * @private
     */
    _dayRendererFunc(props: { date: Date, label: string }) {
        const setColors = () => {
            if (props.date.getMonth() !== this._currentDate.getMonth()) return null;
            switch (props.date.getDay()) {
                case 0:
                    return '#f00000';
                case 6:
                    return '#ff9000';
                default:
                    return null;
            }
        };

        return (
            <div style={{color: setColors()}}>
                {props.label}
            </div>);
    }

    _setDropdown(dtp, open) {
        if (!this._tag) {
            if (!dtp) return;
            this._dtp = dtp;
            this._tag = ReactDOM.findDOMNode(dtp);
        }
        if (!open) return;
        const poff = this._tag.getBoundingClientRect();
        if (this._dtp) {
            this._dropUp = (poff.top > (window.innerHeight / 2));
            if (this._dtp.props.dropUp !== this._dropUp)
                this.forceUpdate(true);
        }
        const child = this._tag.children[2];
        const child2 = this._tag.children[3];
        if (!child && !child2) return;
        if (this._dropUp) {
            child2.style.bottom = child.style.bottom = (window.innerHeight - poff.top) + 'px';
            child2.style.top = child.style.top = '';
        } else {
            child2.style.top = child.style.top = (poff.top + poff.height) + 'px';
            child2.style.bottom = child.style.bottom = '';
        }

        child2.style.left = child.style.left = (poff.left) + 'px';
        child2.style.width = child.style.width = (poff.width) + 'px';
    }

    render() {
        if (!this.field) return null;

        if (this.props.preview) {
            if (this.field.isEmpty)
                return null;

            return <span title={this.field.name}>{this.field.displayValue}</span>;
        }

        return (
            <DateTimePicker
                ref={elem => this._setDropdown(elem)}
                {...this.props.dtpProps}
                title={this.field.hint}
                dayComponent={(props) => this._dayRendererFunc(props)}
                placeholder={this.field.name}
                disabled={this.field.readOnly}
                dropUp={this._dropUp}
                messages={{
                    calendarButton: 'Wybierz datę',
                    timeButton: 'Wybierz godzinę',
                    moveBack: 'Poprzedni miesiąc',
                    moveForward: 'Następny miesiąc'
                }}
                defaultValue={this.field.value}
                duration={100}
                onChange={(d, s) => this._handleChange(false, null, d)}
                onCurrentDateChange={d => this._currentDate = d}
                onToggle={(open) => this._setDropdown(null, open)}/>
        );
    }
}