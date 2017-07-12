// @flow
'use strict';
import {React, PropTypes, Field, Column, Utils, Check, Type} from '../../core.js';
import {FormComponent, Link, FCtrl, FontAwesome} from '../../components.js';

export default class Multiple extends FormComponent {

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired
    };

    render() {
        if (!this.field) return null;

        const mtypes: [] = (this.field.type: Type.MultipleDataType).types;

        const array = this.field.value || [];
        while (array.length < mtypes.length)
            array.push(null);

        const value: [] = Check.isArray(this.field.value);
        //ToDo: Przemek
        return <div className="c-multiple-fields" style={{
            display: "flex"
        }}>


            { Utils.forEach(mtypes, (type: Type.DataType, index: number) => {

                const f: Field = new Field((c: Column) => {
                    //    c.enumerate = field.config.enumerate;
                    c.type = type;
                    c.key = this.field.key + "_" + index;
                    c.name = this.field.name;
                });

                f.value = value[index];

                f.onChange.listen(this, () => {
                    const arr = this.field.value;
                    arr[index] = f.value;
                    this.field.value = arr.clone();
                });

                return <FCtrl
                    key={index}
                    field={f}
                    value
                    style={{flex: "auto"}}
                />
            }) }
        </div>
    }
}
