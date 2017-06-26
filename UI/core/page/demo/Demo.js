//@Flow
'use strict';
import {React, Field, Type, FieldConfig, Utils} from '../../core';
import {Page, FontAwesome, FieldComponent, FieldController, Panel} from '../../components';
import {Tab, TabSet} from '../../component/TabSet';
import ListsTab from "./ListsTab";
import FormTab from "./FormTab";
import DragAndDropTab from "./DragAndDropTab";
import PageTitle from "../../component/application/PageTitle";
import TablesTab from "./TablesTab";

export default class Demo extends Page {

    constructor() {
        super(...arguments);
        this.state = {selectedTab: 0};
    };

    render() {
        return (
            <Panel fit>
                <PageTitle>Demo</PageTitle>

                <TabSet selectedIndex={this.state.selectedTab}>
                    <Tab title="Formularz"
                         label={<span><span className={FontAwesome.USER_CIRCLE_O}/><span>Formularz</span></span>}>
                        <FormTab/>
                    </Tab>
                    <Tab title="Listy"
                         label={<span><span className={FontAwesome.LIST}/><span>Listy</span></span>}>
                        <ListsTab/>
                    </Tab>
                    <Tab label="ReactTable">
                        <TablesTab/>
                    </Tab>
                    <Tab label="Drag&Drop">
                        <DragAndDropTab/>
                    </Tab>
                    <Tab label="Dodatkowe Opcje">
                        <div>różne opcje</div>
                    </Tab>
                    <Tab label="Extra" hidden={true}>
                        <div>Jakaś tam zawartość 4</div>
                    </Tab>
                    <Tab disabled={true} label="Zakładka">
                        <div>Jakaś tam zawartość 5</div>
                    </Tab>
                    <Tab label="Ostateczna zakładka "
                         onSelect={(e, i) => console.log('Zakładka: ' + i)}>
                        <div>Jakaś tam zawartość 6</div>
                    </Tab>
                </TabSet>
            </Panel>);
    }

}
