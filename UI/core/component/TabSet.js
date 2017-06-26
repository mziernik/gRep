import {React, PropTypes, Utils, If} from '../core';
import {Component, FontAwesome} from '../components';
import './TabSet.css';

/** Klasa do obsługi zakładek */
export class TabSet extends Component {
    props: {
        vertical: boolean,
        selectedIndex: number
    };

    static PropTypes = {
        vertical: PropTypes.bool,
        selectedIndex: PropTypes.number
    };

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

    componentDidMount() {
        window.addEventListener('resize', this._showArrowsFunc);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        window.removeEventListener('resize', this._showArrowsFunc);
    }

    /** Obsługa zdarzenia zmiany zakładki
     * @param e - obiekt zdarzenia
     * @param index - indeks wybranej zakładki
     * @param callback - callback wywoływany przed setState
     * @private
     */
    _handleSelect(e: Event, index: number, callback: (e: ?Event, i: number) => void) {
        if (If.isFunction(callback))
            callback(e, index);

        this.setState({selected: index});
    }

    /** przewija zakładki o określoną ilość pikseli
     * @param val - wielkość przesunięcia zakłądek
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
        if (!tab)return;
        const target = tab;
        const parent = tab.offsetParent;
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
        if (!tab)return false;
        return (!tab.props.disabled && !tab.props.hidden);
    }

    /** Określa które strzałki powinyny być wyświetlane
     * @private
     */
    _showArrows() {
        if (!this.arrows.left || !this.arrows.right || !this.tabs)return;

        if (this.tabs.scrollWidth > this.tabs.offsetWidth) {
            this.arrows.left.style.display = (this.tabs.scrollLeft === 0) ? 'none' : null;
            this.arrows.right.style.display = (this.tabs.scrollLeft >= (this.tabs.scrollWidth - this.tabs.offsetWidth)) ? 'none' : null;
        } else {
            this.arrows.left.style.display = 'none';
            this.arrows.right.style.display = 'none';
        }
    }

    render() {
        return (
            <span className={"tabSet " + (this.props.vertical ? "tabSetVertical" : "")}
                  style={{flex: "auto", overflow: "hidden"}}
            >
                <div ref={() => this._showArrows()}
                     className={"tabsCtrl " + (this.props.vertical ? "tabsVertical" : "")}>
                    <span ref={(elem) => this.arrows.left = elem}
                          className={(this.props.vertical ? FontAwesome.CHEVRON_UP : FontAwesome.CHEVRON_LEFT) + ' tabArrow'}
                          style={{display: 'none'}}
                          onClick={() => this._handleArrow(-100)}/>
                    <span ref={(elem) => this.tabs = elem}
                          className={"tabs " + (this.props.vertical ? "tabsVertical" : "")}
                          style={{position: 'relative'}}>
                        {Utils.forEach(this.props.children, (child, index) => {
                            if (child.props.hidden)return null;
                            if (!child.props.disabled && this.state.selected === index)
                                return <span ref={(elem) => this._setScroll(elem)}
                                             title={child.props.title}
                                             tabIndex="0"
                                             key={index}
                                             className="tab tab_selected">
                                        {child.props.label}
                                    </span>;
                            return (<span tabIndex="0"
                                          title={child.props.title}
                                          key={index}
                                          className={"tab " + (child.props.disabled ? "tab_disabled" : "")}
                                          onFocus={child.props.disabled ? null : (e) => this._handleSelect(e, index, child.props.onSelect)}>
                                    {child.props.label}
                                    </span>)
                        })}
                    </span>
                    <span style={{
                        borderBottom: '1px solid black',
                        position: 'relative',
                        flex: 1,
                        alignSelf: 'flex-end'
                    }}/>
                    <span ref={(elem) => this.arrows.right = elem}
                          className={(this.props.vertical ? FontAwesome.CHEVRON_DOWN : FontAwesome.CHEVRON_RIGHT) + ' tabArrow'}
                          style={{display: 'none'}}
                          onClick={() => this._handleArrow(100)}/>
                </div>
                <div className="tabContent">
                    {this._isSelectable(this.props.children[this.state.selected]) ? this.props.children[this.state.selected] : null}
                </div>
            </span>
        );
    }
}

/** Klasa zakładki. Przyjmuje tylko jedno dziecko */
export class Tab extends Component {
    props: {
        label: Object,
        title: ?string,
        disabled: boolean,
        hidden: boolean,
        onSelect: ?(e: ?Event, index: number) => void
    };

    static PropTypes = {
        label: PropTypes.object,
        title: PropTypes.string,
        disabled: PropTypes.bool,
        hidden: PropTypes.bool,
        onSelect: PropTypes.func
    };


    render() {
        return React.Children.only(this.props.children);
    }
}