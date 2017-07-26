import {React, ReactDOM} from "../../core/core.js";
import {Page, Panel, PopupMenu, MenuItem,} from "../../core/components.js";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';

let PropTypes = require('prop-types');
let PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
let _ = require('lodash');
let WidthProvider = require('react-grid-layout').WidthProvider;
let ReactGridLayout = require('react-grid-layout');

ReactGridLayout = WidthProvider(ReactGridLayout);

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const SINUS = [
    {rad: "0", sin: Math.sin(0), cos: Math.cos(0)},
    {rad: "PI/2", sin: Math.sin(Math.PI / 2), cos: Math.cos(Math.PI / 2)},
    {rad: "PI", sin: Math.sin(Math.PI), cos: Math.cos(Math.PI)},
    {rad: "3/2 PI", sin: Math.sin(Math.PI * 3 / 2), cos: Math.cos(Math.PI * 3 / 2)},
    {rad: "2 PI", sin: Math.sin(Math.PI * 2), cos: Math.cos(Math.PI * 2)},
];

const CONTENT_STYLE = {
    float: 'top',
    minHeight: '98%',
    width: '97%',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '10%',
};

const HEADER_STYLE = {
    float: 'left',
    display: 'inline',
    minWidth: '90%',
    minHeight: '0.8em',
    textAlign: 'center',
    padding: '2%',
    fontSize: '80%'
};

const EXIT_STYLE = {
    float: 'left',
    display: 'inline',
    width: '5%',
    minHeight: '0.8em',
    padding: '2%',
    paddingRight: '5%',
    fontSize: '80%'
};

const ICON_STYLE = {
    position: 'absolute',
    right: '45%',
    bottom: '20%',
    transition: 'all 0.1s ease',
};

const containerStyle = {};

export default class Dashboard extends Page {
    constructor() {
        super(...arguments);
        this.keyIterator = 3;
        this.state = {};
        this.layout = [
            {i: "0", x: 4, y: 0, w: 1, h: 2},
            {i: "1", x: 4, y: 0, w: 1, h: 2},
            {i: "2", x: 4, y: 0, w: 1, h: 2},
            {i: "3", x: 4, y: 0, w: 1, h: 2},

        ];
        this.defaultItems = [
            {
                x: 4,
                y: 0,
                w: 1,
                h: 2,
                maxW: 1,
                maxH: 2,
                title: "Wiadomości",
                content: <p style={ {transition: 'font 0.2s ease'} }>Nieprzeczytanych: 64<br/> Wątków: 256</p>,
                after: <div className="c-dashboard-content-after"><i style={ICON_STYLE} className="fa fa-envelope"/></div>
            },
            {
                x: 4,
                y: 0,
                w: 1,
                h: 2,
                maxW: 1,
                maxH: 2,
                title: "Wykres",
                content: <ResponsiveContainer width={400} height={200}>
                    <LineChart data={SINUS}
                               margin={{top: 10, right: 30, left: 20, bottom: 5}}>
                        <XAxis dataKey="rad"/>
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip />
                        <Legend verticalAlign="bottom"/>
                        <Line type="monotone" dataKey="sin" stroke="#8884d8"/>
                        <Line type="monotone" dataKey="cos" stroke="#82ca9d"/>
                    </LineChart>
                </ResponsiveContainer>,
                after: ""
            },

            {
                x: 4,
                y: 0,
                w: 1,
                h: 2,
                maxW: 1,
                maxH: 2,
                title: "Powiadomienia",
                content: <p style={ {transition: 'font 0.2s ease'} }>Wszystkich: 256</p>,
                after: <div className="c-dashboard-content-after"><i style={ICON_STYLE} className="fa fa-bell"/></div>
            },
            {
                x: 4,
                y: 0,
                w: 1,
                h: 2,
                maxW: 1,
                maxH: 3,
                title: "Dodaj blok",
                content: <i className="fa fa-plus-circle"
                            onContextMenu={(e) => PopupMenu.openMenu(e, this.addMenuItems)}
                            style={ {fontSize: '600%', ...ICON_STYLE} }/>,
                after: ""
            }
        ];
        this.state.currentItems = this.getDefaultItems();
        this.gridLayout = null;
        this.addMenuItems = [
            MenuItem.createItem((item: MenuItem) => {
                item.name = "Wiadomości";
                item.onClick = () => this.addItem(this.createItem(++this.keyIterator, this.defaultItems[0]));
                item.closeOnClick = true;
            }),
            MenuItem.createItem((item: MenuItem) => {
                item.name = "Powiadomienia";
                item.onClick = () => this.addItem(this.createItem(++this.keyIterator, this.defaultItems[2]));
                item.closeOnClick = true;
            }),
            MenuItem.createItem((item: MenuItem) => {
                item.name = "Wykres";
                item.onClick = () => this.addItem(this.createItem(++this.keyIterator, this.defaultItems[1]));
                item.closeOnClick = true;
            }),
        ];

    }

