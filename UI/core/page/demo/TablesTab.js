//@Flow
'use strict';
import {React, Field, Type, Utils, Column, CustomFilter} from '../../core';
import {Component, FCtrl, Table} from '../../components';

export default class TablesTab extends Component {

    constructor() {
        super(...arguments);
    };

    render() {
        return (
            <div style={{width: '100%'}}>
                <Table columns={COLUMNS}
                       showRowNum
                       selectable
                       rows={generateData(COLUMNS, 50)}
                       rowMapper={(row) => {
                           let res = {};
                           Utils.forEach(row, (cell) => {
                               res[cell.key] = <FCtrl field={cell} value preview/>
                           });
                           return res;
                       }}
                />
            </div>);
    }
}

function generateData(columns: [], n: number): [] {
    if (n < 1) return [];

    function generateValue(type: simpleType): ?string | number | boolean {
        const strings = ['Abecadło', 'Długopis', 'Komórka', 'Omega', 'Mikrofalówka',
            'Klawiatura bezprzewodowa', 'Żarówka energiooszczędna', 'Królik doświadczalny',
            'Jakieś bezużyteczne badziewie', '2076,4C', '007', 'Kwiat tlenotwórczy', 'Ósmy pasażer',
            'Pompa próżniowa', 'Rower stacjonarny', 'Zęby dziadka', '1', '2', '10', '20', null];
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
        res.push(Utils.forEach(columns, (column) => {
            if (!(column instanceof Column)) return;
            return new Field((fc: Column) => {
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
    new Column((fc: Column) => {
        fc.type = Type.STRING;
        fc.key = "name";
        fc.name = "Nazwa";
        fc.sortable = true;
        fc.filterable = true;
        fc.compare = (a, b) => CustomFilter.defaultCompareFn('string')(a, b);
        fc.filter = (filter, cell) => cell ? cell.contains(filter) : false;
    }),
    new Column((fc: Column) => {
        fc.type = Type.INT;
        fc.key = "value";
        fc.name = "Wartość";
        fc.sortable = true;
        fc.filterable = true;
        fc.filter = (filter, cell) => cell ? ("" + cell).contains(filter) : false;
        fc.compare = (a, b) => a - b;
    }),
    new Column((fc: Column) => {
        fc.type = Type.STRING;
        fc.key = "hidden";
        fc.name = "The Hidden One";
        fc.sortable = false;
        fc.filterable = false;
        fc.hidden = true;
    }),
    new Column((fc: Column) => {
        fc.type = Type.STRING;
        fc.key = "description";
        fc.name = "Opis";
        fc.sortable = false;
        fc.filterable = false;
        fc.filter = (filter, cell) => cell ? cell.contains(filter) : false;
    }),
    new Column((fc: Column) => {
        fc.type = Type.BOOLEAN;
        fc.key = "active";
        fc.name = "Aktywność";
        fc.sortable = true;
        fc.filterable = true;
    })
];
