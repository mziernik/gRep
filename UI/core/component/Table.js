import {React, ReactDOM, ReactUtils, PropTypes, CustomFilter} from "../core";
import {Utils, Is, Check, Column, AppEvent, Trigger, Record, Dev, Field} from "../core";
import {Component, PopupMenu, MenuItem, Icon, ModalWindow, MW_BUTTONS} from "../components";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import classnames from "classnames";
import FilterEditor from "./FilterEditor";

const resizeTrigger: Trigger = new Trigger();

export default class Table extends Component {

    _widths = {};
    _tableTag = null;
    _table: ReactTable = null;
    _prevTableWidth = 0;
    _updateWidths = true;
    _sorted = [];
    _filterable = false;
    _filtered = [];
    _selectable = false;
    _selected = [];
    _selecting = false;
    /** Flaga ustawiana w momencie zmiany danych w repozytorium */
    _dataChanged: ?Record = null;
    _dataSource: ?Array | ?Object = null;
    _tableProps: Object;
    _rowMapper: (row) => any;
    _columns: [] | {};
    _onRowClick: (row, column, instance, e) => void;
    _showRowNum: boolean;
    _className: string[] = ["c-table", "-striped", "-highlight"];

    static propTypes = {
        // tablica Fieldów lub {idKolumny:nazwaKolumny,...}
        columns: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        // tablica obiektów {idKolumny:wartośćKomórki,...}
        // lub cokolwiek jeśli jest zdefiniowany rowMapper, który przemapuje rekordy
        rows: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        // czy ma być wstawiona kolumna na numery wierszy
        showRowNum: PropTypes.bool,
        // mapper rekordów, (row)=>{idKolumny:wartośćKomórki,...}
        rowMapper: PropTypes.func,
        // zdarzenie kliknięcia na komórkę (row, column, table, event)
        onRowClick: PropTypes.func,
        // czy tabela może filtrować dane
        filterable: PropTypes.bool,
        selectable: PropTypes.bool
    };

    state: {
        columns: [] // kolumny ;)
    };

    constructor() {
        super(...arguments);


        AppEvent.RESIZE.listen(this, () => resizeTrigger.call(() => this._setWidths(), 100));

        this._dataSource = this.props.rows;
        this._rowMapper = this.props.rowMapper;
        this._columns = null;
        this._onRowClick = this.props.onRowClick;
        this._showRowNum = this.props.showRowNum;
        this._filterable = this.props.filterable === undefined ? true : this.props.filterable;
        this._selectable = this.props.selectable === undefined ? false : this.props.selectable;
        if (!this._showRowNum && this._selectable) this._selecting = true;
    }

    /** mapuje kolumny pod format ReactTable
     * @returns {*[]}
     * @private
     */
    _convertColumns(source): [] {
        let filterable = false;
        let res = Utils.forEach(source, (col, key) => {
            if (!col) return;

            let k = key;
            if (Is.number(key) && (col instanceof Column || col.$$typeof))
                k = Check.nonEmptyString(col.key, new Error("Wymagana definicja atrybutu key"));

            let column = {
                id: "" + k,
                accessor: row => {
                    let curr = row[k];
                    if (!curr) return;
                    if (!curr.$$typeof) return curr;
                    return curr.props.field ? curr.props.field : null;
                },
                Cell: (row) => this._drawCell(row, k)
            };

            if (col instanceof Column) {
                column.name = col.name;
                column.description = col.name + (col.description ? ('\n' + col.description) : '');
                column.sortable = col.sortable;
                column.filterable = col.filterable;
                column.show = !col.hidden;
                column.id = col.key;
                column.sortMethod = col.compare;
                column.filterMethod = (filter: {}, row) => this._filterColumn(filter, row[filter.pivotId || filter.id], col.filter, col.compare);
                if (col.sortOrder)
                    this._sorted = [{id: column.id, desc: false}];
            }
            else {
                column.name = col;
                column.description = col;
                column.show = true;
                column.filterable = this._filterable;
                column.filterMethod = (filter, row) => this._filterColumn(filter, row[filter.pivotId || filter.id], null, null);
            }
            if (column.sortable === undefined) column.sortable = true;

            column.Header = () => this._drawHeader(column);
            if (!this._updateWidths)
                column.with = this._widths[k];

            if (column.filterable) filterable = true;
            return column;
        });
        this._filterable = filterable;
        //ostatnia pusta kolumna służąca jako wypełniacz i filtr
        res.push({
            style: {padding: 0},
            resizable: false,
            width: null,
            sortable: false,
            filterable: this._filterable,
            filterAll: true,
            filterMethod: (filter, rows) => this.globalFilterMethod(filter, rows)
        });

        if (this._showRowNum || this._selectable)
            res.unshift({
                style: {padding: 0},
                id: '__number',
                name: '#',
                resizable: false,
                width: 40,
                sortable: false,
                filterable: false,
                Cell: (row) => this._drawCell(row, '__number', true),
                Header: '#'
            });

        let i = 0, j = 0;
        for (i = 0; i < res.length; ++i) {
            const key = res[i].id;
            for (j = i + 1; j < res.length; ++j)
                if (res[j].id === key)
                    throw new Error("Zdublowany klucz kolumny (" + Utils.escape(key) + ")");
        }
        return res;
    }

