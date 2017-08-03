import {React, ReactDOM, ReactUtils, PropTypes, Utils, Is, CustomFilter, Field, Column, Type} from "../core";
import {Component, Icon, Select} from "../components";
import FCtrl from "./form/FCtrl";

export default class FilterEditor extends Component {
    _key: number = 0;
    _columns: [] = []; // [Column, ...]
    _rows: [] = []; //ToDo enumeraty
    _filters: [] = []; //{filter:CustomFilter, _key:any}

    static propTypes = {
        dataSource: PropTypes.object, //{columns:[Column,...], rows:[]}
        filters: PropTypes.array,
        filter: PropTypes.object
    };

    constructor() {
        super(...arguments);
        this._columns = this.props.dataSource.columns || [];
        this._rows = this.props.dataSource.rows || [];
        this._setFilters(this.props.filters);
        if (this.props.filter)
            this._setFilter(this.props.filter);
    }

    _createFilter() {
        let last = this._filters.last();
        let res = {
            value: Field.create(last ? last.value.type : (this._columns[0].type || Type.STRING), 'filter_value_' + this._key, 'Wartość'),
            filter: last ? last.filter.clone() : CustomFilter.andEqual('', this._columns[0].key),
            _key: this._key++
        };
        res.value.value = res.filter.value;
        return res;
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
            const ds = this._columns.find((col) => col.key === filter.accessor);
            if (ds) tmp.value.config.type = ds.type;
            tmp.value.value = filter.value;
            filters.push(tmp);
            Utils.forEach(filter.conditions, (c) => helper(c));
            filter.conditions = [];
        };

        helper(filter.clone());
        this._filters = filters;
        this.forceUpdate(true);
    }

    _change(filter: {}, operator = null, condition = null, accessor = null) {
        const cfilter = filter.filter;
        if (operator !== null) cfilter.operator = operator;
        if (condition !== null) cfilter.condition = condition;
        if (accessor !== null) {
            cfilter.accessor = accessor;
            cfilter.condition = CustomFilter.CONDITIONS.EQUAL;
            const ds: Column = this._columns.find(col => col.key === accessor);
            if (ds) {
                cfilter.compareFn = ds.compare;
                cfilter.filterFn = ds.filter;
                if (ds.type) {
                    filter.value.config.type = ds.type;
                    filter.value.value = null;
                }
            }
        }
        cfilter.value = filter.value.value;
        this.forceUpdate(true);
    }

    getFilters(): [] {
        return this._filters;
    }

    getFilter(): CustomFilter {
        const filters = Utils.forEach(this._filters, (f) => f.filter.clone());
        const filter = filters[0];
        if (filters.length === 0) return null;
        let added = false;
        for (let i = 1; i < filters.length; ++i) {
            added = false;
            filters[i].operator = CustomFilter.OPERATORS.AND;
            if (filters[i].condition !== CustomFilter.CONDITIONS.NOT_EQUAL)
                for (let j = i - 1; j >= 0; --j)
                    if ((filters[j].condition === filters[i].condition
                            || filters[i].condition === CustomFilter.CONDITIONS.EQUAL)
                        && filters[j].accessor === filters[i].accessor) {
                        filters[i].operator = CustomFilter.OPERATORS.OR;
                        filters[j].addCondition(filters[i]);
                        added = true;
                        break;
                    }
            if (!added)
                filter.addCondition(filters[i]);
        }
        return filter;
    }

    renderPreview() {
        const filter = this.getFilter();
        return <div>{!filter ? 'Brak' : filter.toString()}</div>;
    }

    //ToDo layout
    //ToDo selecty na FCtrl
    renderEdit(filter: { value: Field, filter: CustomFilter, key: string }) {
        const colSelect = <select defaultValue={filter.filter.accessor}
                                  disabled={this._columns.length === 1}
                                  onChange={e => this._change(filter, null, null, e.currentTarget.value)}>
            {Utils.forEach(this._columns, (col, idx) => {
                    return <option key={idx + '.' + col.key} value={col.key}>{col.name}</option>;
                }
            )}
        </select>;

        const condSelect = <select defaultValue={filter.filter.condition}
                                   onChange={e => this._change(filter, null, e.currentTarget.value)}>
            {Utils.forEach(CustomFilter.getConditions(filter.value.type.simpleType), (cond, idx) => {
                return <option key={idx} value={cond}>{cond}</option>
            })}
        </select>;
        const valInput = <FCtrl fit field={filter.value} value onChange={(e) => this._change(filter)}/>;

        return <div key={filter._key} style={{display: 'flex'}}>
            {colSelect}
            {condSelect}
            {valInput}
            <span className={Icon.TIMES}
                  title="Usuń"
                  style={{
                      color: 'red',
                      alignSelf: 'center'
                  }}
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