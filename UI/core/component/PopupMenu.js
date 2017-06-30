//@Flow
'use strict';
import {React, PropTypes, Field, Type, FieldConfig, Utils, If} from '../core';
import {Component, Page, FontAwesome, FieldComponent, FieldController}    from        '../components';
import './PopupMenu.css'

let elm: PopupMenu;

export class PopupMenu extends Component {
    /** styl menu
     * @private
     */
    _style = {
        visibility: 'hidden',
        boxShadow: '2px 2px 5px gray',
        position: 'absolute',
        background: 'white',
        border: '1px solid gray',
        cursor: 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap'
    };


    static createMenu(e: Event, items: [], onClick: ?(item: MenuItem) => void = null) {
        if (!elm) {
            const tag = document.createElement("span");
            document.body.appendChild(tag);
            elm = Application.render(<PopupMenu key={Utils.randomId()}/>, tag);
        }
        elm.setState({items: items})
        e.preventDefault();
        e.stopPropagation();
    }

    static propTypes = {
        // czy menu jest otwarte
        opened: PropTypes.bool,
        // współrzędne menu
        x: PropTypes.number,
        y: PropTypes.number,
        // lista pozycji menu
        items: PropTypes.array,
        // obiekt z dodatkowymi argumentami dla zdarzenia onClick
        onClickProps: PropTypes.object
    };

    constructor() {
        super(...arguments);
        this.state = {
            opened: this.props.opened || false,
            x: this.props.x || 0,
            y: this.props.y || 0,
            items: this.props.items || null
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

    componentWillUnmount() {
        super.componentWillUnmount();
        window.removeEventListener('mousedown', this._onMouseUpListener);
    }

    componentWillReceiveProps(props) {
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
                this.forceUpdate()
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
        if (!elem)return;
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
        return <table>
            <tbody>{Utils.forEach(items, (item, index) => {

                // Separator
                if (item instanceof (MenuItemSeparator)) {
                    if (item.name)
                        return <tr key={index}>
                            <td>
                                <hr style={{margin: '5px'}}/>
                            </td>
                            <td colSpan="3">
                                <span style={{display: 'flex'}}>
                                    <span style={{padding: '0 5px', color: 'lightgray'}}>{item.name}</span>
                                    <span style={{flex: '1 1 auto'}}><hr style={{margin: '5px'}}/></span>
                                </span>
                            </td>
                        </tr>;
                    return <tr key={index}>
                        <td colSpan="4">
                            <hr style={{margin: '5px'}}/>
                        </td>
                    </tr>
                }

                // Zwykła pozycja
                if (item.hidden)return;
                let subProps = {};
                if (item.subMenu && !item.disabled) {
                    subProps = {
                        onMouseEnter: () => this._handleSubmenu(item, true),
                        onMouseLeave: () => this._handleSubmenu(item, false),
                    }
                }
                return <tr
                    title={item.hint}
                    className={item.disabled ? null : "menuItem"}
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
                                    If.isFunction(item.onClick, item.onClick(e, this.state.onClickProps));
                                if (!item.subMenu && item.closeOnClick) this.setState({opened: false});
                            }}
                    {...subProps}
                >
                    <td style={{padding: '5px'}}>{item.icon}</td>
                    <td style={{padding: '5px'}}>
                        {item.name}
                    </td>
                    <td style={{padding: '5px'}}>
                        {item.subMenu && !item.disabled ?
                            <span className={FontAwesome.CHEVRON_RIGHT}
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
        if (!opened)return null;
        return <span ref={elem => this._setPosition(elem, true)}
                     style={{
                         ...this._style,
                         left: '100%'
                     }}>
            {this.renderItems(items)}
        </span>
    }

    render() {
        return <span ref={elem => {
            if (elem) this._menu = elem;
            this._setPosition(elem, false);
        }}
                     style={{
                         ...this._style,
                         display: this.state.opened ? null : 'none',
                         left: this.state.x,
                         top: this.state.y,
                         zIndex: 1000,
                     }}
                     onContextMenu={(e) => e.preventDefault()}
        >{this.renderItems(this.state.items)}</span>;
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
    onClick: (e, props) => void = null;
    /** Czy menu ma się zamykać po kliknięciu na pozycję
     * @type {boolean}
     */
    closeOnClick: boolean = true;

    /** Tworzy nowy obiekt MenuItem
     * @param config callback konfigurujący obiekt MenuItem
     * @returns {MenuItem}
     */
    static createItem(config: (item: MenuItem) => void): MenuItem {
        let item = new MenuItem();
        If.isFunction(config, config(item));
        return item;
    }

    /** Tworzy nowy obiekt MenuItemSeparator
     * @param name opcjonalna wyświetlana nazwa
     * @returns {MenuItemSeparator}
     */
    static createSeparator(name: ?any = null): MenuItemSeparator {
        return new MenuItemSeparator(name);
    }
}