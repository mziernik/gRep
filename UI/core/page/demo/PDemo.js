//@Flow
'use strict';
import {React, Field, Type, Utils} from '../../core';
import {Page, Icon, FCtrl, Panel} from '../../components';
import {Tab, TabSet} from '../../component/TabSet';
import FormTab from "./FormTab";
import ListsTab from "./ListsTab";
import TablesTab from "./TablesTab";
import DragAndDropTab from "./DragAndDropTab";
import ModalWindowTab from "./ModalWindowTab";
import AlertsTab from "./AlertsPopupTab";
import SplitterTab from "./SplitterTab";
import PopupMenuTab from "./PopupMenuTab";

import "../../repository/DemoRepositories.js";

export default class PDemo extends Page {

    constructor() {
        super(...arguments);
        this.state = {selectedTab: 0};
    };

    render() {
        return <TabSet selectedIndex={this.state.selectedTab}>
            <Tab title="Formularz"
                 label={<span><span className={Icon.USER_CIRCLE_O}/><span>Formularz</span></span>}>
                <FormTab/>
            </Tab>
            <Tab title="Listy"
                 label={<span><span className={Icon.LIST}/><span>Listy</span></span>}>
                <ListsTab/>
            </Tab>
            <Tab label="ReactTable">
                <TablesTab/>
            </Tab>
            <Tab label="Modal Window">
                <ModalWindowTab/>
            </Tab>
            <Tab label="Popup Menu">
                <PopupMenuTab/>
            </Tab>
            <Tab label="Alerty"> <AlertsTab/> </Tab>
            <Tab label="Splitter"><SplitterTab/></Tab>
            <Tab label="Drag&Drop"><DragAndDropTab/></Tab>
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
    }

}