    /** rysuje nagłówek kolumny
     * @param column kolumna
     * @returns {*}
     * @private
     */
    _drawHeader(column) {
        if (this._updateWidths)
            if (!this._widths[column.id]) this._widths[column.id] = [];
        let filtered = false;
        for (let i = 0; i < this._filtered.length; ++i)
            if (this._filtered[i].id === column.id) {
                filtered = true;
                break;
            }

        return <div ref={elem => {
            if (this._updateWidths)
                if (elem) this._widths[column.id].push(elem)
        }}
                    title={column.description}>
            {column.name}
            {filtered ? <span className={Icon.FILTER} style={{margin: '0 10px'}}
                              title="Usuń filtr"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  this.setFilter(column.id, null);
                              }}/> : null}
        </div>;
    }

    /** rysuje komórki kolumn
     * @param row - zawartość komórki
     * @param accessor - identyfikator kolumny
     * @param number - czy ma wyświetlać numer wiersza
     * @returns {XML}
     * @private
     */
    _drawCell(row, accessor, number = false) {
        let start = 1;
        if (this._table)
            start = (this._table.state.page * this._table.state.pageSize) + 1;
        if (this._updateWidths)
            if (!this._widths[accessor]) this._widths[accessor] = [];
        const val = number ? (row.viewIndex + start) + "." : row.original ?
            (row.original[accessor] !== null && row.original[accessor] !== undefined) ?
                row.original[accessor] : row.value : row;
        if (!val) return null;


        if (!this._updateWidths && number)
            return <div
                className={number ? "c-table-number" : null}>{this._selecting ?
                <input type='checkbox'
                       checked={!!this._isSelected(row.index)}
                       onClick={(e) => e.stopPropagation()}
                       onChange={(e) => this._select(row.index, row.row, e.currentTarget.checked)}/> : val}</div>;
        if (!this._updateWidths) return val;

        return <span ref={elem => {
            if (this._updateWidths)
                if (elem) this._widths[accessor].push(elem)
        }}>
            {val}
        </span>
    }

    /** konwertuje pojedynczy wiersz
     * @param _row wiersz
     * @param rowIdx index, wymagany do utworzenia poprawnego klucza
     * @returns {*} skonwertowany wiersz
     * @private
     */
    _convertRow(_row, rowIdx: number) {
        let row = undefined;
        Is.func(this._rowMapper, f => row = this._rowMapper(_row, rowIdx));

        if (!row) row = _row;

        let cellIdx = 0;
        Utils.forEach(row, (item, key) => {
            if (ReactUtils.isReactElement(item))
                row[key] = React.cloneElement(item, {key: rowIdx + "." + (cellIdx++)}, item.props.children);
        });
        return row;
    }


    /** Oblicza szerokość kolumn  i wymusza ponowne rysowanie
     * @param table
     * @private
     */
    _computeWidths(table) {
        if (!this._updateWidths) return;
        if (!table) return;
        this._table = table;
        let tag = ReactDOM.findDOMNode(table);
        this._tableTag = tag;
        const tableWidth = (tag.offsetWidth - 20);
        let sum = 0;
        let cols = 0;
        Utils.forEach(this._widths, (value, key) => {
            if (key === '__number')
                this._widths[key] = 40;
            else {
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
                if (!width || key === '__number') width = 40;
                this._widths[key] = width < tableWidth ? (width) : (tableWidth / 2);
            }

            sum += this._widths[key];
        });
        const step = tableWidth / sum;
        const free = (tableWidth - sum) / cols;
        this._visibleCols = cols;
        Utils.forEach(this._widths, (value, key) => {
            if (key === '__number') return;
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
        let columns = this._columns.slice();
        Utils.forEach(columns, (column, index) => {
            if (column.id && column.id !== '__number') {
                if (colDiff !== 0) this._widths[column.id] += colDiff;
                column.width = this._widths[column.id];
            }
        });
        this._columns = columns;
        this.forceUpdate(!first);
    }

    _swapColumns(sourceID, targetID, targetCol, mouseX) {
        if (sourceID === targetID) return;
        let res = this._columns.slice();
        const sourceIdx = res.findIndex((column) => column.id === sourceID);

        let tmp = res.splice(sourceIdx, 1)[0];
        let targetIdx = res.findIndex((column) => column.id === targetID);
        if (targetID) {
            let middle = targetCol.getBoundingClientRect();
            middle = middle.left + (middle.width / 2);
            targetIdx = mouseX > middle ? targetIdx + 1 : targetIdx
        }
        res.splice(targetIdx, 0, tmp);

        this._columns = res;
        this.forceUpdate(true);
    }

    /** metoda globalnego filtru
     * @param filter obiekt filtru
     * @param data tablica z komórkami (kompletna tabela)
     * @returns {*[]}
     */
    globalFilterMethod(filter: {}, data: []): [] {
        if (!filter.value || filter.value === '') return data;
        if (filter.value instanceof (CustomFilter)) {
            return Utils.forEach(data, (row) => {
                if (filter.value.filter(row, true))
                    return row;
            });
        }

        let tmpFilter = {id: filter.id, value: filter.value};
        return Utils.forEach(data, (row) => {
            let ret = false;
            Utils.forEach(this._columns, (column) => {
                if (column.filterable && column.id && column.show) {
                    tmpFilter.id = column.id;
                    if (column.filterMethod(tmpFilter, row))
                        ret = true;
                }
            });
            if (ret) return row;
        });
    }

    /** filtruje zawartość kolumny
     * @param filter filtr {id:IdKolumny, value:filtr}
     * @param cell aktualnie sprawdzana komórka
     * @param filterFn funkcja filtrująca
     * @param sortFn funkcja sortująca
     * @returns {boolean}
     * @private
     */
    _filterColumn(filter: {}, cell, filterFn: ?() => boolean = null, sortFn: ?() => number = null): boolean {
        if (!cell) return false;
        const val = Is.defined(cell.value) ? cell.value : cell;

        if (!(filter.value instanceof (Object)))
            return Is.func(filterFn) ? filterFn(filter.value, cell) : Utils.toString(val).contains(filter.value);

        const f: CustomFilter = filter.value;
        return f.filter(val, false);
    }

    /** przypisuje filtr do kolumny
     * @param colId identyfikator kolumny
     * @param filter filtr (string lub CustomFilter) lub null
     * @param search czy wyszukiwanie
     */
    setFilter(colId: ?string, filter: ?any, search: boolean = false) {
        if (filter === '') filter = null;
        const filtered = this._filtered.slice();
        for (let i = 0; i < filtered.length; ++i)
            if (filtered[i].id === colId && filtered[i].search === search) {
                filtered.splice(i, 1);
                break;
            }
        if (filter)
            filtered.push({id: colId, value: filter, search: search});
        this._filtered = filtered;
        this.forceUpdate(true);

    }

    /** otwiera okno dialogowe z konfiguracją filtru
     * @param colId id kolumny
     */
    filterDialog(colId: ?string) {
        //Todo okno z filtrami
        const mw = ModalWindow.create((mw: ModalWindow) => {
            const cols = Utils.forEach(this.props.columns, (column, idx) => {
                if (column instanceof (Column)) return column;
                return {key: idx, name: column};
            });

            const col = colId !== undefined ? [cols.find(col => col.key === colId)] :
                Utils.forEach(this._columns, (column) => {
                    if (column.filterable && column.show && column.id)
                        return cols.find(col => col.key === column.id);
                });
            mw.title = "Filtruj " + (col.length === 1 ? '"' + col[0].name + '"' : "tabelę");
            mw.icon = Icon.FILTER;
            mw.resizable = false;
            mw.closeButton = false;
            mw.buttons = MW_BUTTONS.OK_CANCEL;
            let f = null;
            for (let i = 0; i < this._filtered.length; ++i)
                if (this._filtered[i].id === colId && !this._filtered[i].search) {
                    if (this._filtered[i].value instanceof (CustomFilter))
                        f = this._filtered[i].value;
                    break;
                }
            let filter = null;
            mw.content = <FilterEditor ref={elem => filter = elem}
                                       filter={f}
                                       dataSource={{columns: col, rows: []}}
            />;
            mw.onConfirm = () => {
                this.setFilter(colId, filter.getFilter());
                return true;
            };
            mw.mainStyle = {maxWidth: '500px', minWidth: '500px', minHeight: '50%'};
        });
        mw.open();
    }

    /** ustawia tryb zaznaczania
     * @param selecting czy aktywny
     * @private
     */
    _setSelectable(selecting: boolean) {
        this._selecting = selecting;
        if (!selecting) this._selected = [];
        this.forceUpdate(true);
    }

    /** sprawdza czy dany wiersz jest zaznaczony
     * @param index indeks wiersza
     * @returns obiekt zaznaczenia lub undefined
     * @private
     */
    _isSelected(index: number = -1): {} {
        if (index < 0) return false;
        return this._selected.find((o) => o.index === index);
    }

    /** zaznacza dany wiersz
     * @param index indeks wiersza
     * @param row dane wiersza
     * @param check czy zaznaczony
     * @private
     */
    _select(index: number = -1, row, check: boolean = false) {
        if (index < 0) return;
        const idx = this._selected.findIndex((o) => o.index === index);
        if (idx >= 0 === check) return;
        const selected = this._selected.slice();
        if (check)
            selected.push({index: index, row: row, show: true});
        else
            selected.splice(idx, 1);
        this._selected = selected;
        this.forceUpdate(true);
    }

    /** Zwraca tablicę zaznaczonych wierszy
     * @param allColumns czy ma zwracać zawartość ukrytych kolumn
     * @param allRows czy ma zwracać zawartość ukrytych wierszy
     * @returns {*[]} tablica wierszy [{colID:data,...},...]
     */
    getSelectedRows(allColumns: boolean = false, allRows: boolean = false): [] {
        return Utils.forEach(this._selected, (selected) => {
            if (selected.show || allRows) {
                let row = {};
                Utils.forEach(this._columns, (col) => {
                    if (col.id && col.id !== '__number')
                        if (col.show || allColumns)
                            row[col.id] = selected.row[col.id];
                });
                return row;
            }
        });
    }

    /** Zwraca tablicę indeksów zaznaczonych wierszy
     * @param allRows czy ma zwracać zawartość ukrytych wierszy
     * @returns {*[]} tablica indeksów [0, 1, 5,...]
     */
    getSelectedIndexes(allRows: boolean = false) {
        return Utils.forEach(this._selected, (selected) => {
            if (selected.show || allRows) return selected.index;
        })
    }

    /** Zwraca tablicę id widocznych kolumn
     * @param allColumns czy ma zwracać również id ukrytych
     * @returns {*[]} ['id0', 'id1', ...]
     */
    getVisibleColumns(allColumns: boolean = false): [] {
        return Utils.forEach(this._columns, (col) => {
            if (col.id && col.id !== '__number')
                if (col.show || allColumns)
                    return col.id;
        })
    }

    /** określa które zaznaczone wiersze są widoczne
     * @param table ref do tabeli ReactTable
     * @private
     */
    _updateSelected(table: ReactTable) {
        if (!table) return;
        const data = table.state.sortedData;
        Utils.forEach(this._selected, (sel) => {
            sel.show = false;
            for (let i = 0; i < data.length; ++i)
                if (data[i]._index === sel.index) {
                    sel.show = true;
                    break;
                }
        })
    }

    render() {

        if (!this._columns)
            this._columns = this._convertColumns(this.props.columns);

        if (this._dataChanged || !this._tableProps) {

            const data = Utils.forEach(this._dataSource, (row, rowIdx) => this._convertRow(row, rowIdx));

            this._tableProps = {
                data: data,
                showPagination: data.length > 25 || this._filterable,
            };

            this._dataChanged = null;
        }

        return <ReactTable
            ref={elem => {
                this._computeWidths(elem);
                this._updateSelected(elem);
            }}
            className={this._className.join(" ")}
            defaultSorted={this._sorted}
            columns={this._columns} //this.state.columns
            {...this._tableProps}
            showPageSizeOptions={false}
            pageSizeOptions={[5, 10, 25, 50]}
            defaultPageSize={25}
            filtered={this._filtered || []}
            sorted={this._sorted || []}

            getTbodyProps={() => {
                //wyłączenie flexa w wierszach
                return {
                    style: {display: 'block'},
                    onContextMenu: (e) => PopupMenu.openMenu(e, this.ROWS_MENU_ITEMS)
                }
            }}
            getTheadFilterProps={() => {
                return {style: {display: 'none'}}
            }}
            getTdProps={(state, row, column, instance) => {
                return {
                    onClick: Is.func(this._onRowClick) ? (e) => this._onRowClick(row, column, instance, e) : null,
                    onContextMenu: (e) => PopupMenu.openMenu(e, this.ROWS_MENU_ITEMS, {row: row.row, column: column})
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
                    },
                    onContextMenu: (e) => PopupMenu.openMenu(e, this.COLUMNS_MENU_ITEMS, {column: column}),
                    onClick: column.id !== '__number' ?
                        column.sortable ? (e) => this.sortColumn(column.id, null, true) : null
                        : (this._selectable && this._showRowNum ? (e) => this._setSelectable(!this._selecting) : null)
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
            FilterComponent={null}
            PaginationComponent={Pagination}
            getPaginationProps={(state) => {
                return {
                    onSearch: (val => this.setFilter(undefined, val, true)),
                    filterable: this._filterable,
                    visibleRecNum: state.sortedData.length
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

    /** zmienia widoczność kolumny
     * @param colId id kolumny
     * @param visible czy ma być widoczna
     */
    changeColumnVisibility(colId: ?string, visible: boolean) {
        let cols = this._columns.slice();
        Utils.forEach(cols, (col) => {
            if (!colId || col.id === colId) col.show = visible;
        });
        this._columns = cols;
        this.forceUpdate(true);
    }

    /** ustawia lub usuwa sortowanie kolumny
     * @param colId id kolumny
     * @param desc kierunek sortowania. false - asc, true - desc, null - !desc || asc
     * @param clear czy usunąć sortowanie pozostałych kolumn
     * @param remove czy usunąć sortowanie aktualnej kolumny
     */
    sortColumn(colId: ?string, desc: ?boolean = null, clear: boolean = false, remove: boolean = false) {
        const sort = {id: colId, desc: desc};
        let sorted = this._sorted.slice();
        for (let i = 0; i < sorted.length; ++i)
            if (sorted[i].id === colId) {
                if (sort.desc === null) sort.desc = !sorted[i].desc;
                if (sorted[i].desc === sort.desc && !remove) return;
                sorted.splice(i, 1);
                break;
            }
        if (sort.desc === null) sort.desc = false;
        if (clear) sorted = [];
        if (!remove)
            sorted.push(sort);
        this._sorted = sorted;
        this.forceUpdate(true);
    }

    /** pozycje menu kontekstowego wierszy */
    ROWS_MENU_ITEMS: [] = [
        //ToDo pozostałe opcje
        MenuItem.createItem((c: MenuItem) => {
            c.name = "Filtruj tabelę";
            c.icon = Icon.FILTER;
            c.hint = "Otwiera okno do filtrowania tabeli";
            c.onClick = () => this.filterDialog(undefined);
            c.onBeforeOpen = (item, props) => {
                item.disabled = !this._filterable;
            }
        }),
        MenuItem.createItem((c: MenuItem) => {
            c.name = "Usuń filtr tabeli";
            c.icon = Icon.MINUS;
            c.hint = "Usuwa globalny filtr tabeli";
            c.onClick = () => this.setFilter(undefined, null);
            c.onBeforeOpen = (item) => {
                item.disabled = true;
                for (let i = 0; i < this._filtered.length; ++i)
                    if (!this._filtered[i].search && this._filtered[i].id === undefined) {
                        item.disabled = false;
                        break;
                    }
            }
        }),
        MenuItem.createSeparator(),
        MenuItem.createItem((c: MenuItem) => {
            c.icon = Icon.FILTER;
            c.hint = "Filtruje kolumnę po danej wartości";
            c.onBeforeOpen = (item, props) => {
                if (props.column && props.row) {
                    item.disabled = !props.column.filterable;
                    item.onClick = (e, props) => this.setFilter(props.column.id, CustomFilter.orEqual(props.row[props.column.id]));
                } else item.disabled = true;
                item.name = item.disabled ? "Niedostępne" : ('Pokaż tylko: "' + props.row[props.column.id].toString() + '"');
            }
        }),
    ];

    /** pozycje menu kontekstowego kolumn*/
    COLUMNS_MENU_ITEMS: [] = [
        MenuItem.createItem((c: MenuItem) => {
            c.icon = Icon.EYE_SLASH;
            c.hint = "Ukrywa kolumnę";
            c.onClick = (e, props) => this.changeColumnVisibility(props.column.id, false);
            c.onBeforeOpen = (item, props) => {
                item.disabled = !props.column.id;
                if (!props.column.id) return;
                item.name = 'Ukryj "' + props.column.name + '"';
            }
        }),
        MenuItem.createItem((c: MenuItem) => {
            c.name = "Pokaż";
            c.icon = Icon.EYE;
            c.hint = "Odkrywa ukryte kolumny";
            c.onBeforeOpen = (item: MenuItem, props) => {
                item.subMenu = Utils.forEach(this._columns, (col) => {
                    if (col.show === false)
                        return MenuItem.createItem((c: MenuItem) => {
                            c.name = col.name;
                            c.icon = Icon.EYE;
                            c.hint = "Odkrywa kolumnę";
                            c.onClick = (e, props) => this.changeColumnVisibility(col.id, true);
                        });
                });
                item.disabled = (item.subMenu.length === 0);
                item.subMenu.unshift(MenuItem.createSeparator());
                item.subMenu.unshift(MenuItem.createItem((c: MenuItem) => {
                    c.name = "Pokaż wszystkie";
                    c.hint = "Odkrywa wszystkie kolumny";
                    c.icon = Icon.EYE;
                    c.onClick = (e, props) => this.changeColumnVisibility(null, true);
                }))
            }
        }),
        MenuItem.createSeparator(),
        MenuItem.createItem((c: MenuItem) => {
            c.name = 'Sortuj rosnąco';
            c.hint = 'Sortuje zawartość rosnąco';
            c.icon = Icon.SORT_ALPHA_ASC;
            c.onClick = (e, props) => this.sortColumn(props.column.id, false);
            c.onBeforeOpen = (item, props) => {
                item.disabled = props.column.id ? !props.column.sortable : true;
            }
        }),
        MenuItem.createItem((c: MenuItem) => {
            c.name = 'Sortuj malejąco';
            c.hint = 'Sortuje zawartość malejąco';
            c.icon = Icon.SORT_ALPHA_DESC;
            c.onClick = (e, props) => this.sortColumn(props.column.id, true);
            c.onBeforeOpen = (item, props) => {
                item.disabled = props.column.id ? !props.column.sortable : true;
            }
        }),
        MenuItem.createItem((c: MenuItem) => {
            c.name = 'Usuń sortowanie';
            c.hint = 'Usuwa sortowanie kolumny';
            c.icon = Icon.MINUS;
            c.onClick = (e, props) => this.sortColumn(props.column.id, null, false, true);
            c.onBeforeOpen = (item, props) => {
                item.disabled = props.column.id ? !props.column.sortable : true;
                if (!item.disabled) {
                    for (let i = 0; i < this._sorted.length; ++i)
                        if (this._sorted[i].id === props.column.id) {
                            item.disabled = false;
                            return;
                        }
                    item.disabled = true;
                }
            }
        }),
        MenuItem.createSeparator(),
        MenuItem.createItem((c: MenuItem) => {
            c.name = 'Filtruj';
            c.icon = Icon.FILTER;
            c.hint = 'Otwiera okno dialogowe z filtrami';
            c.onClick = (e, props) => this.filterDialog(props.column.id);
            c.onBeforeOpen = (item, props) => {
                item.disabled = props.column.id ? !props.column.filterable : true;
            }
        }),
        MenuItem.createItem((c: MenuItem) => {
            c.name = 'Usuń filtr';
            c.icon = Icon.MINUS;
            c.hint = 'Usuwa filtr z kolumny';
            c.onClick = (e, props) => this.setFilter(props.column.id, null);
            c.onBeforeOpen = (item, props) => {
                item.disabled = props.column.id ? !props.column.filterable : true;
                if (!item.disabled) {
                    for (let i = 0; i < this._filtered.length; ++i)
                        if (this._filtered[i].id === props.column.id) {
                            item.disabled = false;
                            return;
                        }
                    item.disabled = true;
                }
            }
        })
    ]
}

/**********************************************************************************************************************/
/***** Paginacja ******************************************************************************************************/

/**********************************************************************************************************************/

class Pagination extends React.Component {
    defaultButton = props => {
        return <button type='button' {...props} className='-btn'>
            {props.children}
        </button>;
    };

    constructor(props) {
        super();

        this.getSafePage = this.getSafePage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.applyPage = this.applyPage.bind(this);

        this.state = {
            page: props.page,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({page: nextProps.page})
    }

    getSafePage(page) {
        if (isNaN(page)) {
            page = this.props.page
        }
        return Math.min(Math.max(page, 0), this.props.pages - 1)
    }

    changePage(page) {
        page = this.getSafePage(page);
        this.setState({page});
        if (this.props.page !== page) {
            this.props.onPageChange(page)
        }
    }

    applyPage(e) {
        e && e.preventDefault();
        const page = this.state.page;
        this.changePage(page === '' ? this.props.page : page)
    }

    render() {
        const {
            // Computed
            pages,
            // Props
            page,
            showPageSizeOptions,
            pageSizeOptions,
            pageSize,
            showPageJump,
            canPrevious,
            canNext,
            onPageSizeChange,
            className,
            PreviousComponent = this.defaultButton,
            NextComponent = this.defaultButton,
        } = this.props;

        return (
            <div
                className={classnames(className, '-pagination')}
                style={this.props.paginationStyle}
            >
                <div className='-center'>
                    {this.props.filterable ?
                        <div className="-searchbar">
                            <input type="text"
                                   placeholder="Wyszukaj..."
                                   onChange={e => this.props.onSearch(e.target.value)}/>
                        </div> : null}
                    <div className="-recordsNumber">
                        <span style={{fontWeight: 'bolder'}}>{"Liczba rekordów: "}</span>
                        <span>{this.props.visibleRecNum}</span>
                    </div>
                    {showPageSizeOptions &&
                    <span className='select-wrap -pageSizeOptions'>
              <select
                  onChange={e => onPageSizeChange(Number(e.target.value))}
                  value={pageSize}
              >
                {pageSizeOptions.map((option, i) => {
                    return (
                        <option key={i} value={option}>
                            {option} {this.props.rowsText}
                        </option>
                    )
                })}
              </select>
            </span>}
                </div>
                <div className='-previous'>
                    <PreviousComponent
                        onClick={e => {
                            if (!canPrevious) return;
                            this.changePage(page - 1)
                        }}
                        disabled={!canPrevious}
                    >
                        {this.props.previousText}
                    </PreviousComponent>
                </div>
                <span className='-pageInfo'>
        {this.props.pageText}{' '}
                    {showPageJump
                        ? <div className='-pageJump'>
                            <input
                                type={this.state.page === '' ? 'text' : 'number'}
                                onChange={e => {
                                    const val = e.target.value;
                                    const page = val - 1;
                                    if (val === '') {
                                        return this.setState({page: val})
                                    }
                                    this.setState({page: this.getSafePage(page)})
                                }}
                                value={this.state.page === '' ? '' : this.state.page + 1}
                                onBlur={this.applyPage}
                                onKeyPress={e => {
                                    if (e.which === 13 || e.keyCode === 13) {
                                        this.applyPage()
                                    }
                                }}
                            />
                        </div>
                        : <span className='-currentPage'>
                {page + 1}
              </span>}{' '}
                    {this.props.ofText}{' '}
                    <span className='-totalPages'>{pages || 1}</span>
        </span>
                <div className='-next'>
                    <NextComponent
                        onClick={e => {
                            if (!canNext) return;
                            this.changePage(page + 1)
                        }}
                        disabled={!canNext}
                    >
                        {this.props.nextText}
                    </NextComponent>
                </div>
            </div>
        )
    }
}