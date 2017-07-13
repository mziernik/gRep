//@Flow
'use strict';
import {React, Field, Type, Column, Utils} from '../../core';
import {Component, Page, Icon, FCtrl}    from        '../../components';
import JsonViewer from "../../component/JsonViewer";
import {PopupMenu, MenuItem, MenuItemSeparator} from "../../component/PopupMenu";
import {ModalWindow, MW_BUTTONS} from "../../component/ModalWindow";

export default class FormTab extends Component {

    constructor() {
        super(...arguments);
        Utils.forEach(DATA, (field: Field) =>
            field.onChange.listen(this, e => (this.viewer && this.viewer.update(getDTO()))));
        this.state = {contextMenu: {opened: false, x: 0, y: 0}};
    };

    render() {
        return <form onSubmit={(e) => this._handleSubmit(e)} style={{overflow: "auto"}}>
            <div style={{display: "flex"}} /*onContextMenu={(e) => PopupMenu.openMenu(e, this.MENU_ITEMS) }*/>
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
                                <FCtrl field={field} name required description/>
                            </td>

                            <td style={{paddingLeft: "20px"}}
                                /*onContextMenu={(e) => PopupMenu.openMenu(e, this.MENU_ITEMS, {
                                 checked: field.value ? true : false,
                                 source: field.name,
                                 value: field.value
                                 }) }*/>
                                <FCtrl field={field} mode="block" value error/>
                            </td>

                            <td style={{padding: "4px"} }><FCtrl field={field} preview value/></td>

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
            mw.title = error ? "Bład" : "Informacja";
            mw.icon = error ? Icon.EXCLAMATION_CIRCLE : Icon.INFO;
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

    MENU_ITEMS = [
        MenuItem.createItem((item: MenuItem) => {
            item.checkbox = true;
            item.name = "Zaloguj wartość";
            item.hint = "Wpisuje do konsoli nazwę pola i jego wartość";
            item.onBeforeOpen = (item, props) => {
                item.onClick = !props.source ? () => alert("Brak wartości")
                    : (e, props) => console.log(props.source, ':', props.value);
                item.checked = props.source ? true : false;
            };
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.checkbox = true;
            item.checked = true;
            item.name = "Alert!";
            item.hint = "Wyświetla domyślny alert";
            item.onClick = (e, props) => alert(Utils.escape(props));
            item.onBeforeOpen = (item, props) => item.checked = props.checked;
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
            item.icon = Icon.BUG;
            item.name = "Pozycja z ikoną FA";
            item.hint = "Pozycja z ikoną FontAwesome";
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.name = <div><span style={{color: 'red'}}>Pozycja z SPAN </span><span>Drugi SPAN</span></div>;
            item.hint = "Nazwa pozycji zawiera tagi HTML";
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.icon = Icon.FLAG;
            item.hint = "Pozycja z ikoną i bez nazwy";
        }),
        MenuItem.createSeparator("Zagnieżdżenia"),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Jeden poziom";
            item.hint = "Pozycja zawierająca jeden poziom zagnieżdżenia";
            item.subMenu = [
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.ARROW_LEFT}/>;
                    item.name = "Lewo";
                    item.hint = "Strzałka w lewo";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.ARROW_RIGHT}/>;
                    item.name = "Prawo";
                    item.hint = "Strzałka w prawo";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.ARROW_UP}/>;
                    item.name = "Góra";
                    item.hint = "Strzałka w górę";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.ARROW_DOWN}/>;
                    item.name = "Dół";
                    item.hint = "Strzałka w dół";
                }),
            ]
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.icon = <span className={Icon.LIST}/>;
            item.name = "Nieaktywna z poziomem";
            item.hint = "Nieaktywna pozycja z zagnieżdżeniem";
            item.disabled = true;
            item.subMenu = [
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.ARROW_LEFT}/>;
                    item.name = "Lewo";
                    item.hint = "Strzałka w lewo";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.ARROW_RIGHT}/>;
                    item.name = "Prawo";
                    item.hint = "Strzałka w prawo";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.ARROW_UP}/>;
                    item.name = "Góra";
                    item.hint = "Strzałka w górę";
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.ARROW_DOWN}/>;
                    item.name = "Dół";
                    item.hint = "Strzałka w dół";
                }),
            ];
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.icon = <span className={Icon.LIST_ALT}/>;
            item.name = "Wiele poziomów zagnieżdżenia";
            item.hint = "Pozycja zawierająca wiele zagnieżdżeń";
            item.subMenu = [
                MenuItem.createItem((item: MenuItem) => {
                    const style = {style: {color: 'red'}};
                    item.icon = <span className={Icon.SQUARE} {...style}/>;
                    item.name = "Czerowny";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_LEFT} {...style}/>;
                            item.name = "Lewo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_LEFT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_RIGHT} {...style}/>;
                            item.name = "Prawo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_RIGHT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_UP} {...style}/>;
                            item.name = "Góra";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_UP} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_DOWN} {...style}/>;
                            item.name = "Dół";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_DOWN} {...style}/>;
                                }),
                            ]
                        }),
                    ]
                }),
                MenuItem.createItem((item: MenuItem) => {
                    const style = {style: {color: 'green'}};
                    item.icon = <span className={Icon.SQUARE} {...style}/>;
                    item.name = "Zielony";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_LEFT} {...style}/>;
                            item.name = "Lewo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_LEFT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_RIGHT} {...style}/>;
                            item.name = "Prawo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_RIGHT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_UP} {...style}/>;
                            item.name = "Góra";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_UP} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_DOWN} {...style}/>;
                            item.name = "Dół";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_DOWN} {...style}/>;
                                }),
                            ]
                        }),
                    ]
                }),
                MenuItem.createItem((item: MenuItem) => {
                    const style = {style: {color: 'blue'}};
                    item.icon = <span className={Icon.SQUARE} {...style}/>;
                    item.name = "Niebieski";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_LEFT} {...style}/>;
                            item.name = "Lewo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_LEFT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_LEFT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_RIGHT} {...style}/>;
                            item.name = "Prawo";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_RIGHT} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_RIGHT} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_UP} {...style}/>;
                            item.name = "Góra";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_UP} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_UP} {...style}/>;
                                }),
                            ]
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.icon = <span className={Icon.ARROW_DOWN} {...style}/>;
                            item.name = "Dół";
                            item.subMenu = [
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_DOWN} {...style}/>;
                                }),
                                MenuItem.createItem((item: MenuItem) => {
                                    item.name = <span className={Icon.ARROW_CIRCLE_O_DOWN} {...style}/>;
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
                '4': 'wartość 4',
                '5': 'wartość 5',
                '6': 'wartość 6',
                '7': 'wartość 7',
                '8': 'wartość 8',
                '9': 'wartość 9'
            }
        };
        c.name = 'Lista wyboru';
        c.required = true;
        c.defaultValue = "5";
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


