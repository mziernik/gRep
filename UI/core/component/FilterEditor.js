import {React, ReactDOM, ReactUtils, PropTypes, Utils, Is, CustomFilter, Field, Column} from "../core";
import {Component, Icon, Button} from "../components";

export default class FilterEditor extends Component {
    _key: number = 0;
    _dataSource: [] = []; // [Column, ...]
    _filters: [] = []; //{filter:CustomFilter, _key:any}

    static propTypes = {
        dataSource: PropTypes.array,
        filters: PropTypes.array,
        filter: PropTypes.object
    };

    /* Todo
     * <FCtrl>
     */

    constructor() {
        super(...arguments);
        this._dataSource = this.props.dataSource;
        this._setFilters(this.props.filters);
        if (this.props.filter)
            this._setFilter(this.props.filter);
    }

    _createFilter() {
        let last = this._filters.last();
        return {
            filter: last ? last.filter.clone() : CustomFilter.andEqual('', this._dataSource[0].key),
            _key: this._key++
        };
    }

    _add() {
        const tmp = this._filters.slice();
        tmp.push(this._createFilter());
        this._filters = tmp;
        this.forceUpdate(true);
    }

    _remove(key: string) {
        const tmp = this._filters.slice();
        const idx = tmp.findIndex((f) => f._key === key);
        if (idx < 0) return;
        tmp.splice(idx, 1);
        this._filters = tmp;
        this.forceUpdate(true);
    }

    _setFilters(filters: []) {
        this._filters = filters || [this._createFilter()];
        this.forceUpdate(true);
    }

    _setFilter(filter: CustomFilter) {
        const filters = [];

        const helper = (filter: CustomFilter) => {
            const tmp = this._createFilter();
            tmp.filter = filter;
            filters.push(tmp);
            Utils.forEach(filter.conditions, (c) => helper(c));
            filter.conditions = [];
        };

        helper(filter.clone());
        this._filters = filters;
        this.forceUpdate(true);
    }

    _change(filter: CustomFilter, operator = null, condition = null, value = null, accessor = null) {
        if (operator !== null) filter.operator = operator;
        if (condition !== null) filter.condition = condition;
        if (value !== null) filter.value = value;
        if (accessor !== null) {
            filter.accessor = accessor;
            const ds: Column = this._dataSource.find(col => col.key === accessor);
            filter.compareFn = ds.compare;
            filter.filterFn = ds.filter;
        }
        this.forceUpdate(true);
    }

    getFilters(): [] {
        return this._filters;
    }

    getFilter(): CustomFilter {
        const filters = Utils.forEach(this._filters, (f) => f.filter.clone());
        const filter = filters[0];
        if (filters.length === 0) return null;
        for (let i = 1; i < filters.length; ++i) {
            filters[i].operator = CustomFilter.OPERATORS.AND;
            if (filters[i].condition !== CustomFilter.CONDITIONS.NOT_EQUAL)
                for (let j = i - 1; j >= 0; --j)
                    if ((filters[j].condition === filters[i].condition
                            || filters[i].condition === CustomFilter.CONDITIONS.EQUAL)
                        && filters[j].accessor === filters[i].accessor) {
                        filters[i].operator = CustomFilter.OPERATORS.OR;
                        break;
                    }

            filter.addCondition(filters[i]);
        }
        return filter;
    }

    renderPreview() {
        const filter = this.getFilter();
        return <div>{!filter ? 'Brak' : filter.toString()}</div>;
    }

    renderEdit(filter: { id: string, filter: CustomFilter, key: string }) {
        const colSelect = <select defaultValue={filter.filter.accessor}
                                  disabled={this._dataSource.length === 1}
                                  onChange={e => this._change(filter.filter, null, null, null, e.currentTarget.value)}>
            {Utils.forEach(this._dataSource, (col, idx) => {
                    return <option key={idx + '.' + col.key} value={col.key}>{col.name}</option>;
                }
            )}
        </select>;

        const condSelect = <select defaultValue={filter.filter.condition}
                                   onChange={e => this._change(filter.filter, null, e.currentTarget.value)}>
            {Utils.forEach(CustomFilter.CONDITIONS, (cond, idx) => {
                return <option key={idx} value={cond}>{cond}</option>
            })}
        </select>;

        const valInput = <input placeholder="Wartość" defaultValue={filter.filter.value}
                                onChange={(e) => this._change(filter.filter, null, null, e.currentTarget.value)}/>;

        return <div key={filter._key}>
            {colSelect}
            {condSelect}
            {valInput}
            <span className={Icon.TIMES}
                  title="Usuń"
                  style={{color: 'red'}}
                  onClick={e => {
                      e.stopPropagation();
                      this._remove(filter._key)
                  }}/>
        </div>;
    }

    render() {
        return <div>
            {this.renderPreview()}
            {Utils.forEach(this._filters, (filter, idx) => {
                return this.renderEdit(filter, idx);
            })}
            <span className={Icon.PLUS}
                  title="Dodaj"
                  style={{color: 'green'}}
                  onClick={e => {
                      e.stopPropagation();
                      this._add()
                  }}/>
        </div>
    }
}