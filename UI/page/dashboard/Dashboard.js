'use strict';
import React from 'react';
import Page from "../../core/page/Page";
import Panel from "../../core/component/Panel";
var PropTypes = require('prop-types');
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var _ = require('lodash');
var WidthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";


export default class Dashboard extends Page {

    constructor() {
        super(...arguments);
    }


    draw() {
        // layout is an array of objects, see the demo for more complete usage
        var layout = [
            {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'b', x: 1, y: 0, w: 3, h: 2},
            {i: 'c', x: 4, y: 0, w: 1, h: 2}
        ];

        const style = {border: "1px solid red"};

        return <Panel noPadding fit>
            <ReactGridLayout className="layout" layout={layout} cols={2} rowHeight={80}>
                <div style={style} key={'a'}>Zasoby systemu</div>
                <div style={style} key={'b'}>Alerty</div>
                <div style={style} key={'c'}>Zalogowani użytkownicy</div>
            </ReactGridLayout>
        </Panel>
    }
}
