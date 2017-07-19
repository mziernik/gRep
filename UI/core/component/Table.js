import {React, ReactDOM, ReactUtils, PropTypes} from "../core";
import {Utils, If, Check, Column, AppEvent, Trigger, CRUDE, Repository, Record, Dev, Field} from "../core";
import {Component, FormComponent, FCtrl} from "../components";
import ReactTable from 'react-table';
import 'react-table/react-table.css';


const resizeTrigger: Trigger = new Trigger();

export default class Table extends Component {
    _widths = {};
    _tableTag = null;
    _prevTableWidth = 0;
    _updateWidths = true;
    _sorted = [];
    /** Flaga ustawiana w momencie zmiany danych w repozytorium */
    _dataChanged: ?Record = null;
    _dataSource: ?Array | ?Object = null;
    _tableProps: Object;
    _repository: ?Repository = null;
    _rowMapper: (row) => any;
    _columns: [] | {};

    static propTypes = {
        // tablica Fieldów lub {idKolumny:nazwaKolumny,...}
        columns: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        // tablica obiektów {idKolumny:wartośćKomórki,...}
        // lub cokolwiek jeśli jest zdefiniowany rowMapper, który przemapuje rekordy
        rows: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),

        repository: PropTypes.instanceOf(Repository),
        // mapper rekordów, (row)=>{idKolumny:wartośćKomórki,...}
        rowMapper: PropTypes.func,
        // zdarzenie kliknięcia na komórkę (row, column, table, event)
        onRowClick: PropTypes.func
    };

    state: {
        //ToDo: Wojtek: Rozpisz pola ...
    };

    constructor() {
        super(...arguments);


        AppEvent.RESIZE.listen(this, (e: Event, source: AppEvent) => resizeTrigger.call(() => {
            this._setWidths();
        }, 100));

        this._dataSource = this.props.rows;
        this._rowMapper = this.props.rowMapper;
        this._columns = this.props.columns;

        this._repository = this.props.repository;

        if (this.props.rows instanceof Repository)
            this._repository = this.props.rows;


        if (this._repository) {
            this._dataSource = this._repository.rows;
            this._repository.onChange.listen(this, (action: CRUDE, rec: Record, changes: Map) => {
                // zdarzenie modyfikacji repozytorium ustawia tylko flagę, metoda render() zostanie wywołana z zewnątrz
                if (action !== CRUDE.UPDATE)  // ignorujemy aktualizacje komórek - obsługiwane będą przez FCtrl
                    this._dataChanged = rec;
            });

            if (!this._columns)
                this._columns = Utils.forEach(this._repository.columns, (c: Column) =>
                    c.disabled ? undefined : c.hidden ? null :
                        <span key={c.key} title={c.name + (c.description ? "\n" + c.description : "")}>{c.name}</span>);
        }

        this.state = {columns: this.columns = this._convertColumns()};
    }

    /** mapuje kolumny pod format ReactTable
     * @returns {*[]}
     * @private
     */
    _convertColumns(): [] {
        let res = Utils.forEach(this._columns, (col, key) => {
            if (!col) return;

            let k = key;
            if (If.isNumber(key) && (col instanceof Column || col.$$typeof))
                k = Check.nonEmptyString(col.key, new Error("Wymagana definicja atrybutu key"));

            let column = {
                id: "" + k,
                accessor: row => {
                    let curr = row[k];
                    if (!curr) return;
                    if (!curr.$$typeof) return curr;
                    return curr.props.field ? curr.props.field : null;
                },
                Cell: (row) => this._drawRow(row, k)
            };

            let header = null;
            if (col instanceof Column) {
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
                    throw new Error("Zdublowany klucz kolumny (" + Utils.escape(key) + ")");
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
        const val = row.original ?
            (row.original[accessor] !== null && row.original[accessor] !== undefined) ?
                row.original[accessor] : row.value : row;
        if (!val) return null;
        if (!this._updateWidths) return val;

        return <span ref={elem => {
            if (this._updateWidths)
                if (elem) this._widths[accessor].push(elem)
        }}>
            {val}
        </span>
    }

    /** konwertuje pojedynczy wiersz
     * @param row wiersz
     * @param rowIdx index, wymagany do utworzenia poprawnego klucza
     * @returns {*} skonwertowany wiersz
     * @private
     */
    _convertRow(_row, rowIdx: number) {
        let row = undefined;
        If.isFunction(this._rowMapper, f => row = this._rowMapper(_row, rowIdx));

        if (row === undefined && this._repository) {
            row = {};
            const rec: Record = this._repository.createRecord(this);
            rec.row = _row;

            const mark = this._dataChanged && this._dataChanged.fullId === rec.fullId;

            rec.fields.forEach((f: Field) =>
                row[f.key] = <FCtrl
                    ref={(e: FCtrl) => mark && e && e._markAsChanged(true)}
                    key={rowIdx + "." + (cellIdx++)}
                    field={f}
                    inline
                />);

            return row;
        }

        if (!row) row = _row;

        let cellIdx = 0;
        for (let name in row) {
            let item = row[name];
            if (ReactUtils.isReactElement(item))
                row[name] = React.cloneElement(item, {key: rowIdx + "." + (cellIdx++)}, item.props.children);
        }
        return row;
    }


    /** Oblicza szerokość kolumn  i wymusza ponowne rysowanie
     * @param table
     * @private
     */
    _computeWidths(table) {
        if (!this._updateWidths) return;
        if (!table) return;
        let tag = ReactDOM.findDOMNode(table);
        this._tableTag = tag;
        const tableWidth = (tag.offsetWidth - 20);
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
            this._widths[key] = width < tableWidth ? (width) : (tableWidth / 2);

            sum += this._widths[key];
        });
        const step = tableWidth / sum;
        const free = (tableWidth - sum) / cols;
        this._visibleCols = cols;
        Utils.forEach(this._widths, (value, key) => {
            if (free > 0)
                this._widths[key] = value + free;
            else
                this._widths[key] = value * step;
        });
        this._updateWidths = false;
        this._setWidths(true);
    }

    _setWidths(first: boolean = false) {
        let colDiff = 0;
        if (!first) {
            if (parseInt(this._tableTag.offsetWidth - this._prevTableWidth) === 0)
                return;
            colDiff = (this._tableTag.offsetWidth - this._prevTableWidth) / (this._visibleCols);
            if (colDiff === 0) return;
        }
        this._prevTableWidth = this._tableTag.offsetWidth;
        let columns = this.state.columns.slice();
        Utils.forEach(columns, (column, index) => {
            if (column.id) {
                if (colDiff !== 0) this._widths[column.id] += colDiff;
                column.width = this._widths[column.id];
            }
        });
        this.setState({columns: columns});
    }

    _swapColumns(sourceID, targetID, targetCol, mouseX) {
        if (sourceID === targetID) return;
        let res = this.state.columns.slice();
        const sourceIdx = res.findIndex((column) => column.id === sourceID);

        let tmp = res.splice(sourceIdx, 1)[0];
        let targetIdx = res.findIndex((column) => column.id === targetID);
        if (targetID) {
            let middle = targetCol.getBoundingClientRect();
            middle = middle.left + (middle.width / 2);
            targetIdx = mouseX > middle ? targetIdx + 1 : targetIdx
        }
        res.splice(targetIdx, 0, tmp);

        this.setState({columns: res});

    }

    render() {

        Dev.log(this, "render");
        if (this._dataChanged || !this._tableProps) {

            const data = Utils.forEach(this._dataSource, (row, rowIdx) => this._convertRow(row, rowIdx));

            this._tableProps = {
                data: data,
                showPagination: data.length > 25,
            };

            this._dataChanged = null;
        }

        return <ReactTable
            ref={elem => this._computeWidths(elem)}
            className="c-table -striped -highlight"
            defaultSorted={this._sorted}
            columns={this.state.columns}
            {...this._tableProps}
            pageSizeOptions={[5, 10, 25, 50]}
            defaultPageSize={25}

            getTbodyProps={() => {
                //wyłączenie flexa w wierszach
                return {style: {display: 'block'}}
            }}
            getTdProps={(state, row, column, instance) => {
                return {
                    onClick: If.isFunction(this.props.onRowClick) ? (e) => this.props.onRowClick(row, column, instance, e) : null
                };
            }}
            getTrGroupProps={(state, row, column, instance) => {
                return row ? null : {style: {display: 'none'}};
            }}

            getTheadThProps={(state, row, column, instance) => {
                return {
                    draggable: true,
                    onDragStart: (e) => {
                        if (!column.id) e.preventDefault();
                        e.stopPropagation();
                        e.DataTransfer = 'dummy';
                        this._drag = column.id;
                    },
                    onDragOver: (e) => {
                        if (!this._drag) return;
                        e.stopPropagation();
                        e.preventDefault();
                    },
                    onDrop: (e) => {
                        if (!this._drag) return false;
                        e.stopPropagation();
                        e.preventDefault();
                        this._swapColumns(this._drag, column.id, e.currentTarget, e.pageX);
                        this._drag = null;
                    }

                };
            }}

            getResizerProps={(state, row, column, instance) => {
                return {
                    draggable: true,
                    onDragStart: (e) => {
                        e.preventDefault();
                    },
                }
            }}

            previousText="Poprzednia"
            nextText="Następna"
            loadingText="Wczytywanie..."
            noDataText="Brak rekordów"
            pageText="Strona"
            ofText="z"
            rowsText="rekordów"
        />;
    }
}