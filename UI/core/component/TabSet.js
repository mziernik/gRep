import {React, PropTypes, Utils, Is, AppEvent, Trigger} from '../core';
import {Component, Icon} from '../components';
import './TabSet.css';

/** Klasa do obsługi zakładek */
export class TabSet extends Component {

    static propTypes = {
        vertical: PropTypes.bool,
        selectedIndex: PropTypes.number,
        controllerVisible: PropTypes.boolean
    };
    props: {
        vertical: boolean,
        selectedIndex: number
    };

    state: {
        selected: Number, // index otwartej zakładki
        arrows: boolean, // czy widoczne są strzałki od przewijania
    };

    _ctrlTag: HTMLDivElement;

    resizeTrigger: Trigger = new Trigger();

    constructor() {
        super(...arguments);

        let i = this.props.selectedIndex || 0;
        if (!this._isSelectable(this.props.children[i]))
            for (i = 0; i < this.props.children.length; ++i) {
                if (!this._isSelectable(this.props.children[i]))
                    continue;
                break;
            }
        this.state = {selected: i, arrows: true};
        this._showArrowsFunc = () => this._showArrows();

        this.arrows = {left: null, right: null};
        this.tabs = null;
        AppEvent.RESIZE.listen(this, () => this.resizeTrigger.call(() => this._showArrowsFunc(), 100));
        this._mouseUpListener = () => {
            if (this._scrolling) {
                clearTimeout(this._scrolling);
                this._scrolling = null;
            }
        };
        window.addEventListener('mouseup', () => this._mouseUpListener());
    }

    componentWillUnmount() {
        super.componentWillUnmount(...arguments);
        window.removeEventListener('mouseup', () => this._mouseUpListener());
    }

    componentWillReceiveProps(newProps) {
        super.componentWillReceiveProps(...arguments);
        let val = newProps.selectedIndex;
        if (val && val !== this.state.selected) {
            if (val >= this.props.children.length)
                val = this.props.children.length - 1;
            else if (val < 0) val = 0;
            if (this._isSelectable(this.props.children[val]))
                this._handleSelect(null, val, this.props.children[val].props.onSelect);
        }
    }

    /** Obsługa zdarzenia zmiany zakładki
     * @param e - obiekt zdarzenia
     * @param index - indeks wybranej zakładki
     * @param callback - callback wywoływany przed setState
     * @private
     */
    _handleSelect(e: Event, index: number, callback: (e: ?Event, i: number) => void) {
        if (Is.func(callback))
            callback(e, index);

        this.setState({selected: index});
    }

    /** rozpoczyna scrollowanie
     * @param dir kierunek: 1 - prawo, -1 - lewo
     * @param base skok scrolla (px), def=60
     * @private
     */
    _scroll(dir: number, base: number = 60) {
        this._handleArrow(base * dir);
        this._scrolling = setTimeout(() => {
            this._scroll(dir, 30)
        }, 100);
    }

    /** przewija zakładki o określoną ilość pikseli
     * @param val - wielkość przesunięcia zakładek
     * @private
     */
    _handleArrow(val: number) {
        if (this.tabs)
            if (this.props.vertical)
                this.tabs.ScrollTop += val;
            else
                this.tabs.scrollLeft += val;
        this._showArrows();
    }

    /** ustala przesunięcie zakładek, jeśli są przewijane
     * @param tab - zakładka, która powinna być widoczna
     * @private
     */
    _setScroll(tab) {
        if (!tab) return;
        const target = tab;
        const parent = tab.offsetParent;
        if (!parent) return;
        if (target.offsetLeft < (parent.scrollLeft))
            parent.scrollLeft = target.offsetLeft - 10;
        else if ((target.offsetLeft + target.offsetWidth) > (parent.offsetWidth + parent.scrollLeft))
            parent.scrollLeft += 15 + (target.offsetLeft + target.offsetWidth) - (parent.offsetWidth + parent.scrollLeft);
    }

    /** sprawdza czy zawartość zakładki może być wyświetlona
     * @param tab - komponent zakładki
     * @returns {boolean}
     * @private
     */
    _isSelectable(tab) {
        if (!tab) return false;
        return (!tab.props.disabled && !tab.props.hidden);
    }

