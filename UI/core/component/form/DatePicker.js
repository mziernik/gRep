// @flow
'use strict';
import {React, PropTypes} from '../../core';
import {FormComponent} from '../../components'
import {DateTimePicker} from "react-widgets";
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Moment from "moment";
import "react-widgets/dist/css/react-widgets.css";

export default class DatePicker extends FormComponent {

    static propTypes = {
        dtpProps: PropTypes.object,
        preview:PropTypes.bool
    };

    constructor() {
        super(...arguments);
        Moment.locale('pl');
        momentLocalizer(Moment);
    }

    /** Funkcja rysująca dni
     * @param props - aktualnie rysowany dzień
     * @returns {XML}
     * @private
     */
    _dayRendererFunc(props: { date: Date, label: string }) {
        const setColors = () => {
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

    render() {
        if (!this.field)return null;

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
                    onChange={(d, s) => this._handleChange(false, null, d)}/>
        );
    }
}