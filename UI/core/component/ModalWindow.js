//@Flow
'use strict';
import {React, ReactDOM, Application, If} from '../core';
import {Button, Icon, Resizer, Dragger} from '../components';

export class ModalWindow {

    /** treść na belce tytułowej
     * @type {string}
     */
    title: ?string = "Komunikat";
    /** ikona z lewej strony
     *
     */
    icon: ?Icon = Icon.INFO;
    /** zawartość okna
     * @type {null}
     */
    content: ?any = null;
    /** czy ma być wyświetlany przycisk X na belce
     * @type {boolean}
     */
    closeButton: boolean = false;
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
    iconStyle: ?object = null;

    /** Tworzy nową instancję ModalWindow
     * @param config - callback konfigurujący instancję
     * @returns {ModalWindow} - nowa instancja ModalWindow
     */
    static create(config: (cfg: ModalWindow) => void): ModalWindow {
        let ins = new ModalWindow();
        if (config) If.isFunction(config, config(ins));
        return ins;
    }

    redraw() {
        Application.render(this.render(), this._instance);
    }

    /** otwiera okno */
    open() {
        if (this._instance)return;
        this._instance = document.createElement('span');
        document.body.appendChild(this._instance);
        this._instance.style.position = 'fixed';
        this._instance.style.left = 0;
        this._instance.style.right = 0;
        this._instance.style.top = 0;
        this._instance.style.bottom = 0;
        this._instance.style.backgroundColor = 'rgba(0,0,0,0.5)';

        Application.render(this.render(), this._instance);
        this.result = false;
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
                If.isFunction(this.onConfirm, close = this.onConfirm(e));
        } catch (ex) {
            err = ex;
        }
        if (close)
            this.close(e);
        if (err)throw err;
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
                If.isFunction(this.onCancel, close = this.onCancel(e));
        } catch (ex) {
            err = ex;
        }
        if (close)
            this.close(e);
        if (err)throw err;
    }

    /** zamknięcie okna bez zmiany jego statusu
     * @param e obiek zdarzenia przekazywany do callbacka onClose
     */
    close(e: Event) {
        let err = null;
        try {
            if (this.onClose)
                If.isFunction(this.onClose, this.onClose(e, this.result));
        } catch (ex) {
            err = ex;
        }
        ReactDOM.unmountComponentAtNode(this._instance);
        this._instance.remove();
        this._instance = null;
        e.preventDefault();
        e.stopPropagation();
        if (err)throw err;
    }

    /** wyśrodkowuje okno
     * @param mw - tag okna
     * @private
     */
    _setPosition(mw) {
        if (!mw) return;
        let elem = ReactDOM.findDOMNode(mw);
        const pos = elem.getBoundingClientRect();
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        elem.style.left = (x - pos.width / 2) + 'px';
        elem.style.top = (y - pos.height / 2) + 'px';
    }

    /** generuje predefiniowane przyciski
     * @returns {XML} tag z przyciskami
     * @private
     */
    _renderButtons() {
        let butts = [];
        if (this.buttons & MW_BUTTONS.OK)
            butts.push(<Button type={"default"}
                               focus={butts.length === 0}
                               key="ok"
                               onClick={(e) => this.confirm(e)}
                               title="OK">OK</Button>);
        if (this.buttons & MW_BUTTONS.CANCEL)
            butts.push(<Button type={"default"}
                               focus={butts.length === 0}
                               key="cancel"
                               onClick={(e) => this.cancel(e)}
                               title="Anuluj">Anuluj</Button>);
        if (this.buttons & MW_BUTTONS.YES)
            butts.push(<Button type={"success"}
                               focus={butts.length === 0}
                               key="yes"
                               onClick={(e) => this.confirm(e)}
                               title="Tak">Tak</Button>);
        if (this.buttons & MW_BUTTONS.NO)
            butts.push(<Button type={"danger"}
                               focus={butts.length === 0}
                               key="no"
                               onClick={(e) => this.cancel(e)}
                               title="Nie">Nie</Button>);
        if (this.buttons & MW_BUTTONS.CLOSE)
            butts.push(<Button type={"default"}
                               focus={butts.length === 0}
                               key="close"
                               onClick={(e) => this.close(e)}
                               title="Zamknij">Zamknij</Button>);
        return <div style={{textAlign: 'center'}}>{butts}</div>;
    }

    //
    render() {
        return (
            <Resizer
                className="c-modal-window"
                resizable={this.resizable}
                fromCenter={true}
                ref={elem => this._setPosition(elem)}
                tabIndex={-1}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    minWidth: '300px',
                    minHeight: '200px',
                    maxWidth: '85%',
                    maxHeight: '85%',
                    ...this.mainStyle
                }}
            >
                <div className="c-modal-window-title" style={{
                    flex: '0 0 auto',
                    display: 'flex',
                    ...this.titleStyle
                }}>
                    <span
                        title={this.title}
                        onMouseDown={this.draggable ? (e) => Dragger.dragStart(e, e.currentTarget.parentElement.parentElement) : null}
                        style={{
                            cursor: 'default',
                            fontWeight: 'bolder',
                            flex: '1 1 auto',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            padding: '5px 20px'
                        }}>{this.title}</span>
                    {this.closeButton ? <span className={"c-modal-window-exit " + Icon.TIMES}
                                              title="Zamknij"
                                              style={ {flex: '0 0 auto'} }
                                              onClick={(e) => this.close(e)}/> : null}
                </div>
                <div className="c-modal-window-content"
                     style={{
                         flex: '1 1 auto',
                         display: 'flex',
                         overflow: 'hidden'
                     }}>
                    {this.icon ?
                        <span style={{padding: '20px 0px 20px 20px', ...this.iconStyle}}>
                    {this.icon instanceof Icon ?
                        <span className={this.icon} style={{fontSize: '5em'}}/> : this.icon}
                    </span> : null}
                    <span style={{
                        display: 'flex',
                        flex: '1 1 auto',
                        overflow: 'auto',
                        padding: '10px'
                    }}>{typeof(this.content) === 'string' ?
                        <div style={{
                            display: 'table',
                            height: '100%',
                            width: '100%',
                        }}>
                            <div style={{
                                display: 'table-cell',
                                textAlign: 'center',
                                verticalAlign: 'middle'
                            }}>{this.content}</div>
                        </div>
                        : this.content}</span>
                </div>
                <div className="c-modal-window-footer"
                     style={{
                         flex: '0 0 auto',
                         width: '100%',
                         ...this.footerStyle
                     }}>
                    {typeof(this.buttons) === 'number' ? this._renderButtons() : this.buttons}
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