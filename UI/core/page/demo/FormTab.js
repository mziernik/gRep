//@Flow
'use strict';
import {React, Field, Type, FieldConfig, Utils} from '../../core';
import {Component, Page, FontAwesome, FieldComponent, FieldController}    from        '../../components';
import JsonViewer from "../../component/JsonViewer";
import {PopupMenu, MenuItem, MenuItemSeparator} from "../../component/PopupMenu";

export default class FormTab extends Component {

    constructor() {
        super(...arguments);
        Utils.forEach(DATA, (field: Field) =>
            field.onChange.listen(this, e => (this.viewer && this.viewer.update(getDTO()))));
        this.state = {contextMenu: {opened: false, x: 0, y: 0}};
    };

    _handleMenu(e, props) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({contextMenu: {opened: true, x: e.pageX, y: e.pageY, onClickProps: props}});
    }

    render() {
        return <form onSubmit={(e) => this._handleSubmit(e)} style={{overflow: "auto"}}>
            <PopupMenu
                {...this.state.contextMenu}
                items={this.MENU_ITEMS}
            />

            <div style={{display: "flex"}} onContextMenu={(e) => this._handleMenu(e, {source: 'div', value: 'click'})}>
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

                            <td style={{paddingLeft: "20px"}}
                                onContextMenu={(e) => this._handleMenu(e, {value: field.value, source: field.name})}>
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
    };

    MENU_ITEMS = [
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Zaloguj wartość";
            item.hint = "Wpisuje do konsoli nazwę pola i jego wartość";
            item.onClick = (e, props) => console.log(props.source, ':', props.value);
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Alert!";
            item.hint = "Wyświetla domyślny alert";
            item.onClick = (e, props) => alert(JSON.stringify(props));
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Bez zamykania";
            item.hint = "Pozycja nie zamyka menu po kliknięciu";
            item.closeOnClick = false;
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Nieaktywne";
            item.hint = "Nieaktywna pozycja. Kliknięcie nie powinno działać";
            item.disabled = true;
            item.onClick = () => console.log("To nie powinno tu być :/");
        }),
        MenuItem.createSeparator(),
        MenuItem.createItem((item: MenuItem) => {
            item.icon = <span className={FontAwesome.BUG}/>;
            item.name = "Pozycja z ikoną FA";
            item.hint = "Pozycja z ikoną FontAwesome";
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.name = <div><span style={{color: 'red'}}>Pozycja z SPAN </span><span>Drugi SPAN</span></div>;
            item.hint = "Nazwa pozycji zawiera tagi HTML";
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.icon =
                <span><span className={FontAwesome.CHEVRON_LEFT}/><span className={FontAwesome.CHEVRON_RIGHT}/></span>;
            item.hint = "Pozycja bez nazwy ale z dwiema ikonami";
        }),
        MenuItem.createSeparator("Zagnieżdżenia"),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Jeden poziom";
            item.hint = "Pozycja zawierająca jeden poziom zagnieżdżenia";
            item.subMenu = [
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={FontAwesome.ARROW_LEFT}/>;
                    item.name = "Lewo";
                    item.hint = "Strzałka w lewo";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={FontAwesome.ARROW_RIGHT}/>;
                    item.name = "Prawo";
                    item.hint = "Strzałka w prawo";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={FontAwesome.ARROW_UP}/>;
                    item.name = "Góra";
                    item.hint = "Strzałka w górę";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={FontAwesome.ARROW_DOWN}/>;
                    item.name = "Dół";
                    item.hint = "Strzałka w dół";
                }),
            ]
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.icon = <span className={FontAwesome.LIST}/>;
            item.name = "Nieaktywne z jednym poziomem";
            item.hint = "Nieaktywna pozycja z zagnieżdżeniem";
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.icon = <span className={FontAwesome.LIST_ALT}/>;
            item.name = "Wiele poziomów zagnieżdżenia";
            item.hint = "Pozycja zawierająca wiele zagnieżdżeń";
            item.subMenu = [
                MenuItem.createItem((item: MenuItem) => {
                    const style = {style: {color: 'red'}};
                    item.icon = <span className={FontAwesome.SQUARE} {...style}/>;
                    item.name = "Czerowny";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_LEFT} {...style}/>;
                            item.name = "Lewo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_LEFT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_RIGHT} {...style}/>;
                            item.name = "Prawo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_RIGHT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_UP} {...style}/>;
                            item.name = "Góra";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_UP} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_DOWN} {...style}/>;
                            item.name = "Dół";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_DOWN} {...style}/>;
                                }),
                            ]
                        }),
                    ]
                }),
                MenuItem.createItem((item: MenuItem) => {
                    const style = {style: {color: 'green'}};
                    item.icon = <span className={FontAwesome.SQUARE} {...style}/>;
                    item.name = "Zielony";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_LEFT} {...style}/>;
                            item.name = "Lewo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_LEFT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_RIGHT} {...style}/>;
                            item.name = "Prawo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_RIGHT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_UP} {...style}/>;
                            item.name = "Góra";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_UP} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_DOWN} {...style}/>;
                            item.name = "Dół";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_DOWN} {...style}/>;
                                }),
                            ]
                        }),
                    ]
                }),
                MenuItem.createItem((item: MenuItem) => {
                    const style = {style: {color: 'blue'}};
                    item.icon = <span className={FontAwesome.SQUARE} {...style}/>;
                    item.name = "Niebieski";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_LEFT} {...style}/>;
                            item.name = "Lewo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_LEFT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_RIGHT} {...style}/>;
                            item.name = "Prawo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_RIGHT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_UP} {...style}/>;
                            item.name = "Góra";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_UP} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={FontAwesome.ARROW_DOWN} {...style}/>;
                            item.name = "Dół";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={FontAwesome.ARROW_CIRCLE_O_DOWN} {...style}/>;
                                }),
                            ]
                        }),
                    ]
                }),
            ]
        }),
    ];
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


