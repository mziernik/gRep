import {React, PropTypes, Utils, If, Check, ReactUtils, Trigger} from "../core";
import {Component} from "../components";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Field from "../repository/Field";
import FieldComponent from "./form/FieldComponent";
import FormComponent from "./form/FormComponent";

export default class Table extends Component {
    _widths = {};
    _updateWidths = true;
    _sorted = [];
    _resizeTrigger: Trigger = new Trigger();
    _element: HTMLElement;

    static propTypes = {
        // tablica Fieldów lub {idKolumny:nazwaKolumny,...}
        columns: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        // tablica obiektów {idKolumny:wartośćKomórki,...}
        // lub cokolwiek jeśli jest zdefiniowany rowMapper, który przemapuje rekordy
        rows: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        // mapper rekordów, (row)=>{idKolumny:wartośćKomórki,...}
        rowMapper: PropTypes.func,
        // zdarzenie kliknięcia na komórkę (row, column, table, event)
        onRowClick: PropTypes.func
    };


    constructor() {
        super(...arguments);
        this.state = {columns: this.columns = this._convertColumns()};

        this.addEventListener("resize", () => this._resizeTrigger.call(() => {
                //ToDo: Wojtek: Dopasowanie szerokości kolumn podczas zmiany rozmiaru okna
                console.log("Zmiana rozmiaru okna");

                //
                // this._computeWidths()
                // this.forceUpdate();
            }, 300)
        );
    }


    /** mapuje kolumny pod format ReactTable
     * @returns {*[]}
     * @private
     */
    _convertColumns(): [] {
        let res = Utils.forEach(this.props.columns, (col, key) => {
            if (!col) return;

            let k = key;
            if (If.isNumber(key) && (col instanceof Field || col.$$typeof))
                k = Check.nonEmptyString(col.key, new Error("Wymagana definicja atrybutu key"));

            let column = {
                id: "" + k,
                accessor: row => {
                    let curr = row[k];
                    if (!curr)return;
                    if (!curr.$$typeof)return curr;
                    return curr.props.field ? curr.props.field : null;
                },
                Cell: (row) => this._drawRow(row, k)
            };

            let header = null;
            if (col instanceof Field) {
                header = col.value || col.name;
                column.sortable = col.sortable;
                column.filterable = col.filterable;
                column.show = !col.hidden;
                column.id = col.key;
                column.sortMethod = col.compare;
                column.filterMethod = col.filter ? (filter, row) => col.filter(filter.value, row[filter.pivotId || filter.id]) : null;
                if (col.sortOrder)
                    this._sorted = [{id: column.id, desc: false}];
            }
            else header = col;

            if (this._updateWidths)
                column.Header = () => this._drawRow(header, k);
            else {
                column.width = this._widths[k];
                column.Header = header;
            }

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
     * @param row - zawartość komórki
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
                    row.original[accessor] : row.value : row}
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
        let cols = 0;
        Utils.forEach(this._widths, (value, key) => {
            ++cols;
            Utils.forEach(value, (span, index) => {
                if (span instanceof HTMLSpanElement)
                    value[index] = span.children[0] ? span.children[0].offsetWidth :
                        span.scrollWidth > 0 ? span.scrollWidth : span.offsetWidth;
            });
            let header = value[0];
            value.sort((a, b) => a - b);
            let idx = value.findIndex((item) => item > 0);
            if (idx < 0) idx = 0;
            idx += parseInt((value.length - idx) / 2);

            let width = idx === (value.length - 1) ? 20 : value[idx] < header ? (header + value[idx]) / 2 : value[idx];
            this._widths[key] = width < this._table ? (width) : (this._table / 2);

            sum += this._widths[key];
        });
        const step = this._table / sum;
        const free = (this._table - sum) / cols;
        Utils.forEach(this._widths, (value, key) => {
            if (free > 0)
                this._widths[key] = value + free;
            else
                this._widths[key] = value * step;
        });
        this._updateWidths = false;
        this.setState({columns: this._convertColumns()});
    }

    render() {
        return <ReactTable
            ref={elem => this._element = this._computeWidths(elem)}
            className="-striped -highlight"
            style={{height: '100%'}}
            defaultSorted={this._sorted}
            columns={this.state.columns}
            {...this._convertData()}

            getTbodyProps={() => {
                //wyłączenie flexa w wierszach
                return {style: {display: 'block'}}
            }}
            getTdProps={(state, row, column, instance) => {
                return {onClick: If.isFunction(this.props.onRowClick) ? (e) => this.props.onRowClick(row, column, instance, e) : null};
            }}
            getTrGroupProps={(state, row, column, instance) => {
                return row ? null : {style: {display: 'none'}};
            }}

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

