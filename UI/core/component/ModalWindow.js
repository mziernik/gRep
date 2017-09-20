//@Flow
'use strict';
import {React, ReactUtils, PropTypes, ReactDOM, Application, Is, AppNode, Utils, AppEvent} from '../core';
import {Component, Button, Icon, Resizer, Dragger, Scrollbar, DynamicValue} from '../components';
import {PageTab} from "../page/PageContainer";
import {Children, Dynamic} from "./Component";
import {PageButtons} from "../page/Page";
import {Btn} from "./Button";
import {isFunction} from "../utils/Check";
import {Observer} from "../utils/Dispatcher";


export class ModalWindow {
    /** zawartość okna
     * @type {null}
     */
    content: ?any = null;
    /** czy ma być wyświetlany przycisk X na belce
     * @type {boolean}
     */
    closeButton: boolean = true;
    /** callback zamknięcia okna. Występuje zawsze przy zamknięciu
     * @type {null}
     */
    onClose: ?(e: Event, result: boolean) => boolean = null;
    /** callback OK/YES. Musi zwrócić info czy okna ma zostać zamknięte (true-tak, false-nie)
     * @type {null}
     */
    onConfirm: ?(e: Event) => boolean = null;
    /** callback CANCEL/NO. Musi zwrócić info czy okna ma zostać zamknięte (true-tak, false-nie)
     * @type {null}
     */
    onCancel: ?(e: Event) => boolean = null;
    /** wynik okna true-OK/YES, false-CANCEL/NO
     * @type {boolean}
     */
    result: boolean = false;
    /** belka z guzikami. Może być HTML lub liczba (enum MW_BUTTONS) reprezentująca predefiniowane przyciski
     * @type {number}
     */
    buttons: ?any = MW_BUTTONS.OK;
    /** czy ma zawierać resizera
     * @type {boolean}
     */
    resizable: boolean = true;
    /** czy ma być przeciągane
     * @type {boolean}
     */
    draggable: boolean = true;
    /** styl głównego tagu
     * @type {null}
     */
    mainStyle: ?Object = null;
    /** styl zawartości okna
     * @type {null}
     */
    contentStyle: ?Object = null;
    /** styl belki tytułowej
     * @type {null}
     */
    titleStyle: ?Object = null;
    /** styl topki z guzikami
     * @type {null}
     */
    footerStyle: ?Object = null;
    /** styl tagu z ikoną
     * @type {null}
     */

    _node: AppNode;
    _tag = null;
    _tmpStyle: {} = null;
    _closed: boolean = false;


    /** treść na belce tytułowej
     * @type {string}
     */
    title: Dynamic<string> = new Dynamic(null, v => <span>{v}</span>);

    icon: Dynamic<string> = new Dynamic(null, v => v ? <span style={{
        fontSize: '3em',
        paddingTop: "30px",
        paddingLeft: "20px"
    }} className={v}/> : null);

    constructor() {
        Utils.makeFinal(this, ["title", "icon"]);
        AppEvent.RESIZE.listen(this, () => this._limitPosition());
        this._observer = new MutationObserver((mutations) => {
            let done: boolean = false;
            Utils.forEach(mutations, (mut) => {
                if (!done)
                    if (mut.type === 'childList') {
                        done = true;
                        this._limitPosition();
                    }
            })
        })
    }


    /** Tworzy nową instancję ModalWindow
     * @param config - callback konfigurujący instancję
     * @returns {ModalWindow} - nowa instancja ModalWindow
     */
    static create(config: (cfg: ModalWindow) => void): ModalWindow {
        let ins = new ModalWindow();
        if (config) Is.func(config, config(ins));
        return ins;
    }

    static open(config: (cfg: ModalWindow) => void): ModalWindow {
        return ModalWindow.create(config).open();
    }

    redraw() {
        Application.render(this.render(), this._instance);
    }

    /** otwiera okno */
    open(tab: PageTab): AppNode {
        if (this._instance) return;
        this._instance = document.createElement('div');
        document.body.appendChild(this._instance);
        this._instance.style.position = 'fixed';
        this._instance.style.left = 0;
        this._instance.style.right = 0;
        this._instance.style.top = 0;
        this._instance.style.bottom = 0;
        this._instance.style.backgroundColor = 'rgba(0,0,0,0.5)';
        this._instance.style.zIndex = Component.zIndex;

        if (!this.title.value && tab)
            this.title.set(tab.title);
        this._node = Application.render(this.render(), this._instance, tab);
        this.result = false;
        this._observer.observe(this._tag, {childList: true, subtree: true});
        return this._node;
    }

