// @flow
'use strict';
import {React, PropTypes} from '../core';
import {FormComponent} from '../components'
import {DateTimePicker} from "react-widgets";
import moment from "react-widgets/lib/localizers/moment";
import Moment from "moment";

export default class DatePicker extends FormComponent {
    props: {
        dtpProps: ?Object
    };

    static PropTypes = {
        dtpProps: PropTypes.object
    };

    constructor() {
        super(...arguments);
        Moment.locale('pl');
        moment(Moment);
    }

    render() {
        return (
            <span>
                {this._fieldCtrlInfo}
                <DateTimePicker
                    {...this.props.dtpProps}
                    dayComponent={DayRenderer}
                    placeholder={this.field._title}
                    disabled={this.field._readOnly}
                    messages={{
                        calendarButton: 'Wybierz datę',
                        timeButton: 'Wybierz godzinę',
                        moveBack: 'Poprzedni miesiąc',
                        moveForward: 'Następny miesiąc'
                    }}
                    defaultValue={this.field.get()}
                    duration={100}
                    onChange={(d, s) => this._handleChange(false, null, d)}/>
                {this._fieldCtrlErr}
            </span>
        );
    }
}

/** Klasa do renderowania dni w kalendarzu */
class DayRenderer extends React.Component {
    props: {
        date: Date,
        label: string
    };

    static propTypes = {
        date: PropTypes.instanceOf(Date),
        label: PropTypes.string
    };

    _setColors(): ?string {
        switch (this.props.date.getDay()) {
            case 0:
                return '#f00000';
            case 6:
                return '#ff9000';
            default:
                return null;
        }
    }

    render() {
        return (
            <div style={{color: this._setColors()}}>
                {this.props.label}
            </div>);
    }
}