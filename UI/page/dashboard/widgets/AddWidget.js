import {
    React,
    PropTypes,
    ReactDOM,
    Record,
    Repository,
    Field,
    Utils,
    Is,
    CRUDE,
    Endpoint,
    AppStatus
} from '../../../core/core.js';
import {AbstractWidget, ICON_STYLE, HEADER_STYLE, EXIT_STYLE, CONTENT_STYLE} from "./AbstractWidget.js";
import {PopupMenu, MenuItem} from "../../../core/components.js";
import MessagesWidget from "./MessagesWidget";
import NotificationsWidget from "./NotificationsWidget";

export default class AddWidget extends AbstractWidget {

    //FixMe używaj static propTypes = {

    constructor() {
        super(...arguments);


        //FixMe: zmienna powinna być prywatna
        this.keyIterator = 2;

        this.addMenuItems = [
            MenuItem.createItem((item: MenuItem) => {
                item.name = "Wiadomości";
                item.onClick = () => this.props.addHandler(<MessagesWidget key={++this.keyIterator}
                                                                           index={this.keyIterator} className=""
                                                                           style={{}}
                                                                           data-grid={{x: 0, y: 0, w: 1, h: 1}}
                                                                           exitHandler={(e) => this.props.exitHandler(e)}/>);
                item.closeOnClick = true;
            }),
            MenuItem.createItem((item: MenuItem) => {
                item.name = "Powiadomienia";
                item.onClick = () => this.props.addHandler(<NotificationsWidget key={++this.keyIterator}
                                                                                index={this.keyIterator} className=""
                                                                                style={{}}
                                                                                data-grid={{x: 0, y: 0, w: 1, h: 1}}
                                                                                exitHandler={(e) => this.props.exitHandler(e)}/>);
                item.closeOnClick = true;
            })
        ];
    }

    //FixMe: elementy wspólne metody render do AbstractWidget
    render() {
        return (
            <div className={this.props.className} style={this.props.style} data-grid={{}} data-index="" onMouseDown={this.props.onMouseDown}
                 onMouseUp={this.props.onMouseUp} onTouchEnd={this.props.onTouchEnd} onTouchStart={this.props.onTouchStart}>
                <div className="c-dashboard-header" style={HEADER_STYLE}>Dodaj blok</div>
                <div className="c-dashboard-content" style={CONTENT_STYLE}>
                    <i className="fa fa-plus-circle"
                       onContextMenu={(e) => PopupMenu.openMenu(e, this.addMenuItems)}
                       style={{fontSize: '600%', ...ICON_STYLE}}/>
                </div>
            </div>
        )
    }
}