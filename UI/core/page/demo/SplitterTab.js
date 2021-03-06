//@Flow
'use strict';
import {React, Field, Type, Utils, Column} from '../../core';
import {Component, FCtrl, Table}from '../../components';
import {Splitter} from '../../component/panel/Splitter.js';
import {SplitPanel} from "../../component/panel/Splitter";
import Resizer from "../../component/panel/Resizer";


export default class SplitterTab extends Component {
    render() {
        return <div style={{display: 'flex', flex: '1 1 auto'}}>
            <Resizer east style={{height: '100%', width: '200px'}}>
                <div style={{width: '100%', height: '100%', background: '#aaa'}}>Resizer</div>
            </Resizer>
            <Splitter style={{flex: '1 1 auto'}}>
                <div style={{width: '100%', height: '100%', background: '#f00'}}>001</div>
                <SplitPanel size="50">
                    <div style={{width: '100%', height: '100%', background: '#f80'}}>002</div>
                </SplitPanel>
                <div style={{width: '100%', height: '100%', background: '#fa0'}}>
                    <Splitter horizontal>
                        <div style={{width: '100%', height: '100%', background: '#0c0'}}>003</div>
                        <div style={{width: '100%', height: '100%', background: '#8c0'}}>004</div>
                        <div style={{width: '100%', height: '100%', background: '#bc0'}}>
                            <Splitter>
                                <div style={{width: '100%', height: '100%', background: '#00f'}}>005</div>
                                <div style={{width: '100%', height: '100%', background: '#a0f'}}>006</div>
                            </Splitter>
                        </div>
                    </Splitter>
                </div>
                <div style={{width: '100%', height: '100%', background: '#fc0'}}>007</div>
                <div style={{width: '100%', height: '100%', background: '#fd0'}}>008</div>
            </Splitter>
            <Resizer west style={{height: '100%', width: '200px'}}>
                <div style={{width: '100%', height: '100%', background: '#ccc'}}>Resizer</div>
            </Resizer>
        </div>;
    }
}
