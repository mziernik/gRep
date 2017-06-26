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
                <div style={{height:'500px'}}>
                    <Table columns={COLUMNS}
                           rows={generateData(COLUMNS, 500)}
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

function generateData(columns: [], n: number): [] {
    if (n < 1) return [];
    function generateValue(type: simpleType): ?string | number | boolean {
        const strings = ['Abecadło', 'Długopis', 'Komórka', 'Omega', 'Mikrofalówka',
            'Klawiatura bezprzewodowa', 'Żarówka energiooszczędna', 'Królik doświadczalny',
            'Jakieś bezużyteczne badziewie', '2076,4C', '007', 'Kwiat tlenotwórczy', 'Ósmy pasażer'];
        const booleans = [null, false, true];
        switch (type) {
            case 'string':
                return strings[parseInt(Math.random() * strings.length)];
            case 'number':
                return Math.random() * 10000;
            case 'boolean':
                return booleans[parseInt(Math.random() * booleans.length)];
            default:
                return strings[parseInt(Math.random() * strings.length)];
        }
    }

    let res = [];
    for (let i = 0; i < n; ++i) {
        res.push(Utils.forEach(columns, (column: Field) => {
            return new Field((fc: FieldConfig) => {
                fc.type = column.type;
                fc.key = column.key;
                fc.name = column.name;
                fc.defaultValue = generateValue(fc.type.simpleType);
            })
        }))
    }
    return res;
}

const COLUMNS = [
    new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "name";
        fc.name = "Nazwa";
        fc.sortable = true;
        fc.filterable = true;
        fc.filter = (filter, cell) => cell ? cell.value ? cell.value.contains(filter) : false : false;
    }),
    new Field((fc: FieldConfig) => {
        fc.type = Type.INT;
        fc.key = "value";
        fc.name = "Wartość";
        fc.sortable = true;
        fc.filterable = true;
        fc.filter = (filter, cell) => cell ? ("" + cell.value).contains(filter) : false;
        fc.compare = (a, b) => a - b;
    }),
    new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "hidden";
        fc.name = "The Hidden One";
        fc.sortable = false;
        fc.filterable = false;
        fc.hidden = true;
    }),
    new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "description";
        fc.name = "Opis";
        fc.sortable = false;
        fc.filterable = false;
        fc.filter = (filter, cell) => cell ? cell.value.contains(filter) : false;
    }),
    new Field((fc: FieldConfig) => {
        fc.type = Type.BOOLEAN;
        fc.key = "active";
        fc.name = "Aktywność";
        fc.sortable = true;
    })
];