    /**
     * Dodanie przycisku
     * @param callback
     */
    button(callback: (btn: Button) => void): Btn {
        if (!(this.buttons instanceof PageButtons))
            this.buttons = new PageButtons();

        return (this.buttons: PageButtons).add(callback);
    }

    /** zamknięcie okna z statusem true
     * @param e obiekt zdarzenia przekazywany do callbacka onConfirm
     */
    confirm(e: Event) {
        let err = null;
        this.result = true;
        let close = true;
        try {
            if (this.onConfirm)
                Is.func(this.onConfirm, close = this.onConfirm(e));
        } catch (ex) {
            err = ex;
        }
        if (close)
            this.close(e);
        if (err) throw err;
    }

    /** zamknięcie okna z statusem false
     * @param e obiekt zdarzenia przekazywany do callback onCancel
     */
    cancel(e: Event) {
        let err = null;
        this.result = false;
        let close = true;
        try {
            if (this.onCancel)
                Is.func(this.onCancel, close = this.onCancel(e));
        } catch (ex) {
            err = ex;
        }
        if (close)
            this.close(e);
        if (err) throw err;
    }

    /** zamknięcie okna bez zmiany jego statusu
     * @param e obiek zdarzenia przekazywany do callbacka onClose
     */
    close(e: Event) {
        if (this._closed) return;
        this._closed = true;

        let err = null;
        try {
            Is.func(this.onClose, () => this.onClose(e, this.result));
        } catch (ex) {
            err = ex;
        }
        ReactDOM.unmountComponentAtNode(this._instance);
        this._instance.remove();
        this._instance = null;
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (this._observer)
            this._observer.disconnect();
        if (err) throw err;
    }

    /** wyśrodkowuje okno
     * @param mw - tag okna
     * @private
     */
    _centerWindow(mw) {
        if (!this._tag) {
            if (!mw) return;
            this._tag = ReactDOM.findDOMNode(mw);
        }
        const pos = this._tag.getBoundingClientRect();
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        this._tag.style.left = (x - pos.width / 2) + 'px';
        this._tag.style.top = (y - pos.height / 2) + 'px';
    }

    /** przsuwa okno by nie rysowało się poza widokiem
     * @param mw tag okna modalnego
     * @private
     */
    _limitPosition(mw) {
        if (!this._tag) {
            if (!mw) return;
            this._tag = ReactDOM.findDOMNode(mw);
        }
        const pos = this._tag.getBoundingClientRect();

        if (pos.left < 0)
            this._tag.style.left = '0px';
        if (pos.top < 0)
            this._tag.style.top = '0px';

        const w = pos.right - window.innerWidth;
        if (w > 0)
            this._tag.style.left = (pos.left - w) + 'px';
        const h = pos.bottom - window.innerHeight;
        if (h > 0)
            this._tag.style.top = (pos.top - h) + 'px';

    }

    /** sprawdza czy okno jest zmaksymalizowane
     * @returns {boolean}
     * @private
     */
    _isMaximized(): boolean {
        return (!!this._tmpStyle
            && parseInt(this._tag.style.top) === 0
            && parseInt(this._tag.style.left) === 0
            && this._tag.style.width === "100%"
            && this._tag.style.height === "100%");
    }

