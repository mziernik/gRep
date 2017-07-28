import {React, ReactDOM, ReactUtils, PropTypes, Utils, Is, CustomFilter} from "../core";
import {Component} from "../components";

//ToDo WSZYSTKO!!! ;P
export default class FilterEditor extends Component {
    _filter: CustomFilter = null;

    _operation = CustomFilter.OPERATIONS.AND;
    _type = CustomFilter.TYPES.EQUAL;
    _value = null;

    static propTypes = {
        filter: PropTypes.instanceOf(CustomFilter),
        onChange: PropTypes.func
    };

    constructor() {
        super(...arguments);
        this._filter = this.props.filter || null;
    }

    add() {
        const filter = new CustomFilter(this._value, this._type, this._operation);
        if (!this._filter)
            this._filter = filter;
        else
            this._filter.addCondition(filter);
        if (Is.func(this.props.onChange))
            this.props.onChange(this._filter);
        this.forceUpdate(true);
    }

    renderPreview() {
        return <div>{this._filter ? this._filter.toString() : ''}</div>
    }

    renderCreateFilter() {
        return <div className="c-filter-editor-create">
            {this._filter ?
                <select className="c-filter-editor-create-operation"
                        defaultValue={this._operation}
                        onChange={(e) => this._operation = e.currentTarget.value}>
                    {Utils.forEach(CustomFilter.OPERATIONS, (operation) => {
                        return <option key={'_' + operation} value={operation}>{operation}</option>;
                    })}
                </select> : null}
            <span style={{fontWeight: 'bolder', margin: '5px'}}>$x</span>
            <select className="c-filter-editor-create-type"
                    defaultValue={this._type}
                    onChange={(e) => this._type = e.currentTarget.value}>
                {Utils.forEach(CustomFilter.TYPES, (type) => {
                    return <option key={'_' + type} value={type}>{type}</option>;
                })}
            </select>
            <input className="c-filter-editor-create-value" placeholder="Wartość"
                   onChange={(e) => this._value = e.currentTarget.value}/>
            <button className="c-filter-editor-create-add" onClick={() => this.add()}>Dodaj</button>
        </div>;
    }

    render() {
        return <div className="c-filter-editor">
            {this.renderPreview()}
            {this.renderCreateFilter()}
        </div>
    }
}