// @flow
'use strict';
import {React, PropTypes, Field, Column, Utils} from '../../core.js';
import {FormComponent, Link, FCtrl, Icon} from '../../components.js';

export default class List extends FormComponent {

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
        preview: PropTypes.bool
    };

    array: [];

    render() {
        if (!this.field) return null;

        if (this.props.preview)
            return <ul>
                {Utils.forEach(this.field.value, (item: any, index: any) => <li
                    key={index}>{Field.formatValue(item)}</li>)}
            </ul>;

        this.array = this.field.value instanceof Map
            ? Utils.forEach(this.field.value, (v, k) => [k, v])
            : (this.field.value || []).clone();

        function Cell(props) {

            const index = props.index;
            const value = props.value;
            const array = props.array;

            const f: Field = new Field((c: Column) => {
                c.enumerate = props.field.config.enumerate;
                c.type = props.field.type.type;
                c.key = props.field.key + "_" + index;
                c.name = props.field.name;
            });

            f.set(value);

            f.onChange.listen(props.parent, () => {
                array[index] = f.value;
                props.field.value = array;
            });

            return <td>
                <FCtrl
                    field={f}
                    value
                    style={{width: "100%"}}
                />
            </td>;
        }

        //
        return <table className="c-field-list">
            <tbody>{
                Utils.forEach(this.field.value, (row: any | [], rowIndex: number) =>
                    <tr key={rowIndex}>

                        <Cell parent={this} value={row} index={rowIndex} array={this.array} field={this.field}/>

                        <td style={{width: "20px"}}>
                            <Link
                                icon={Icon.MINUS_SQUARE}
                                onClick={(e) => {
                                    this.array.splice(rowIndex, 1);
                                    this.field.value = this.array;
                                    this.forceUpdate();
                                }}/>
                        </td>
                    </tr>)
            }
            <tr>
                <td/>
                <td className="c-field-list-data">
                    <Link
                        icon={Icon.PLUS_SQUARE}
                        onClick={(e) => {
                            this.array.push(null);
                            this.field.value = this.array;
                            this.forceUpdate();
                        }}/></td>
            </tr>
            </tbody>
        </table>
    }
}