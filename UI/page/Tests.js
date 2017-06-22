//@Flow
'use strict';
import {React, Field, Type} from '../core/core';
import {Page, FontAwesome, FieldComponent, Alert, FieldController} from '../core/components';
import "react-widgets/dist/css/react-widgets.css";


class Tests extends Page {

    constructor() {
        super(...arguments);
        this._user = {
            login: new Field(Type.STRING).title('Login').required().regex(/^(\w+)$/).information('Może się składać jedynie z liter, cyfr i "_"\nadmin jest zajęty'),
            password: new Field(Type.PASSWORD).title('Hasło').required().minLength(6).information('Minimum 6 znaków'),
            forename: new Field(Type.STRING).title('Imię').required().capitalize(),
            middleName: new Field(Type.STRING).title('Drugie imię').capitalize(),
            surname: new Field(Type.STRING).title('Nazwisko').required().capitalize(),
            pesel: new Field(Type.STRING).title('PESEL').required().maxLength(11).minLength(11).regex(/^\d{11}$/),
            phone: new Field(Type.STRING).title('Numer telefonu').information('Telefon kontaktowy'),
            number: new Field(Type.INT).title('Liczba całkowita').minLength(0).maxLength(100),
            double: new Field(Type.DOUBLE).title('Liczba zmiennoprzecinkowa'),
            checkbox: new Field(Type.BOOLEAN).title('Zgoda na sprzedaż danych').required(),
            dropdown: new Field(Type.STRING).setEnumerate([
                ['Wartość 1', 1],
                ['Wartość 2', 2],
                ['Wartość 3', 3],
                ['Wartość 4', 4],
                ['Wartość 5', 5],
                ['Wartość 6', 6],
                ['Wartość 7', 7],
                ['Wartość 8', 8],
                ['Wartość 9', 9],
                ['Wartość 10', 10],
            ], false).title('Lista wyboru').required(),
            multdropdown: new Field(Type.STRING).setEnumerate([
                ['Wartość 1', 1],
                ['Wartość 2', 2],
                ['Wartość 3', 3],
                ['Wartość 4', 4],
                ['Wartość 5', 5],
            ], true).title('Lista multi wyboru').required(),
            size: new Field(Type.LENGTH).title('Rozmiar').setUnits(new Map().set('B', 'bajty').set('KB', 'kilobajty').set('MB', 'megabajty').set('GB', 'gigabajty')),
            data: new Field(Type.DATE).title('Data').required().set(new Date()),
            time: new Field(Type.TIME).title('Czas').set(new Date()),
            timstamp: new Field(Type.TIMESTAMP).title('Data i czas').set(new Date()),
            description:new Field(Type.MEMO).title('Opis').required().maxLength(250).set("Rum, beer, quest and mead\nThese are the thinks that a pirate needs\nRise the flag and let's set sail\nUnder the sign of storm of ale")
        };
    }

    _handleSubmit(e: Event) {
        e.preventDefault();
        let error = false;
        Object.keys(this._user).map((prop) => {
            if (!this._user[prop].validate(true))
                error = true;
        });

        if (!error)
            if (this._user.login.get().toLowerCase() === 'admin') {
                this._user.login.error = 'Nazwa już zajęta.';
                error = true;
            }

        if (error)
            alert("Formularz zawiera błędy.");
        else
            alert('OK');
    }

    render() {
        return (
            <div>
                <h1>Testy</h1>
                <form onSubmit={(e) => this._handleSubmit(e)}>

                    <table>
                        <tbody>

                        {Object.keys(this._user).map((prop, index) => {
                            let field = this._user[prop];
                            return <tr key={index}>


                                <td style={{width: '20px'}}>
                                    <FieldController field={field}
                                                     handleRequired={true}
                                                     handleInformation={true}
                                                     defReq={<span className={FontAwesome.ASTERISK}
                                                                   style={{color: '#ff6e00'}}/>}
                                                     defInfo={<span className={FontAwesome.QUESTION_CIRCLE}
                                                                    style={{color: '#0071ff'}}/>}
                                    />
                                </td>

                                <td style={{padding: "4px"} }>{field._title}</td>

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
                    <input type="submit"/>
                </form>
            </div>);
    }

}

export default Tests;