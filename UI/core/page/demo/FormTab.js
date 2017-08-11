//@Flow
'use strict';
import {React, Field, Type, Column, Utils} from '../../core';
import {Component, Page, Icon, FCtrl} from '../../components';
import JsonViewer from "../../component/JsonViewer";
import {PopupMenu, MenuItem, MenuItemSeparator} from "../../component/PopupMenu";
import {ModalWindow, MW_BUTTONS} from "../../component/ModalWindow";
import {Scrollbar} from "../../component/Scrollbar";

export default class FormTab extends Component {

    constructor() {
        super(...arguments);
        Utils.forEach(DATA, (field: Field) =>
            field.onChange.listen(this, e => (this.viewer && this.viewer.update(getDTO()))));
        this.state = {contextMenu: {opened: false, x: 0, y: 0}};
    };

    render() {
        return <form onSubmit={(e) => this._handleSubmit(e)}>
            <Scrollbar/>
            <Scrollbar horizontal/>
            <div style={{display: "flex"}}>
                <table className="tbl">
                    <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Wartość</th>
                        <th>Podgląd</th>
                        <th>Tekst</th>
                    </tr>

                    </thead>
                    <tbody>

                    {Object.keys(DATA).map((prop, index) => {
                        let field = DATA[prop];
                        return <tr key={index}>
                            <td style={{width: '20px'}}>
                                <FCtrl field={field} name required description constWidth/>
                            </td>

                            <td style={{paddingLeft: "20px"}}>
                                <FCtrl field={field} mode="block" fit value error boolMode="radio" selectMode="radio"/>
                            </td>

                            <td style={{padding: "4px"}}><FCtrl field={field} boolMode="radio" preview value/></td>

                            <td style={{
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                                <FCtrl field={field} preview inline value/>
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

        let mwin = ModalWindow.create((mw: ModalWindow) => {
            mw.title.set(error ? "Bład" : "Informacja");
            mw.icon.set(error ? Icon.EXCLAMATION_CIRCLE : Icon.INFO);
            mw.onConfirm = () => {
                console.log("OK");
                return true
            };
            mw.onCancel = () => {
                console.log("CANCEL");
                return true
            };
            mw.onClose = (e, res) => console.log(res);
            mw.buttons = MW_BUTTONS.OK_CANCEL;
            mw.content = error ? "Formualrz zawiera błędy." : "Poprawnie wprowadzone dane.";
        });
        mwin.open();
    };

}

const DATA = {

    login: new Field((c: Column) => {
        c.type = Type.STRING;
        c.key = "login";
        c.name = "Login";
        c.required = true;
        c.regex = /^(\w+)$/;
        c.description = 'Może się składać jedynie z liter, cyfr i "_"\nadmin jest zajęty';
    }),

    password: new Field((c: Column) => {
        c.type = Type.PASSWORD;
        c.key = "password";
        c.name = 'Hasło';
        c.required = true;
        c.min = 6;
        c.description = 'Minimum 6 znaków';
    }),

    forename: new Field((c: Column) => {
        c.type = Type.STRING;
        c.key = "forename";
        c.name = 'Imię';
        c.defaultValue = "Jan";
        c.required = true;
        c.textCasing = "capitalize";
    }),

    middleName: new Field((c: Column) => {
        c.type = Type.STRING;
        c.key = "middlename";
        c.name = "Drugie imię";
        c.textCasing = "capitalize";
    }),

    surname: new Field((c: Column) => {
        c.type = Type.STRING;
        c.key = "surname";
        c.name = ('Nazwisko');
        c.required = true;
        c.textCasing = "capitalize";
    }),

    pesel: new Field((c: Column) => {
        c.type = Type.STRING;
        c.key = "pesel";
        c.name = 'PESEL';
        c.required = true;
        c.max = 11;
        c.min = 11;
        c.regex = /^\d{11}$/;
    }),

    phone: new Field((c: Column) => {
        c.type = Type.STRING;
        c.key = "phone";
        c.name = 'Numer telefonu';
        c.description = 'Telefon kontaktowy';
    }),

    number: new Field((c: Column) => {
        c.type = Type.INT;
        c.key = "number";
        c.name = 'Liczba całkowita';
        c.min = 0;
        c.max = 100;
    }),

    double: new Field((c: Column) => {
        c.type = Type.DOUBLE;
        c.key = "double";
        c.name = 'Liczba zmiennoprzecinkowa';
    }),

    checkbox: new Field((c: Column) => {
        c.type = Type.BOOLEAN;
        c.key = "checkbox";
        c.name = 'Zgoda na sprzedaż danych';
        c.required = true;
    }),

    dropdown: new Field((c: Column) => {
        c.type = Type.STRING;
        c.key = "dropdown";
        c.enumerate = () => {
            return {
                '0': 'wartość 0',
                '1': 'wartość 1',
                '2': 'wartość 2',
                '3': 'wartość 3',
            }
        };
        c.name = 'Lista wyboru';
        c.required = true;
        c.defaultValue = "2";
    }),


    multdropdown: new Field((c: Column) => {
        c.type = Type.ENUMS;
        c.key = "multipleDropdown";
        c.enumerate = () => {
            return {
                '0': 'wartość 0',
                '1': 'wartość 1',
                '2': 'wartość 2',
                '3': 'wartość 3',
                '4': 'wartość 4',
                '5': 'wartość 5'
            }
        };
        c.name = 'Lista multi wyboru';
        c.required = true;
        c.defaultValue = ["2", "0"];
    }),

    size: new Field((c: Column) => {
        c.type = Type.SIZE;
        c.key = "size";
        c.name = 'Rozmiar';
    }),


    date: new Field((c: Column) => {
        c.type = Type.DATE;
        c.key = "date";
        c.name = 'Data';
        c.required = true;
        c.defaultValue = new Date();
    }),


    time: new Field((c: Column) => {
        c.type = Type.TIME;
        c.key = "time";
        c.name = 'Czas';
        c.defaultValue = new Date();
    }),

    timstamp: new Field((c: Column) => {
        c.type = Type.TIMESTAMP;
        c.key = "timestamp";
        c.name = 'Data i czas';
        c.defaultValue = new Date();
    }),

    description: new Field((c: Column) => {
        c.type = Type.MEMO;
        c.key = "desc";
        c.name = 'Opis';
        c.required = true;
        c.max = 250;
        c.defaultValue = "Rum, beer, quest and mead\nThese are the thinks that a pirate needs\nRise the flag and let's set sail\nUnder the sign of storm of ale";
    }),


    WEIGHT: new Field((c: Column) => {
        c.type = Type.INT;
        c.key = "weight";
        c.name = 'Waga';
        c.max = 250000;
        c.units = () => [
            ["g", "gram", 1],
            ["ct", "karat", 0.2],
            ["dag", "dekagram", 10],
            ["lb", "funt", 453.59],
            ["kg", "kilogram", 1000],
            ["oz", "uncja", 28.35],
        ];
    }),

    HRIGHT: new Field((c: Column) => {
        c.type = Type.INT;
        c.key = "height";
        c.name = 'Wzrost';
        c.max = 3000;
        c.units = () => [
            ["mm", "milimetr", 1],
            ["cm", "centymetr", 10],
            ["cal", "cal", 25.4],
            ["dm", "decymetr", 100],
            ["ft", "stopa", 304.8],
            ["yd", "jard", 914.4],
            ["m", "metr", 1000],
        ];
        c.defaultValue = 1700;
        c.defaultUnit = ["cm", "centymetr", 10];
    }),

    DELAY: new Field((c: Column) => {
        c.type = Type.DURATION;
        c.key = "delay";
        c.name = 'Opóźnienie';
        c.defaultValue = 10000;
        c.defaultUnit = ['s', 's', 1000];
    })
};

function getDTO(): any {
    const dto = {};
    Utils.forEach(DATA, (field: Field) => dto[field.key] = field.value);
    return dto;
}


