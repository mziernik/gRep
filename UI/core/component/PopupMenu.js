//@Flow
'use strict';
import {Application, React, PropTypes, Utils, Is} from '../core';
import {Component, Icon} from '../components';

let INSTANCE: PopupMenu;

export class PopupMenu extends Component {
    static propTypes = {
        // czy menu jest otwarte
        opened: PropTypes.bool,
        // współrzędne menu
        x: PropTypes.number,
        y: PropTypes.number,
        // lista pozycji menu
        items: PropTypes.array,
        // obiekt z dodatkowymi argumentami dla zdarzenia onClick
        itemEventProps: PropTypes.object,
        onClick: PropTypes.func
    };
    /** styl menu
     * @private
     */
    _style = {
        visibility: 'hidden',
        position: 'absolute',
    };
    state: {
        opened: boolean, // czy otwarte
        x: Number, // współrzędne
        y: Number, // współrzędne
        items: [], // submenu
        itemEventProps: {}, // obiekt z propsami dla zdarzeń
        onClick: (e: Event, props: {}) => void // callback zdarzenia onClick pozycji menu. props to itemEventProps
    };

    constructor() {
        super(...arguments);
        this.state = {
            opened: this.props.opened || false,
            x: this.props.x || 0,
            y: this.props.y || 0,
            items: this.props.items || null,
            itemEventProps: this.props.itemEventProps || {}
        };

        this._onMouseUpListener = (e) => {
            if (!this.state.opened || !this._menu) return;

            let target = e.target;
            while (target) {
                if (target === this._menu) return;
                target = target.parentElement;
            }
            this.setState({opened: false});
        };
        window.addEventListener('mousedown', this._onMouseUpListener);
    }

    /** Otwiera menu kontekstowe
     * @param e obiekt zdarzenia myszy (onContextMenu)
     * @param items tablica pozycji menu
     * @param itemEventProps obiekt z dedykowanymi danymi dla zdarzeń elementów menu
     * @param onClick zdarzenie kliknięcia menu niezwiązane z pozycją
     */
    static open(e: MouseEvent, items: [], itemEventProps: Object = {}, onClick: (e) => void) {
        items = Utils.forEach(Utils.asArray(items), item => item ? item : undefined);
        e.preventDefault();
        e.stopPropagation();
        if (!INSTANCE) {
            const tag = document.createElement("span");
            document.body.appendChild(tag);
            Application.render(<PopupMenu
                ref={elem => INSTANCE = elem}
                opened={true}
                x={e.pageX}
                y={e.pageY}
                items={items}
                onClick={onClick}
                itemEventProps={itemEventProps}
            />, tag);
            return;
        }
        INSTANCE.setState({
            opened: true,
            x: e.pageX,
            y: e.pageY,
            items: items,
            itemEventProps: itemEventProps,
            onClick: onClick
        });
    }

    /** zamyka otwarte podlisty
     * @private
     */
    _close() {
        const closer = (item: MenuItem) => {
            if (item.openSubmenu) {
                item.openSubmenu = false;
                Utils.forEach(item.subMenu, (item) => closer(item));
            }
        };

        Utils.forEach(this.state.items, (item) => closer(item));

        this.setState({opened: false});
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        window.removeEventListener('mousedown', this._onMouseUpListener);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(...arguments);
        this.setState(props);
    }

    /** obsługa otwarcia podlisty menu
     * @param item aktualna pozycja menu z podlistą
     * @param open czy podlista ma się otworzyć
     * @private
     */
    _handleSubmenu(item, open: boolean) {
        if (item.openSubmenu === open) return;
        item.openSubmenu = open;
        if (!item.timer)
            item.timer = setTimeout(() => {
                item.timer = null;
                this.forceUpdate();
            }, 200);
        else {
            clearTimeout(item.timer);
            item.timer = null;
        }
    }

    /** ustala pozycję elementu by się nie rysował poza oknem
     * @param elem element, którego pozycje ma ustalić
     * @param sub czy element jest podlistą menu
     * @private
     */
    _setPosition(elem, sub: boolean) {
        if (!elem) return;
        const el = elem.getBoundingClientRect();
        /* poziom */
        if ((el.left + el.width) >= window.innerWidth) {
            if (sub) {
                elem.style.left = '';
                elem.style.right = '100%';
            }
            else
                elem.style.left = (el.left - el.width) + 'px';
        }

        /* pion */
        if ((el.top + el.height) >= window.innerHeight) {
            if (sub)
                elem.style.top = (elem.offsetTop - el.height) + 'px';
            else
                elem.style.top = (el.top - el.height) + 'px';
        }
        elem.style.visibility = 'visible';
    }

