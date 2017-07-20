//@Flow
'use strict';
import {React, AppStatus} from '../../core';
import {Component, Spinner, PopupMenu, MenuItem, Icon} from '../../components';

export default class AlertsTab extends Component {

    constructor() {
        super(...arguments);
        this.state = {contextMenu: {opened: false, x: 0, y: 0}};
    };

    render() {
        return <div>
            <button onClick={() => AppStatus.debug(this, "Test:\nDebug", "Szczegóły\n\nLinia1\nLinia2")}>Debug
            </button>
            <button
                onClick={() => AppStatus.info(this, "Test: Info", "Szczegóły:\n\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"", 0)}>
                Info
            </button>
            <button onClick={() => AppStatus.success(this, "Test: Sukces", "Szczegóły")}>Sukces</button>
            <button onClick={() => AppStatus.warning(this, "Test: Ostrzeżenie", "Szczegóły")}>Ostrzeżenie
            </button>
            <button onClick={() => AppStatus.error(this, "Test: Błąd", 0)}>Błąd</button>

            <hr/>

            <button
                onClick={() => {
                    const spinner = new Spinner();
                    setTimeout(() => spinner.hide(), 3000);
                }
                }
            >Spinner 3s
            </button>

            <button
                onClick={() => {
                    const spinner = new Spinner();
                    //  setTimeout(() => spinner.hide(), 1);
                }
                }
            >Spinner 0
            </button>

            <hr/>
            <button
                onClick={e => PopupMenu.openMenu(e, MENU_ITEMS)}
                onContextMenu={e => PopupMenu.openMenu(e, MENU_ITEMS)}
            >
                menu
            </button>
        </div>
    }
}


const MENU_ITEMS = [
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