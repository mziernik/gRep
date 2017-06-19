import {React, PropTypes, Utils, If, Check} from "../core";
import {Component} from "../components";
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class Table extends Component {

    static propTypes = {
        columns: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        rows: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        rowMapper: PropTypes.func
    };

    constructor() {
        super(...arguments);
        this.columns = this._convertColumns();
        this.data = this._convertData();
    }

    /** mapuje kolumny pod format ReactTable
     * @returns {*[]}
     * @private
     */
    _convertColumns(): [] {
        return Utils.forEachMap(this.props.columns, (col, key) => {
            let k = key;
            if (If.isNumber(key) && col.$$typeof)
                k = Check.nonEmptyString(col.key, new Error("Wymagana definicja atrybutu key"));
            return {Header: col, accessor: "" + k};
        });
    }

    /** mapuje dane przyp pomocy props.rowMapper
     * @returns {*[]}
     * @private
     */
    _convertData(): [] {
        return Utils.forEachMap(this.props.rows, (row) => {
            return If.isFunction(this.props.rowMapper) ? this.props.rowMapper(row) : row;
        });
    }

    render1() {
        return <ReactTable
            showPagination={this.data.length > 20}
            defaultPageSize={this.data.length === 0 ? 10 : this.data.length > 20 ? 20 : this.data.length}
            columns={this.columns}
            data={this.data}

            previousText="Poprzednia"
            nextText="Następna"
            loadingText="Wczytywanie..."
            noDataText="Brak rekordów"
            pageText="Strona"
            ofText="z"
            rowsText="rekordów"
        />;
    }

    //ToDo do usunięcia
    render() {

        const colKeys = []; //klucze kolumn

        const columns = Utils.forEachMap(this.props.columns, (col, key) => {
            if (If.isNumber(key) && col.$$typeof)
                key = Check.nonEmptyString(col.key, new Error("Wymagana definicja atrybutu key"));
            colKeys.push(key);
            return <th key={key}>{col}</th>;
        });

        const rows = [];


        Utils.forEach(this.props.rows, (row, idx) => {

            const _row = If.isFunction(this.props.rowMapper) ? this.props.rowMapper(row) : row;

            const out = [];

            if (_row instanceof Array)
                Utils.forEach(_row, (elm, idx) => {
                    out.push(<td key={idx}>{elm}</td>);
                });
            else {
                colKeys.forEach((colName: string) => {
                    out.push(<td key={colName}>{_row[colName]}</td>);
                });
            }
            if (out.length)
                rows.push(<tr key={idx}>{out}</tr>);
        });


        return <table className="table" style={ {fontSize: "12pt"} }>
            {columns.length ? <thead>
            <tr>{columns}</tr>
            </thead> : null}
            {rows.length ? <tbody>{rows}</tbody> : null}
            {this.props.children}
        </table>;
    }

}


