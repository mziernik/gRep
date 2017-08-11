import {React, PropTypes, ReactDOM, Record, Repository, Field, Utils, Is, CRUDE, Endpoint, AppStatus} from '../../../core/core.js';
import {AbstractWidget, HEADER_STYLE, GRID_CONTAINER, EXIT_STYLE, CONTENT_STYLE} from "./AbstractWidget.js";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';

export default class ChartWidget extends AbstractWidget {

    constructor() {
        super(...arguments);
    }

    render() {
        return (
            <div className={this.props.className} style={this.props.style} data-grid={{}} data-index="" onMouseDown={this.props.onMouseDown}
                 onMouseUp={this.props.onMouseUp} onTouchEnd={this.props.onTouchEnd} onTouchStart={this.props.onTouchStart}>    <div className="c-dashboard-header" style={HEADER_STYLE}>Wykres</div>
                <div data-index={this.props.index} className = "c-dashboard-exit-btn" style = {EXIT_STYLE}
                    onClick = {() => this.props.exitHandler()}><i className="fa fa-times"/></div>
                <div className = "c-dashboard-content" style = {CONTENT_STYLE}>
                    <ResponsiveContainer >
                        <LineChart data={SINUS}
                                   margin={{top: 10, right: 30, left: 20, bottom: 5}}>
                            <XAxis dataKey="rad"/>
                            <YAxis/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Tooltip/>
                            <Legend verticalAlign="bottom"/>
                            <Line type="monotone" dataKey="sin" stroke="#8884d8"/>
                            <Line type="monotone" dataKey="cos" stroke="#82ca9d"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }
}

const SINUS = [
    {rad: "0", sin: Math.sin(0), cos: Math.cos(0)},
    {rad: "PI/2", sin: Math.sin(Math.PI / 2), cos: Math.cos(Math.PI / 2)},
    {rad: "PI", sin: Math.sin(Math.PI), cos: Math.cos(Math.PI)},
    {rad: "3/2 PI", sin: Math.sin(Math.PI * 3 / 2), cos: Math.cos(Math.PI * 3 / 2)},
    {rad: "2 PI", sin: Math.sin(Math.PI * 2), cos: Math.cos(Math.PI * 2)},
];