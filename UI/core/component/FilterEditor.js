import {React, ReactDOM, ReactUtils, PropTypes, Utils, Is, CustomFilter, Field, Column} from "../core";
import {Component, Icon, Button} from "../components";

//ToDo wymyślić coś sensownego
export default class FilterEditor extends Component {
    _filter: CustomFilter = null;
    _selected: CustomFilter = null;

    _operator = CustomFilter.OPERATORS.AND;
    _condition = CustomFilter.CONDITIONS.EQUAL;
    _value = null;

    static propTypes = {
        filter: PropTypes.instanceOf(CustomFilter),
        onChange: PropTypes.func
    };

    constructor() {
        super(...arguments);
        this._filter = this.props.filter || null;
        this.select(this._filter, false);
    }

    componentWillUnmount() {
        super.componentWillMount(...arguments);
        if (this._selected) this._selected.selected = false;
    }

    changed() {
        if (Is.func(this.props.onChange))
            this.props.onChange(this._filter);
        this.forceUpdate(true);
    }

    add() {
        const filter = new CustomFilter(this._value, this._condition, this._operator);
        if (!this._selected) {
            this._filter = filter;
            this.select(this._filter, false);
        } else
            this._selected.addCondition(filter);
        this.changed();
    }

    remove(filter: CustomFilter) {
        const helper = (conditions: []) => {
            for (let i = 0; i < conditions.length; ++i)
                if (conditions[i].selected) {
                    conditions[i].selected = false;
                    conditions.splice(i, 1);
                    return true;
                } else if (helper(conditions[i].conditions))
                    return true;
        };

        this.select(filter, false);
        if (this._filter.selected)
            this._filter = null;
        else
            helper(this._filter.conditions);
        this.select(this._filter, false);
        this.changed();
    }

    change() {
        if (!this._selected) {
            this.add();
            return;
        }
        this._selected.type = this._condition;
        this._selected.operation = this._operator;
        this._selected.value = this._value;
        this.changed();
    }

    select(filter: CustomFilter, update: boolean = true) {
        if (this._selected) this._selected.selected = false;
        this._selected = filter;
        if (this._selected)
            this._selected.selected = true;
        if (update)
            this.forceUpdate(true);
    }

    renderFilter(filter: CustomFilter, level: number = 0, idx: number = 0, first: boolean = false) {
        if (!filter) return null;
        let res = [];
        const padding = (level * 10) + 'px';
        const fstr = filter.toString('$x', true);
        res.push(<div key={level + '.' + idx}
                      title={filter.toString()}
                      style={{
                          cursor: 'pointer',
                          background: filter.selected ? 'rgba(127,127,127,0.4)' : null
                      }}
                      onClick={() => this.select(filter)}>
            <span className={Icon.TIMES}
                  title="Usuń"
                  style={{
                      color: 'red',
                      padding: '0 5px',
                      marginRight: padding
                  }}
                  onClick={(e) => {
                      e.stopPropagation();
                      this.remove(filter);
                  }}/>
            {first ? fstr : filter.operation.concat(' ', fstr)}</div>);

        return res.concat(Utils.forEach(filter.conditions, (condition) => this.renderFilter(condition, level + 1, ++idx)));
    }

    renderPreview(treeView: boolean = true, style: {}) {
        if (!this._filter) return null;
        if (treeView)
            return <div style={{...style}}>{this.renderFilter(this._filter, 0, 0, true)}</div>;
        return <div style={{...style}}>{this._filter.toString()}</div>;
    }

    renderCreateFilter() {
        return <div className="c-filter-editor-create">
            <div>
                <select className="c-filter-editor-create-operation"
                        disabled={!this._filter}
                        defaultValue={this._operator}
                        onChange={(e) => this._operator = e.currentTarget.value}>
                    {Utils.forEach(CustomFilter.OPERATORS, (operation) => {
                        return <option key={'_' + operation} value={operation}>{operation}</option>;
                    })}
                </select>
                <select className="c-filter-editor-create-type"
                        defaultValue={this._condition}
                        onChange={(e) => this._condition = e.currentTarget.value}>
                    {Utils.forEach(CustomFilter.CONDITIONS, (type) => {
                        return <option key={'_' + type} value={type}>{type}</option>;
                    })}
                </select>
            </div>
            <div>
                <input className="c-filter-editor-create-value" placeholder="Wartość"
                       onChange={(e) => this._value = e.currentTarget.value}/>
                <Button type={'success'}
                        icon={Icon.PLUS}
                        className="c-filter-editor-create-add"
                        onClick={() => this.add()}>Dodaj</Button>
                <Button type={'primary'}
                        icon={Icon.PENCIL}
                        className="c-filter-editor-create-change"
                        onClick={() => this.change()}>
                    Zmień
                </Button>
            </div>
        </div>;
    }

    render() {
        return <div className="c-filter-editor">
            {this.renderPreview(false)}
            {this.renderCreateFilter()}
            {this.renderPreview()}
        </div>
    }
}