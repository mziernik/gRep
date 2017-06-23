//@Flow
'use strict';
import {React, Field, Type, FieldConfig, Utils} from '../../core';
import {Component, Page, FontAwesome, FieldComponent, FieldController, Table}from '../../components';

export default class TablesTab extends Component {

    constructor() {
        super(...arguments);
    };

    render() {
        return (
            <div>
                <div>
                    <Table columns={COLUMNS}
                           rows={DATA}
                           rowMapper={(row) => {
                               let res = {};
                               Utils.forEach(row, (cell) => {
                                   res[cell.key] = <FieldComponent preview={true} fieldCtrl={false} field={cell}/>
                               });
                               return res;
                           }}
                    />
                </div>
            </div>);
    }
}

const COLUMNS = [
    new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "name";
        fc.name = "Nazwa";
        fc.sortable = true;
        fc.filterable = true;
        fc.sortOrder = true;
        fc.filter = (filter, cell) => cell ? cell.value.contains(filter) : false;
    }),
    new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "value";
        fc.name = "Wartość";
        fc.sortable = true;
        fc.filterable = true;
        fc.filter = (filter, cell) => cell ? cell.value.contains(filter) : false;
    }),
    new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "description";
        fc.name = "Opis";
        fc.sortable = false;
        fc.filterable = false;
        fc.filter = (filter, cell) => cell ? cell.value.contains(filter) : false;
    })
];

const DATA = [
    [
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "name";
            fc.name = "Nazwa";
            fc.defaultValue = "Pierwszy rekord"
        }),
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "value";
            fc.name = "Wartość";
            fc.defaultValue = "Pierwsza wartość"
        }),
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "description";
            fc.name = "Opis";
            fc.defaultValue = "Pierwszy opis"
        })
    ],
    [
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "name";
            fc.name = "Nazwa";
            fc.defaultValue = "Kolejny rekord"
        }),
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "value";
            fc.name = "Wartość";
            fc.defaultValue = "Kolejna wartość"
        }),
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "description";
            fc.name = "Opis";
        })
    ],
    [
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "name";
            fc.name = "Nazwa";
            fc.defaultValue = "Trzeci rekord"
        }),
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "value";
            fc.name = "Wartość";
            fc.defaultValue = "Trzecia wartość"
        }),
        new Field((fc: FieldConfig) => {
            fc.type = Type.STRING;
            fc.key = "description";
            fc.name = "Opis";
            fc.defaultValue = "Trzeci opis"
        })
    ]
];
