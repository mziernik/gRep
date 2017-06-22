//@Flow
'use strict';
import {React, Field, Type, FieldConfig, Utils} from '../../core';
import {Component, Page, FontAwesome, FieldComponent, FieldController, Table}from '../../components';
import JsonViewer from "../../component/JsonViewer";

export default class TablesTab extends Component {

    constructor() {
        super(...arguments);
    };

    render() {
        return (
            <div>
                <div>
                    <Table columns={{name:"Nazwa", value:"Wartość"}} rows={
                        [
                            {name:"ABC",value:"abc"},
                            {name:"abc",value:"ABC"},
                            {name:"DEF",value:"def"},
                            {name:"def",value:"DEF"},
                            {name:"ĄĆĘ",value:"ąćę"},
                            {name:"ąćę",value:"ĄĆĘ"}
                        ]}/>
                </div>
            </div>);
    }
}