    createItem(key, object) {
        return (
            <div style={containerStyle} key={key.toString()}>
                <div className="c-dashboard-header" style={HEADER_STYLE}>{object.title.toString()}</div>
                <div className="c-dashboard-exit-btn" style={EXIT_STYLE}
                     onClick={() => this.removeItem(key.toString())}>
                    X
                </div>
                <div className="c-dashboard-content" style={CONTENT_STYLE}>
                    {object.content}
                </div>
                {object.after}
            </div>)
    }

    onResize(layout, oldLayoutItem, layoutItem, placeholder, e)
    {
        let index = layout.indexOf(layoutItem);

        let block  = ReactDOM.findDOMNode(this.gridLayout).children[index];

        //skalowanie tekstu
        if (block.children[2] !== null)
        //FixMe Formatowanie kodu w stylu javascript (nie C#) jak obecnie
        {
            let element = block.children[2];

            if (layoutItem.w * layoutItem.h * 10 < 100) {
                element.style.fontSize = `100%`;
                return;
            }
            else if (layoutItem.w * layoutItem.h * 10 > 300) return;

            element.style.fontSize = `${layoutItem.w * layoutItem.h * 10}%`;
        }
        //skalowanie ikon
        if (block.children[3] !== null) {
            let element = block.children[3];
            if (layoutItem.w === 1) {
                element.style.right = '45%';
            }
            else if (layoutItem.w === 2) {
                element.style.right = '47%';
            }
            else if (layoutItem.w === 3) {
                element.style.right = '50%';
            }

        }
    }

    //FixMe: Używaj typów FLOW
    addItem(item) {
        //FixMe: Używaj const-a zamianst let-a
        let arr = this.state.currentItems.slice();
        arr.push(item);
        this.setState({currentItems: arr});
    }

    removeItem(key) {
        let arr = this.state.currentItems.slice();
        let item = null;
        //FixMe Używaj foreach-a
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].key === key)
                item = arr[i];
        }
        if (item === null) return;
        arr.remove(item);
        this.setState({currentItems: arr});
    }

    getDefaultItems() {
        let items = [];

        //FixMe Używaj foreach-a
        for (let i = 0; i < this.defaultItems.length; i++) {
            // this.layout.push({i:i.toString(), x:defaultItems[i].x, y:defaultItems[i].y, w:defaultItems[i].w, h:defaultItems[i].h});
            items.push(this.createItem(i, this.defaultItems[i]));
        }
        return items;
    }

    render() {
        //FixMe: Formatowanie kodu - zbyt długa linia
        return (
            <Panel noPadding fit>
                <ReactGridLayout ref={(layout) => this.gridLayout = layout} className="layout"
                                 onResize={(...args) => this.onResize(...args)} layout={this.layout} cols={3}
                                 rowHeight={120}>
                    {this.state.currentItems}
                </ReactGridLayout>
            </Panel>
        )
    }
}
