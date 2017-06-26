//@Flow
'use strict';
import {React, Field, Type, FieldConfig, Utils} from '../../core';
import {Component, Page, FontAwesome, FieldComponent, FieldController} from '../../components';
import JsonViewer from "../../component/JsonViewer";


export default class Lists extends Component {

    constructor() {
        super(...arguments);
        this.state = {selectedTab: 0};
        Utils.forEach(DATA, (field: Field) =>
            field.onChange.listen(this, e => (this.viewer && this.viewer.update(getDTO()))));
    };


    render() {
        return <div style={{display: "flex"}}>
            <table>
                <tbody>

                {Object.keys(DATA).map((prop, index) => {
                    let field = DATA[prop];
                    return <tr key={index}>
                        <td style={{width: '20px'}}>
                            <FieldController field={field}
                                             handleRequired={true}
                                             handleDescription={true}
                                             defReq={<span className={FontAwesome.ASTERISK}
                                                           style={{color: '#ff6e00'}}/>}
                                             defDesc={<span className={FontAwesome.QUESTION_CIRCLE}
                                                            style={{color: '#0071ff'}}/>}
                            />
                        </td>

                        <td style={{padding: "4px"} }>{field.name}</td>

                        <td style={{paddingLeft: "20px"}}>
                            <FieldComponent field={field} fieldCtrl={false} checkBoxLabel={true}
                                            preview={false}/>
                        </td>
                        <td >
                            <FieldController field={field} handleFieldError={true}/>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>

            <div style={{display: "auto", padding: "8px"}}>
                <div>DTO:</div>
                <JsonViewer object={getDTO()} instance={e => this.viewer = e}/>
            </div>

        </div>
    }

}
const FRUITS = {
    orange: "Pomarańcza",
    apple: "Jabłko",
    raspberry: "Malina",
    banana: "Banan"
};

const DATA = {

    FRUIT_SET: new Field((fc: FieldConfig) => {
        fc.type = new Type.SetDataType(Type.STRING);
        fc.key = "fruitSet";
        fc.name = 'Zbiór owoców';
        fc.description = "Zbiór: Wybór wielu elementów bez powtórzeń";
        fc.enumerate = () => FRUITS;
    }),

    FRUIT_LIST: new Field((fc: FieldConfig) => {
        fc.type = new Type.ListDataType(Type.STRING);
        fc.key = "fruitList";
        fc.name = 'Lista owoców';
        fc.description = "Lista: Wybór wielu elementów z powtórzeniami";
        fc.enumerate = () => FRUITS;
    }),

    FRUIT_LIST_SET: new Field((fc: FieldConfig) => {
        fc.type = new Type.ListDataType(new Type.SetDataType(Type.STRING));
        fc.key = "fruitListSet";
        fc.name = 'Lista zbiorów owoców';
        fc.description = "Lista zbiorów: Wybór wielu zbiorów elementów bez powtórzeń";
        fc.enumerate = () => FRUITS;
        fc.defaultValue = [["orange"], ["orange", "apple"]];
    }),

    FRUIT_LIST_List: new Field((fc: FieldConfig) => {
        fc.type = new Type.ListDataType(new Type.ListDataType(Type.STRING));
        fc.key = "fruitListList";
        fc.name = 'Lista list owoców';
        fc.description = "Zagnieżdżone listy";
        fc.enumerate = () => FRUITS;
    })
}


function getDTO(): any {
    const dto = {};
    Utils.forEach(DATA, (field: Field) => dto[field.key] = field.value);
    return dto;
}