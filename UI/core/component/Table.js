import {React, PropTypes, Utils, If, Check} from "../core";
import {Component} from "../components";

export default class Table extends Component {

    static propTypes = {
        columns: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        rows: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        rowMapper: PropTypes.func
    };

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


