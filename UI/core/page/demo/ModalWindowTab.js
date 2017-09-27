//@Flow
'use strict';
import {React, Utils, Dev} from '../../core';
import {Component, Button, Icon, Page} from '../../components';
import {ModalWindow, MW_BUTTONS} from "../../component/modal/ModalWindow";
import FormTab from "./FormTab";
import Resizer from "../../component/panel/Resizer";
import {Scrollbar} from "../../component/panel/Scrollbar";
import Panel from "../../component/panel/Panel";


export class DemoModalPage extends Page {
    render() {
        return "HELLO";
    }
}

export default class ModalWindowTab extends Component {

    render() {
        return (
            <div style={{overflow: 'auto'}}>
                <div>
                    {Utils.forEach(this.MODAL_WINDOWS, (mw, index) => {
                        return <Button key={index}
                                       type="primary"
                                       onClick={() => mw.modalWindow.open()}>{mw.name}</Button>
                    })}
                </div>
                <Panel foldable border name={"Tytuł testowy rozwijalnego panelu"}
                       style={{width: '500px'}}
                       icon={Icon.BUG.className}>
                    {Dev.LOREM_IPSUM}
                </Panel>
            </div>
        )
    }

    MODAL_WINDOWS = [
        {
            name: "Domyślne",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Domyślne okno modalne"
            })
        },
        {
            name: "OK i Anuluj",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Okno z przyciskami OK_CANCEL";
                mw.buttons = MW_BUTTONS.OK_CANCEL;
            })
        },
        {
            name: "Tak, nie i zamknij",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Okno z przyciskami YES_NO_CLOSE";
                mw.buttons = MW_BUTTONS.YES_NO_CLOSE;
            })
        },
        {
            name: "Bez ikony",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Bez ikony z lewej strony";
            })
        },
        {
            name: "Bez przycisków",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Okno bez przycisków ale z 'X' w prawym górnym rogu";
                mw.closeButton = true;
                mw.buttons = null;
            })
        },
        {
            name: "Długi tytuł",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Okno z długim tytułem";
                mw.title.set("Wyjątkowo długi tytuł okna modalnego, by zaprezentować przycinanie tekstu na nim. Gdyby okno było zbyt duże, to zawsze można je zmniejszyć :)");
            })
        },
        {
            name: "Lorem Ipsum",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = Dev.LOREM_IPSUM;
            })
        },
        {
            name: "Złożona zawartość",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.title.set("Formularz");
                mw.buttons = null;
                mw.closeButton = true;
                mw.content = <FormTab/>;
            })
        },
        {
            name: "Zagnieżdżenie",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = <div>
                    <div>Okno wywołujące kolejne okno (niezalecana praktyka)</div>
                    <Button
                        type={"default"}
                        onClick={() => {
                            ModalWindow.create((mw) => {
                                mw.content = "Tralalala"
                            }).open()
                        }}
                    >Zagnieżdżone</Button></div>;
            })
        },
        /*   {
               name: "HTML zamiast ikony",
               modalWindow: ModalWindow.create((mw: ModalWindow) => {
                   mw.content = "W miejsce ikony wstawiony HTML";
                   mw.icon = <div style={{background: 'lightgray', padding: '10px', fontSize: '2.5em'}}>
                       <div className={Icon.STOP_CIRCLE_O} style={{color: "red", display: 'block'}}/>
                       <div className={Icon.PAUSE_CIRCLE_O} style={{color: "orange", display: 'block'}}/>
                       <div className={Icon.PLAY_CIRCLE_O} style={{color: "green", display: 'block'}}/>
                   </div>
               })
           },*/
        {
            name: "Własna stopka",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Ręcznie zdefiniowana stopka okna ";
                mw.buttons =
                    <div style={{
                        width: '100%',
                        height: '100%',
                        border: '2px solid lightgray',
                        borderRadius: '5px',
                        paddingBottom: '10px',
                        textAlign: 'right'
                    }}>
                        <Button type="success" onClick={(e) => mw.confirm(e)} icon={Icon.CHECK}/>
                        <Button type="danger" onClick={(e) => mw.cancel(e)} icon={Icon.TIMES}/>
                    </div>
            })
        },
        {
            name: "Bez resizera",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Okno bez możliwości zmiany jego wielkości";
                mw.resizable = false;
            })
        },
        {
            name: "Callbacki",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = <div style={{alignSelf: 'center'}}>
                    <div>Okno z callbackami onConfirm, onCancel i onClose</div>
                    <div>dodatkowo onConfirm i onCancel zapobiegają zamknięciu okna</div>
                </div>;
                mw.buttons = MW_BUTTONS.OK_CANCEL | MW_BUTTONS.CLOSE;
                mw.onConfirm = () => {
                    alert("Kliknięto OK");
                    return false;
                };
                mw.onCancel = () => {
                    alert("Kliknięto Anuluj");
                    return false;
                };
                mw.onClose = (e, res) => alert('Okno zamknięte z wynikiem: ' + res);
            })
        },
        {
            name: "Nadpisany styl",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Okno z nadpisanymi stylami";
                mw.mainStyle = {
                    width: '400px',
                    height: '200px',
                    borderRadius: '10px',
                    borderColor: 'red',
                    boxShadow: '0 0 10px red',
                };
                mw.titleStyle = {backgroundColor: 'red', color: 'white', fontWeight: 'bolder'};
                mw.iconStyle = {color: 'red', borderRight: '1px solid lightgray', padding: '20px'};
                mw.footerStyle = {background: 'red'};
                mw.resizable = false;
            })
        },
        {
            name: "Bez przeciągania",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "Okno bez możliwości zmiany pozycji";
                mw.draggable = false;
            })
        },
        {
            name: "Strona",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.title.set("Strona w oknie modalnym");
                mw.content = <DemoModalPage/>;
            })
        }

        /* wzorzec
         {
         name: "",
         modalWindow: ModalWindow.create((mw: ModalWindow) => {
         mw.content = "";
         })
         }
         */
    ]
}