    /** Określa które strzałki powinny być wyświetlane
     * @private
     */
    _showArrows() {
        if (!this.arrows.left || !this.arrows.right || !this.tabs) return;

        if (this.tabs.scrollWidth > this.tabs.offsetWidth) {
            const sl = Math.round(this.tabs.scrollLeft);
            this.arrows.left.style.display = (sl === 0) ? 'none' : 'flex';
            this.arrows.right.style.display = (sl >= (this.tabs.scrollWidth - this.tabs.offsetWidth)) ? 'none' : 'flex';
        } else {
            this.arrows.left.style.display = 'none';
            this.arrows.right.style.display = 'none';
        }
    }

    controllerVisible(state: boolean) {
        if (!this._ctrlTag || !this._ctrlTag.parentNode) return;
        this._ctrlTag.parentNode.setAttribute("data-hidden", !state);
    }

    render() {


        const children = Utils.asArray(super.renderChildren());

        return (
            <div className={"tabSet " + (this.props.vertical ? "tabSetVertical" : "")}
                 style={{display: 'flex', flexDirection: 'column', flex: "1", overflow: "hidden"}}
                 data-hidden={!Utils.coalesce(this.props.controllerVisible, true)}
            >
                <div ref={e => {
                    this._ctrlTag = e;
                    this._showArrows();
                }}
                     className={"tabsCtrl " + (this.props.vertical ? "tabsVertical" : "")}
                     style={{flex: '0 0 auto'}}
                >
                    <div className="tabArrow"
                         ref={(elem) => this.arrows.left = elem}
                         style={{display: 'none', borderRight: '1px solid'}}
                         onMouseDown={() => this._scroll(-1)}>
                        <span className={(this.props.vertical ? Icon.CHEVRON_UP : Icon.CHEVRON_LEFT)}/></div>
                    <div ref={(elem) => this.tabs = elem}
                         className={"tabs " + (this.props.vertical ? "tabsVertical" : "")}
                         style={{position: 'relative'}}>
                        {Utils.forEach(children, (chld, index) => {
                            if (chld.props.hidden) return null;
                            if (!chld.props.disabled && this.state.selected === index)
                                return <div ref={(elem) => this._setScroll(elem)}
                                            title={chld.props.title}
                                            tabIndex="0"
                                            key={index}
                                            className="tab tab_selected">
                                    {chld.props.label}
                                </div>;
                            return (<div tabIndex={0}
                                         title={chld.props.title}
                                         key={index}
                                         className={"tab " + (chld.props.disabled ? "tab_disabled" : "")}
                                         onFocus={chld.props.disabled ? null : (e) => this._handleSelect(e, index, chld.props.onSelect)}>
                                {chld.props.label}
                            </div>)
                        })}
                    </div>
                    <span style={{
                        borderBottom: '1px solid #999',
                        position: 'relative',
                        flex: 1,
                        alignSelf: 'flex-end'
                    }}/>
                    <div className="tabArrow"
                         ref={(elem) => this.arrows.right = elem}
                         style={{display: 'none', borderLeft: '1px solid'}}
                         onMouseDown={() => this._scroll(1)}>
                        <span className={(this.props.vertical ? Icon.CHEVRON_DOWN : Icon.CHEVRON_RIGHT)}/></div>
                </div>
                <div className="tabContent" style={{display: 'flex', flex: '1', position: 'relative'}}>
                    {this._isSelectable(children[this.state.selected]) ? children[this.state.selected] : null}
                </div>
            </div>
        );
    }
}

/** Klasa zakładki. Przyjmuje tylko jedno dziecko */
export class Tab extends Component {

    static propTypes = {
        label: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
        title: PropTypes.string,
        disabled: PropTypes.bool,
        hidden: PropTypes.bool,
        onSelect: PropTypes.func
    };
    props: {
        label: any,
        title: ?string,
        disabled: boolean,
        hidden: boolean,
        onSelect: ?(e: ?Event, index: number) => void
    };

    render() {
        return super.renderChildren(null, true);
    }
}