    /** rysująca pozyje menu
     * @param items tablica MenuItem
     * @returns {XML}
     */
    renderItems(items: []) {
        Utils.forEach(items, (item) => {
            if (item.onBeforeOpen) Is.func(item.onBeforeOpen, item.onBeforeOpen(item, this.state.itemEventProps));
        });
        return <table>
            <tbody>{Utils.forEach(items, (item, index) => {
                // Separator
                if (item instanceof (MenuItemSeparator)) {
                    if (item.name)
                        return <tr key={index} style={{color: 'lightgray'}}>
                            <td>
                                <hr style={{margin: '5px'}}/>
                            </td>
                            <td colSpan="3">
                                <div style={{display: 'flex'}}>
                                    <div>{item.name}</div>
                                    <div style={{flex: 1, alignSelf: 'center'}}>
                                        <hr style={{margin: '5px'}}/>
                                    </div>
                                </div>
                            </td>
                        </tr>;
                    return <tr key={index}>
                        <td colSpan="4">
                            <hr style={{margin: '5px'}}/>
                        </td>
                    </tr>
                }

                // Zwykła pozycja
                if (item.hidden) return;
                let subProps = {};
                if (item.subMenu && !item.disabled) {
                    subProps = {
                        onMouseEnter: () => this._handleSubmenu(item, true),
                        onMouseLeave: () => this._handleSubmenu(item, false),
                    }
                }
                return <tr
                    title={item.hint}
                    className={item.disabled ? null : "c-popup-menu-item"}
                    key={index}
                    style={{
                        color: item.disabled ? 'lightgray' : null,
                        whiteSpace: 'nowrap',
                    }}
                    onClick={
                        item.disabled ? null :
                            (e) => {
                                e.stopPropagation();
                                if (item.onClick)
                                    Is.func(item.onClick, item.onClick(e, this.state.itemEventProps));
                                else if (this.state.onClick)
                                    Is.func(this.state.onClick, this.state.onClick(e));
                                if (!item.subMenu && item.closeOnClick) this._close();
                            }}
                    {...subProps}
                >
                    <td style={{
                        padding: '5px 8px',
                        textAlign: 'center'
                    }}>
                        {item.icon instanceof Icon ?
                            <span className={item.icon}/> : item.icon}
                        {item.checkbox ?
                            <span
                                className={item.checked ? Icon.CHECK : Icon.TIMES}/> : null}
                    </td>
                    <td style={{padding: '5px 0'}}>
                        {item.name}
                    </td>
                    <td style={{padding: '5px 8px'}}>
                        {item.subMenu && !item.disabled ?
                            <span className={Icon.CHEVRON_RIGHT}
                                  style={{
                                      fontSize: '0.8em'
                                  }}/>
                            : null}
                    </td>
                    <td>
                        {item.subMenu && !item.disabled ?
                            this.renderSubmenu(item.subMenu, item.openSubmenu)
                            : null}
                    </td>
                </tr>
            })}</tbody>
        </table>;
    }

    /** rysuje podlistę menu
     * @param items lista pozycji MenuItem
     * @param opened czy menu ma być otwarte
     * @returns {*}
     */
    renderSubmenu(items: [], opened: boolean) {
        if (!opened) return null;
        return <div className="c-popup-menu" ref={elem => this._setPosition(elem, true)}
                    style={{
                        ...this._style,
                        left: '100%'
                    }}>
            {this.renderItems(items)}
        </div>
    }

    render() {
        return <div className="c-popup-menu" ref={elem => {
            if (elem) this._menu = elem;
            this._setPosition(elem, false);
        }}
                    style={{
                        ...this._style,
                        display: this.state.opened ? null : 'none',
                        left: this.state.x,
                        top: this.state.y,
                        zIndex: Component.zIndex,
                    }}
                    onContextMenu={(e) => e.preventDefault()}
        >{this.renderItems(this.state.items)}</div>;
    }
}

/** Separator pozycji */
export class MenuItemSeparator {
    name: ?any = null;

    constructor(name = null) {
        this.name = name;
    }
}

/** Pozycja w menu */
export class MenuItem {
    /** Wyświetlana treść
     * @type {null}
     */
    name: ?any = null;
    /** treść hinta
     * @type {null}
     */
    hint: string = '';
    /** ikona
     * @type {null}
     */
    icon: ?any = null;
    /** czy pozycja jest nieaktywna
     * @type {boolean}
     */
    disabled: boolean = false;
    /** czy pozycja jest ukryta
     * @type {boolean}
     */
    hidden: boolean = false;
    /** tablica submenu
     * @type {null}
     */
    subMenu: ?MenuItem[] = null;
    /** Zdarzenie kliknięcia na pozycję
     * @type {null}
     */
    onClick: (e: MouseEvent, props: ?{}) => void = null;
    /** Zdarzenie wywoływane przed otwarciem menu
     * @type {null}
     */
    onBeforeOpen: (item: MenuItem, props: ?{}) => void = null;
    /** Czy menu ma się zamykać po kliknięciu na pozycję
     * @type {boolean}
     */
    closeOnClick: boolean = true;
    /** Czy zawiera checkboxa
     * @type {boolean}
     */
    checkbox: boolean = false;
    /** stan checkboxa
     * @type {boolean}
     */
    checked: boolean = false;

    /** Tworzy nowy obiekt MenuItem
     * @param config callback konfigurujący obiekt MenuItem
     * @returns {MenuItem}
     */
    static create(config: (item: MenuItem) => void): MenuItem {
        let item = new MenuItem();
        Is.func(config, config(item));
        return item;
    }

    /** Tworzy nowy obiekt MenuItemSeparator
     * @param name opcjonalna wyświetlana nazwa
     * @returns {MenuItemSeparator}
     */
    static separator(name: ?any = null): MenuItemSeparator {
        return new MenuItemSeparator(name);
    }
}