//@Flow
'use strict';
import {React, Field, Type, Column, Utils} from '../../core';
import {Component, Page, Icon, FCtrl}    from        '../../components';
import JsonViewer from "../../component/JsonViewer";
import {PopupMenu, MenuItem, MenuItemSeparator} from "../../component/PopupMenu";
import {ModalWindow, MW_BUTTONS} from "../../component/ModalWindow";
import {Scrollbar} from "../../component/Scrollbar";

export default class PopupMenuTab extends Component {
    static getRandomColor(): string {
        return 'rgb('
            + Math.floor(Math.random() * 256)
            + ',' + Math.floor(Math.random() * 256)
            + ',' + Math.floor(Math.random() * 256)
            + ')';
    }

    _divs: [] = [];
    _ivId = -1;

    constructor() {
        super(...arguments);
    }

    componentWillUnmount() {
        super.componentWillUnmount(...arguments);
        if (this._ivId !== -1)
            clearInterval(this._ivId);
    }

    _generateDivs(n: Number) {
        const style = {
            width: '20%',
            height: '20%',
            display: 'inline-block',
            padding: '5px',
            opacity: '0.6',
            transition: 'background 200ms ease-out'
        };
        let res = [];
        for (let i = 0; i < n; ++i) {
            res.push(<div ref={elem => {
                if (elem) this._divs.push(elem)
            }}
                          key={i}
                          style={{...style, background: PopupMenuTab.getRandomColor()}}
                          onContextMenu={(e) => PopupMenu.openMenu(e, this.MENU_ITEMS, {target: e.currentTarget})}>
                {'0'.repeat(3 - ('' + i).length) + (i + 1)}
            </div>)
        }

        return res;
    }

    _party() {
        if (this._ivId !== -1) {
            clearInterval(this._ivId);
            this._ivId = -1;
            return;
        }
        this._ivId = setInterval(() => {
            Utils.forEach(this._divs, (div) => {
                div.style.background = PopupMenuTab.getRandomColor();
            })
        }, 250)
    }


    render() {
        return <div style={{flex: '1'}}>
            {this._generateDivs(25)}
        </div>;
    }

    MENU_ITEMS = [
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Zmień kolor";
            item.hint = "Nadaje nowy losowy kolor";
            item.onClick = (e, props) => {
                props.target.style.background = PopupMenuTab.getRandomColor()
            };
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Zmień kolor i nie zamykaj";
            item.hint = "Nadaje nowy losowy kolor i nie zamyka menu";
            item.onClick = (e, props) => {
                props.target.style.background = PopupMenuTab.getRandomColor()
            };
            item.closeOnClick = false;
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Kolor elementu";
            item.hint = "Ikona jest w kolorze elementu w momencie otwarcia menu";
            item.onBeforeOpen = (item, props) => {
                item.icon = <span className={Icon.SQUARE} style={{color: props.target.style.backgroundColor}}/>
            };
            item.onClick = (e, props) => {
                alert(props.target.style.backgroundColor);
            };
        }),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "PARTY!!!";
            item.hint = "OSTRZEŻENIE PRZED EPILEPSJĄ! ;)";
            item.checkbox = true;
            item.onBeforeOpen = (item) => item.checked = this._ivId !== -1;
            item.onClick = (e, props) => this._party();
        }),
        MenuItem.createSeparator("Zagnieżdżenia"),
        MenuItem.createItem((item: MenuItem) => {
            item.name = "Ustaw kolor";
            item.hint = "Ustaw jeden z dostępnych kolorów";
            item.subMenu = [
                MenuItem.createItem((item: MenuItem) => {
                    let color = 'rgb(255,0,0)';
                    item.icon = <span className={Icon.SQUARE} style={{color: color}}/>;
                    item.name = "Czerwony";
                    item.onClick = (e, props) => props.target.style.background = color;
                }),
                MenuItem.createItem((item: MenuItem) => {
                    let color = 'rgb(0,255,0)';
                    item.icon = <span className={Icon.SQUARE} style={{color: color}}/>;
                    item.name = "Zielony";
                    item.onClick = (e, props) => props.target.style.background = color;
                }),
                MenuItem.createItem((item: MenuItem) => {
                    let color = 'rgb(0,0,255)';
                    item.icon = <span className={Icon.SQUARE} style={{color: color}}/>;
                    item.name = "Niebieski";
                    item.onClick = (e, props) => props.target.style.background = color;
                })
            ]
        }),
        MenuItem.createItem((item: MenuItem) => {
            let r = 0, g = 0, b = 0;
            item.name = "Dostosuj kolor";
            item.hint = "Dostosuj kolor elementu";
            item.onBeforeOpen = (item, props) => {
                let color = props.target.style.backgroundColor;
                color = color.slice(4).slice(0, -1);
                [r, g, b] = color.split(',');
                r = Number(r);
                g = Number(g);
                b = Number(b);
            };
            item.subMenu = [
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.SQUARE} style={{color: 'rgb(255,0,0)'}}/>;
                    item.name = "Czerwony";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.name = "Zwiększ";
                            item.icon = Icon.CHEVRON_UP;
                            item.closeOnClick = false;
                            item.onClick = (e, props) => {
                                r += 25;
                                if (r > 255) r = 255;
                                props.target.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
                            }
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.name = "Zmniejsz";
                            item.icon = Icon.CHEVRON_DOWN;
                            item.closeOnClick = false;
                            item.onClick = (e, props) => {
                                r -= 25;
                                if (r < 0) r = 0;
                                props.target.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
                            }
                        })
                    ]
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.SQUARE} style={{color: 'rgb(0,255,0)'}}/>;
                    item.name = "Zielony";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.name = "Zwiększ";
                            item.icon = Icon.CHEVRON_UP;
                            item.closeOnClick = false;
                            item.onClick = (e, props) => {
                                g += 25;
                                if (g > 255) g = 255;
                                props.target.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
                            }
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.name = "Zmniejsz";
                            item.icon = Icon.CHEVRON_DOWN;
                            item.closeOnClick = false;
                            item.onClick = (e, props) => {
                                g -= 25;
                                if (g < 0) g = 0;
                                props.target.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
                            }
                        })
                    ]
                }),
                MenuItem.createItem((item: MenuItem) => {
                    item.icon = <span className={Icon.SQUARE} style={{color: 'rgb(0,0,255)'}}/>;
                    item.name = "Niebieski";
                    item.subMenu = [
                        MenuItem.createItem((item: MenuItem) => {
                            item.name = "Zwiększ";
                            item.icon = Icon.CHEVRON_UP;
                            item.closeOnClick = false;
                            item.onClick = (e, props) => {
                                b += 25;
                                if (b > 255) b = 255;
                                props.target.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
                            }
                        }),
                        MenuItem.createItem((item: MenuItem) => {
                            item.name = "Zmniejsz";
                            item.icon = Icon.CHEVRON_DOWN;
                            item.closeOnClick = false;
                            item.onClick = (e, props) => {
                                b -= 25;
                                if (b < 0) b = 0;
                                props.target.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
                            }
                        })
                    ]
                })
            ]
        })
    ]

}

