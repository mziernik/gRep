//@Flow
'use strict';
import {React, Utils} from '../../core';
import {Component, Button, FontAwesome} from '../../components';
import {ModalWindow, MW_BUTTONS} from "../../component/ModalWindow";
import FormTab from "./FormTab";
import Resizer from "../../component/Resizer";

export default class ModalWindowTab extends Component {

    render() {
        return (
            <div style={{overflow: 'auto'}}>
                <div>
                    {Utils.forEach(this.MODAL_WINDOWS, (mw, index) => {
                        return <Button key={index} onClick={() => mw.modalWindow.open()}>{mw.name}</Button>
                    })}
                </div>
                <Resizer
                    style={{position: 'relative', border: '1px solid black', width: '300px', height: '200px'}}
                    noDefaultLimits={true}
                >
                </Resizer>
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
                mw.icon = null;
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
                mw.title = "Wyjątkowo długi tytuł okna modalnego, by zaprezentować przycinanie tekstu na nim. Gdyby okno było zbyt duże, to zawsze można je zmniejszyć :)";
            })
        },
        {
            name: "Lorem Ipsum",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "…neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";
            })
        },
        {
            name: "Złożona zawartość",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.title = "Formularz";
                mw.icon = null;
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
        {
            name: "HTML zamiast ikony",
            modalWindow: ModalWindow.create((mw: ModalWindow) => {
                mw.content = "W miejsce ikony wstawiony HTML";
                mw.icon = <div style={{background: 'lightgray', padding: '10px', fontSize: '2.5em'}}>
                    <div className={FontAwesome.STOP_CIRCLE_O} style={{color: "red", display: 'block'}}/>
                    <div className={FontAwesome.PAUSE_CIRCLE_O} style={{color: "orange", display: 'block'}}/>
                    <div className={FontAwesome.PLAY_CIRCLE_O} style={{color: "green", display: 'block'}}/>
                </div>
            })
        },
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
                        <Button type="success" onClick={(e) => mw.confirm(e)} icon={FontAwesome.CHECK}/>
                        <Button type="danger" onClick={(e) => mw.cancel(e)} icon={FontAwesome.TIMES}/>
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
                mw.content="Okno bez możliwości zmiany pozycji";
                mw.draggable=false;
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