    /** maksymalizuje okno lub przywraca jego poprzedni stan
     * @param e zdarzenie myszy
     * @param pos czy ma przywrócić poprzednią pozycję
     * @param size czy ma przywrócić poprzedni rozmiar
     * @private
     */
    _maximize(e: ?MouseEvent, pos: boolean = true, size: boolean = true) {
        if (!this._isMaximized()) {
            this._tmpStyle = {
                top: this._tag.style.top,
                left: this._tag.style.left,
                width: this._tag.style.width,
                height: this._tag.style.height,
            };

            this._tag.style.top = '0';
            this._tag.style.left = '0';
            this._tag.style.width = '100%';
            this._tag.style.height = '100%';

        } else if (this._tmpStyle) {
            if (pos) {
                this._tag.style.top = this._tmpStyle.top;
                this._tag.style.left = this._tmpStyle.left;
            }
            if (size) {
                this._tag.style.width = this._tmpStyle.width;
                this._tag.style.height = this._tmpStyle.height;
            }
            this._limitPosition();
        }
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    /** Utwórz domyślny przycisk "Anuluj" */
    get btnCancel() {
        return new Btn((btn: Btn) => {
            btn.key = "cancel";
            btn.type = "default";
            //btn.icon = Icon.PLUS;
            btn.text = "Anuluj";
            btn.modalClose = true;
        });
    }

    //
    render() {

        let content = this.content;

        if (Is.func(content))
            content = content();

        if (Is.string(content))
            content = <div style={{
                display: 'table',
                height: '100%',
                width: '100%',
            }}>
                <div style={{
                    display: 'table-cell',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                }}>{this.content}</div>
            </div>;


        return (
            <Resizer
                className="c-modal-window"
                resizable={this.resizable}
                fromCenter={true}
                ref={elem => this._centerWindow(elem)}
                tabIndex={-1}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    minWidth: '300px',
                    minHeight: '200px',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    boxShadow: "4px 4px 8px 2px rgba(0, 0, 0, 0.3)",
                    ...this.mainStyle
                }}
            >
                <div className="c-modal-window-title"
                     style={{
                         flex: '0 0 auto',
                         display: 'flex',
                         ...this.titleStyle
                     }}>
                    <span
                        className="c-modal-window-title-text"
                        title={this.title.value}
                        onDoubleClick={(e) => this._maximize(e)}
                        onMouseDown={this.draggable ? (e) => {
                            if (this._isMaximized())
                                Dragger.dragStart(e, e.currentTarget.parentElement.parentElement, true, true, () => this._maximize(null, false));
                            else
                                Dragger.dragStart(e, e.currentTarget.parentElement.parentElement, true)
                        } : null}

                        style={{
                            flex: '1 1 auto',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}>{this.title.$}</span>
                    {this.closeButton ? <span
                        className={"c-modal-window-exit " + Icon.TIMES}
                        title="Zamknij"
                        style={{flex: '0 0 auto'}}
                        onClick={(e) => this.close(e)}/> : null}
                </div>
                <div className="c-modal-window-body"
                     style={{
                         position: 'relative',
                         flex: '1 1 auto',
                         display: 'flex',
                         overflow: 'hidden'
                     }}>
                    {this.icon.$}
                    <div className="c-modal-window-body-content"
                         style={{
                             display: 'flex',
                             flex: '1 1 auto',
                             overflow: 'auto',
                             ...this.contentStyle
                         }}>
                        <Scrollbar/>
                        <Scrollbar horizontal/>
                        {content}
                    </div>
                </div>
                <div className="c-modal-window-footer"
                     style={{
                         flex: '0 0 auto',
                         width: '100%',
                         ...this.footerStyle
                     }}>
                    <ModalButtons modal={this}/>
                </div>
            </Resizer>);
    }
}

/** enumerata predefioniwanych przycisków
 * @type {{NONE: number, OK: number, CANCEL: number, YES: number, NO: number, CLOSE: number, OK_CANCEL: number, YES_NO: number, YES_NO_CLOSE: number}}
 */
export const MW_BUTTONS = {
    NONE: 0,
    OK: 1,
    CANCEL: 2,
    YES: 4,
    NO: 8,
    CLOSE: 16,
    //kombinacje
    OK_CANCEL: 3,
    YES_NO: 12,
    YES_NO_CLOSE: 28
};


function ModalButtons(props) {

    const modal: ModalWindow = props.modal;


    if (modal.buttons instanceof PageButtons) {
        const pb: PageButtons = modal.buttons;

        Utils.forEach(pb.list, (btn: Btn) => {
            if (!btn.modalClose) return;
            const act = btn.onClick;
            btn.onClick = e => {
                if (act)
                    act(e);
                if (btn.modalClose)
                    modal.close(e);
            };

        });

        return pb.$;
    }


    if (!Is.number(modal.buttons)) {
        return modal.buttons;

    }

    let butts = [];
    if (modal.buttons & MW_BUTTONS.OK)
        butts.push(<Button type={"default"}
                           focus={butts.length === 0}
                           key="ok"
                           onClick={(e) => modal.confirm(e)}
                           title="OK">OK</Button>);
    if (modal.buttons & MW_BUTTONS.CANCEL)
        butts.push(<Button type={"default"}
                           focus={butts.length === 0}
                           key="cancel"
                           onClick={(e) => modal.cancel(e)}
                           title="Anuluj">Anuluj</Button>);
    if (modal.buttons & MW_BUTTONS.YES)
        butts.push(<Button type={"success"}
                           focus={butts.length === 0}
                           key="yes"
                           onClick={(e) => modal.confirm(e)}
                           title="Tak">Tak</Button>);
    if (modal.buttons & MW_BUTTONS.NO)
        butts.push(<Button type={"danger"}
                           focus={butts.length === 0}
                           key="no"
                           onClick={(e) => modal.cancel(e)}
                           title="Nie">Nie</Button>);
    if (modal.buttons & MW_BUTTONS.CLOSE)
        butts.push(<Button type={"default"}
                           focus={butts.length === 0}
                           key="close"
                           onClick={(e) => modal.close(e)}
                           title="Zamknij">Zamknij</Button>);
    return <div style={{textAlign: 'center'}}>{butts}</div>;


}