//@Flow
'use strict';
import {React, Field, Type, Utils, Column} from '../../core';
import {Component, FCtrl, Table}from '../../components';
import {Splitter} from '../../component/Splitter.js';
import {SplitPanel} from "../../component/Splitter";

export default class SplitterTab extends Component {
    render() {
        return <Splitter style={{flex: '1 1 auto'}}>
            <div style={{width: '100%', height: '100%', background: '#f00'}}>001</div>
            <SplitPanel size={'50px'}>
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
        </Splitter>;
    }
}
