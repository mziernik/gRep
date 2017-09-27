//@Flow
'use strict';
import {React, ReactDOM, ReactUtils, PropTypes, Utils, Is, CustomFilter, Field, Column, Type} from "../../core";
import {Component, Icon, Select} from "../../components";
import FCtrl from "../form/FCtrl";

//FixMe cachowanie enumeraty w Field zepsuło listę warunków. Nie aktualizuje się po zmianie typu

/*SZ jak jest ten komonent używany bo bo jest w tabelach ale to nie jest obszar wizualny
*  jest to komponent do filtowania danych na listach gdzie user może dynamicznie budować warunki zawężające rekordy na listach
*
* */

export default class FilterEditor extends Component {
    static propTypes = {
        dataSource: PropTypes.object, //{columns:[Column,...], rows:[]}
        filter: PropTypes.object
    };
    _key: number = 0;
    _columns: [] = []; // [Column, ...]
    _rows: [] = []; //ToDo enumeraty
    _filters: [] = []; //{filter:CustomFilter, _key:any}

    constructor() {
        super(...arguments);
        this._columns = this.props.dataSource.columns || [];
        this._rows = this.props.dataSource.rows || [];
        if (this.props.filter)
            this._setFilter(this.props.filter);
        else
            this._filters.push(this._createFilter())
    }

    _createFilter(based: ?CustomFilter = null) {
        let last = this._filters.last();
        let res = {
            accessor: new Field((cfg: Column) => {
                cfg.type = Type.ENUM;
                cfg.key = 'filter_accessor_' + this._key;
                cfg.name = 'Kolumna';
                cfg.enumerate = {};
                Utils.forEach(this._columns, (col) => cfg.enumerate[col.key] = col.name);
                cfg.readOnly = this._columns.length === 1;
                cfg.value = based ? based.accessor : last ? last.accessor.value : this._columns[0].key;
            }),
            condition: new Field((cfg: Column) => {
                cfg.type = Type.ENUM;
                cfg.key = 'filter_condition_' + this._key;
                cfg.name = 'Warunek';
                cfg.enumerate = () => this._getConditionsEnum(res);
                cfg.value = based ? based.condition : last ? last.condition.value : CustomFilter.CONDITIONS.EQUAL;
            }),
            value: new Field((cfg: Column) => {
                const i = based ? this._columns.find((col) => col.key === based.accessor) : this._columns[0];
                cfg.type = last ? last.value.type : (i.type || Type.STRING);
                cfg.key = 'filter_value_' + this._key;
                cfg.name = 'Wartość';
                cfg.value = based ? based.value : last ? last.value.value : null;
            }),
            _key: this._key++
        };
        return res;
    }

    _getConditionsEnum(filter: {}): {} {
        const res = {};
        Utils.forEach(CustomFilter.getConditions(filter.value.type.simpleType), (cond) => res[cond] = cond);
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

    _setFilter(filter: CustomFilter) {
        const filters = [];

        const helper = (filter: CustomFilter) => {
            const tmp = this._createFilter(filter);
            const ds = this._columns.find((col) => col.key === filter.accessor);
            if (ds) tmp.value.config.type = ds.type;
            tmp.value.value = filter.value;
            filters.push(tmp);
            Utils.forEach(filter.conditions, (c) => helper(c));
        };

        helper(filter);
        this._filters = filters;
        this.forceUpdate(true);
    }

    _change(filter: {}, newAccessor: boolean = false) {
        if (newAccessor) {
            const ds: Column = this._columns.find(col => col.key === filter.accessor.value);
            if (ds) {
                if (ds.type) {
                    filter.value.config.type = ds.type;
                    filter.value.value = null;
                }
            }
            filter.condition.value = CustomFilter.CONDITIONS.EQUAL;
        }
        this.forceUpdate(true);
    }

    getFilter(): CustomFilter {
        const filters = Utils.forEach(this._filters, (f) => {
            const filter = new CustomFilter(f.value.value, f.condition.value, CustomFilter.OPERATORS.AND, f.accessor.value);
            const c = this._columns.find((col) => col.key === filter.accessor);
            if (c) {
                filter.filterFn = c.filter;
                filter.compareFn = c.compare;
            }
            return filter;
        });
        filters.sort((a, b) => CustomFilter.defaultCompareFn('string')(a.accessor, b.accessor));
        const filter = filters[0];
        if (filters.length === 0) return null;
        let added = false;
        for (let i = 1; i < filters.length; ++i) {
            added = false;
            if (filters[i].condition !== CustomFilter.CONDITIONS.NOT_EQUAL
                && filters[i].condition !== CustomFilter.CONDITIONS.NOT_CONTAINS)
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

    renderEdit(filter: { accessor: Field, condition: Field, value: Field, filter: CustomFilter, key: string }) {
        return <div key={filter._key} style={{display: 'flex', width: '100%'}}>
            <FCtrl fit field={filter.accessor} value onChange={(e) => this._change(filter, true)}/>
            <FCtrl fit field={filter.condition} value onChange={(e) => this._change(filter)}/>
            <FCtrl style={{textAlign: 'center'}} field={filter.value} fit value boolMode={"radio"}
                   onChange={(e) => this._change(filter)}/>
            <span className={Icon.TIMES} title="Usuń"
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
        return <div style={{width: '100%'}}>
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