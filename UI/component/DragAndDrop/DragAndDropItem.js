// @flow
'use strict';

import SyntheticDragEvent from 'react-dom/lib/SyntheticDragEvent';
import DragAndDropContext from "./DragAndDropContext";


export default class DragAndDropItem {

    srcContext: DragAndDropContext;
    dstContext: ?DragAndDropContext = null;
    item: any;
    element: HTMLElement;
    itemIndex: number;
    placeholder: HTMLElement;
    dataTransfer: DataTransfer;


    /**
     *
     * @param {DragAndDropContext} context
     * @param item
     * @param {number} itemIndex
     * @param {SyntheticDragEvent} e
     */
    constructor(context: DragAndDropContext, item: any, itemIndex: number, e: SyntheticDragEvent) {
        "use strict";

        this.srcContext = context;
        this.item = item;
        this.element = e.currentTarget;
        this.itemIndex = itemIndex;
        this.placeholder = context.createPlaceholder(item, e);
        this.dataTransfer = e.dataTransfer;
        DragAndDropContext.setCurrent(this);

        Object.preventExtensions(this);

        context.setStatus(`Rozpoczynam przeciąganie "${context.getItemName(item) || ""}"`);

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("text", "");
    }


    toString() {
        return this.srcContext.getItemName(this.item);
    }
}
