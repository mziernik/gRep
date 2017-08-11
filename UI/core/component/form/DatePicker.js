// @flow
'use strict';
import {React, ReactDOM, PropTypes} from '../../core';
import {FormComponent} from '../../components'
import {DateTimePicker} from "react-widgets";
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Moment from "moment";
import "react-widgets/dist/css/react-widgets.css";

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
            this._tag = ReactDOM.findDOMNode(dtp);
        }
        if (!open) return;
        const poff = this._tag.getBoundingClientRect();
        const child = this._tag.children[2];
        const child2 = this._tag.children[3];
        if (!child && !child2) return;
        child2.style.top = child.style.top = (poff.top + poff.height) + 'px';
        child2.style.left = child.style.left = (poff.left) + 'px';
        child2.style.width = child.style.width = (poff.width) + 'px';
    }

    render() {
        if (!this.field) return null;

        if (this.props.preview) {
            if (this.field.isEmpty)
                return null;

            switch (this.field.type.name) {
                case "date":
                    return <span title={this.field.name}>{(this.field.value: Date).toLocaleDateString()}</span>;
                case "time":
                    return <span title={this.field.name}>{(this.field.value: Date).toLocaleTimeString()}</span>;
                case "timestamp":
                    return <span title={this.field.name}>{(this.field.value: Date).toLocaleString()}</span>;
            }
        }

        return (
            <DateTimePicker
                ref={elem => this._setDropdown(elem)}
                {...this.props.dtpProps}
                title={this.field.hint}
                dayComponent={(props) => this._dayRendererFunc(props)}
                placeholder={this.field.name}
                disabled={this.field.readOnly}
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