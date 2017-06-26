//@Flow
'use strict';
import {React, Field, Type, FieldConfig, Utils} from '../../core';
import {Component, Page, FontAwesome, FieldComponent, FieldController}    from        '../../components';
import JsonViewer from "../../component/JsonViewer";

export default class FormTab extends Component {

    constructor() {
        super(...arguments);
        Utils.forEach(DATA, (field: Field) =>
            field.onChange.listen(this, e => (this.viewer && this.viewer.update(getDTO()))));
    };

    render() {
        return <form onSubmit={(e) => this._handleSubmit(e)} style={{overflow: "auto"}} >
            <div style={{display: "flex"}}>
                <table>
                    <tbody>

                    {Object.keys(DATA).map((prop, index) => {
                        let field = DATA[prop];
                        return <tr key={index}>
                            <td style={{width: '20px'}}>
                                <FieldController field={field}
                                                 handleRequired={true}
                                                 handleDescription={true}
                                                 defReq={<span className={FontAwesome.ASTERISK}
                                                               style={{color: '#ff6e00'}}/>}
                                                 defDesc={<span className={FontAwesome.QUESTION_CIRCLE}
                                                                style={{color: '#0071ff'}}/>}
                                />
                            </td>

                            <td style={{padding: "4px"} }>{field.name}</td>

                            <td style={{paddingLeft: "20px"}}>
                                <FieldComponent field={field} fieldCtrl={false} checkBoxLabel={true}
                                                preview={false}/>
                            </td>
                            <td >
                                <FieldController field={field} handleFieldError={true}/>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>

                <div style={{display: "auto", padding: "8px"}}>
                    <div>DTO:</div>
                    <JsonViewer object={getDTO()} instance={e => this.viewer = e}/>
                </div>

            </div>
            <input type="submit"/>
        </form>
    }

    _handleSubmit(e: Event) {
        e.preventDefault();

        this.setState({selectedTab: 3});
        let error = false;
        Object.keys(DATA).map((prop) => {
            if (!DATA[prop].validate(true))
                error = true;
        });

        if (!error)
            if (DATA.login.value.toLowerCase() === 'admin') {
                DATA.login.error = 'Nazwa już zajęta.';
                error = true;
            }

        if (error)
            alert("Formularz zawiera błędy.");
        else
            alert('OK');
    }
}
const DATA = {

    login: new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "login";
        fc.name = "Login";
        fc.required = true;
        fc.regex = /^(\w+)$/;
        fc.description = 'Może się składać jedynie z liter, cyfr i "_"\nadmin jest zajęty';
    }),

    password: new Field((fc: FieldConfig) => {
        fc.type = Type.PASSWORD;
        fc.key = "password";
        fc.name = 'Hasło';
        fc.required = true;
        fc.min = 6;
        fc.description = 'Minimum 6 znaków';
    }),

    forename: new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "forename";
        fc.name = 'Imię';
        fc.defaultValue = "Jan";
        fc.required = true;
        fc.textCasing = "capitalize";
    }),

    middleName: new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "middlename";
        fc.name = "Drugie imię";
        fc.textCasing = "capitalize";
    }),

    surname: new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "surname";
        fc.name = ('Nazwisko');
        fc.required = true;
        fc.textCasing = "capitalize";
    }),

    pesel: new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "pesel";
        fc.name = 'PESEL';
        fc.required = true;
        fc.max = 11;
        fc.min = 11;
        fc.regex = /^\d{11}$/;
    }),

    phone: new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "phone";
        fc.name = 'Numer telefonu';
        fc.description = 'Telefon kontaktowy';
    }),

    number: new Field((fc: FieldConfig) => {
        fc.type = Type.INT;
        fc.key = "number";
        fc.name = 'Liczba całkowita';
        fc.min = 0;
        fc.max = 100;
    }),

    double: new Field((fc: FieldConfig) => {
        fc.type = Type.DOUBLE;
        fc.key = "double";
        fc.name = 'Liczba zmiennoprzecinkowa';
    }),

    checkbox: new Field((fc: FieldConfig) => {
        fc.type = Type.BOOLEAN;
        fc.key = "checkbox";
        fc.name = 'Zgoda na sprzedaż danych';
        fc.required = true;
    }),

    dropdown: new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "dropdown";
        fc.enumerate = () => {
            return {
                '0': 'wartość 0',
                '1': 'wartość 1',
                '2': 'wartość 2',
                '3': 'wartość 3',
                '4': 'wartość 4',
                '5': 'wartość 5',
                '6': 'wartość 6',
                '7': 'wartość 7',
                '8': 'wartość 8',
                '9': 'wartość 9'
            }
        };
        fc.name = 'Lista wyboru';
        fc.required = true;
        fc.defaultValue = "5";
    }),


    multdropdown: new Field((fc: FieldConfig) => {
        fc.type = new Type.SetDataType(Type.STRING);
        fc.key = "multipleDropdown";
        fc.enumerate = () => {
            return {
                '0': 'wartość 0',
                '1': 'wartość 1',
                '2': 'wartość 2'
            }
        };
        fc.name = 'Lista multi wyboru';
        fc.required = true;
        fc.defaultValue = ["2", "0"];
    }),

    size: new Field((fc: FieldConfig) => {
        fc.type = Type.SIZE;
        fc.key = "size";
        fc.name = 'Rozmiar';
    }),


    date: new Field((fc: FieldConfig) => {
        fc.type = Type.DATE;
        fc.key = "date";
        fc.name = 'Data';
        fc.required = true;
        fc.defaultValue = new Date();
    }),


    time: new Field((fc: FieldConfig) => {
        fc.type = Type.TIME;
        fc.key = "time";
        fc.name = 'Czas';
        fc.defaultValue = new Date();
    }),

    timstamp: new Field((fc: FieldConfig) => {
        fc.type = Type.TIMESTAMP;
        fc.key = "timestamp";
        fc.name = 'Data i czas';
        fc.defaultValue = new Date();
    }),

    description: new Field((fc: FieldConfig) => {
        fc.type = Type.MEMO;
        fc.key = "desc";
        fc.name = 'Opis';
        fc.required = true;
        fc.max = 250;
        fc.defaultValue = "Rum, beer, quest and mead\nThese are the thinks that a pirate needs\nRise the flag and let's set sail\nUnder the sign of storm of ale";
    }),


    WEIGHT: new Field((fc: FieldConfig) => {
        fc.type = Type.INT;
        fc.key = "weight";
        fc.name = 'Waga';
        fc.max = 250000;
        fc.units = () => [
            ["g", "gram", 1],
            ["ct", "karat", 0.2],
            ["dag", "dekagram", 10],
            ["lb", "funt", 453.59],
            ["kg", "kilogram", 1000],
            ["oz", "uncja", 28.35],
        ];
    }),

    HRIGHT: new Field((fc: FieldConfig) => {
        fc.type = Type.INT;
        fc.key = "height";
        fc.name = 'Wzrost';
        fc.max = 3000;
        fc.units = () => [
            ["mm", "milimetr", 1],
            ["cm", "centymetr", 10],
            ["cal", "cal", 25.4],
            ["dm", "decymetr", 100],
            ["ft", "stopa", 304.8],
            ["yd", "jard", 914.4],
            ["m", "metr", 1000],
        ];
        fc.defaultValue = 1700;
        fc.defaultUnit = ["cm", "centymetr", 10];
    }),

    DELAY: new Field((fc: FieldConfig) => {
        fc.type = Type.DURATION;
        fc.key = "delay";
        fc.name = 'Opóźnienie';
        fc.defaultValue = 10000;
        fc.defaultUnit = ['s', 's', 1000];
    })
};

function getDTO(): any {
    const dto = {};
    Utils.forEach(DATA, (field: Field) => dto[field.key] = field.value);
    return dto;
}


