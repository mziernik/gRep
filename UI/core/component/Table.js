import {React, PropTypes, Utils, If, Check, ReactUtils} from "../core";
import {Component} from "../components";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Field from "../repository/Field";
import FieldComponent from "./form/FieldComponent";
import FormComponent from "./form/FormComponent";

//ToDo filtrowanie
export default class Table extends Component {
    _widths = {};
    _updateWidths = true;
    _sorted = [];

    static propTypes = {
        columns: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        rows: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        rowMapper: PropTypes.func,
        onRowClick: PropTypes.func // zdarzenie kliknięcia na komórkę (row, column, table, event)
    };

    constructor() {
        super(...arguments);
        this.state = {columns: this.columns = this._convertColumns()};
    }

    _handleSort(a, b) {
        a = (a === null || a === undefined) ? -Infinity : a;
        b = (b === null || b === undefined) ? -Infinity : b;
        a = a === 'string' ? a.toLowerCase() : a;
        b = b === 'string' ? b.toLowerCase() : b;
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    }

    /** mapuje kolumny pod format ReactTable
     * @returns {*[]}
     * @private
     */
    _convertColumns(): [] {
        let res = Utils.forEach(this.props.columns, (col, key) => {
            let k = key;
            if (If.isNumber(key) && (col instanceof Field || col.$$typeof))
                k = Check.nonEmptyString(col.key, new Error("Wymagana definicja atrybutu key"));

            let column = {
                id: "" + k,
                accessor: row => {
                    let curr = row[k];
                    if (!curr)return;
                    if (!curr.$$typeof)return curr;
                    return curr.props.field ? curr.props.field.value : null;
                },
                Cell: (row) => this._drawRow(row, k)
            };

            let header = null;
            if (col instanceof Field) {
                header = col.value || col.name;
                column.sortable = col.sortable;
                column.filterable = col.filtered;
                column.show = !col.hidden;
                column.id = col.key;
                column.sortMethod = col.compare;
                if (col.sortOrder)
                    this._sorted = [{id: column.accessor, desc: true}];
            }
            else header = col;
            column.Header = header;

            if (this._updateWidths)
                column.Header = () => this._drawRow(header, k);
            else
                column.width = this._widths[k];

            return column;
        });
        //ostatnia pusta kolumna służąca jako wypełniacz
        res.push({style: {padding: 0}, resizable: false, width: null, sortable: false, filterable: false});

        let i = 0, j = 0;
        for (i = 0; i < res.length; ++i) {
            const key = res[i].id;
            for (j = i + 1; j < res.length; ++j)
                if (res[j].id === key)
                    throw new Error("Zdublowany klucz kolumny (" + JSON.stringify(key) + ")");
        }
        return res;
    }

    /** rysuje komórki i nagłówki kolumn
     * @param value - zawartość komórki
     * @param accessor - identyfikator kolumny
     * @returns {XML}
     * @private
     */
    _drawRow(row, accessor) {
        if (this._updateWidths)
            if (!this._widths[accessor]) this._widths[accessor] = [];
        return <span ref={elem => {
            if (this._updateWidths)
                if (elem) this._widths[accessor].push(elem)
        }}>
            {row.original ?
                (row.original[accessor] !== null && row.original[accessor] !== undefined) ?
                    row.original[accessor] : row.value : row.value}
        </span>
    }


    /** mapuje dane przyp pomocy props.rowMapper
     * @returns {*[]} propsy dla ReactTable
     * @private
     */
    _convertData() {
        const data = Utils.forEach(this.props.rows, (row, rowIdx) => {
            let res = If.isFunction(this.props.rowMapper) ? this.props.rowMapper(row) : row;
            let cellIdx = 0;
            for (let name in res) {
                let item = res[name];
                if (ReactUtils.isReactElement(item))
                    res[name] = React.cloneElement(item, {key: rowIdx + "." + (cellIdx++)}, item.props.children);
            }
            return res;
        });
        return {
            data: data,
            showPagination: data.length > 20,
        };
    }

    /** Oblicza szerokość kolumn  i wymusza ponowne rysowanie
     * @param table
     * @private
     */
    _computeWidths(table) {
        if (!this._updateWidths)return;
        if (!table)return;
        let sum = 0;
        Utils.forEach(this._widths, (value, key) => {
            Utils.forEach(value, (span, index) => {
                if (span instanceof HTMLSpanElement)
                    value[index] = span.children[0] ? span.children[0].offsetWidth :
                        span.scrollWidth > 0 ? span.scrollWidth : span.offsetWidth;
            });
            let header = value[0];
            value.sort((a, b) => a - b);
            let width = value[parseInt((value.length - 1) / 2)];
            if (width < header) width = header;
            this._widths[key] = width < this._table ? (width + 20) : (this._table / 2);

            sum += this._widths[key];
        });
        let step = this._table / sum;
        Utils.forEach(this._widths, (value, key) => {
            this._widths[key] = value * step;
        });
        this._updateWidths = false;
        this.setState({columns: this._convertColumns()});
    }

    render() {
        return <ReactTable
            ref={elem => this._computeWidths(elem)}
            className="-striped -highlight"
            style={{height: '100%'}}
            defaultSorted={this._sorted}
            columns={this.state.columns}
            {...this._convertData()}

            getTdProps={(state, row, column, instance) => {
                return {onClick: If.isFunction(this.props.onRowClick) ? (e) => this.props.onRowClick(row, column, instance, e) : null}
            }}
            getTrGroupProps={(state, row, column, instance) => {
                return row ? null : {style: {visibility: 'hidden'}};
            }}
            getTbodyProps={()=>{return{style:{overflow:'visible'}}}}

            previousText="Poprzednia"
            nextText="Następna"
            loadingText="Wczytywanie..."
            noDataText="Brak rekordów"
            pageText="Strona"
            ofText="z"
            rowsText="rekordów"
        >
            {(state, makeTable, instance) => {
                if (this._updateWidths)
                    return <div ref={elem => {
                        if (elem) this._table = elem.offsetWidth - 20
                    }}>
                        {makeTable()}
                    </div>;
                return makeTable();
            }}

        </ReactTable>;
    }
}

class TestSpan extends FormComponent {
    render() {
        console.log("test ", this.props.field.value);
        return <span>{this.props.field.displayValue}</span>;
    }
}

