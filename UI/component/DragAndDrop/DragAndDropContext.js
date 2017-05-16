// @flow
'use strict';

import Notify from "../../core/Notify";
import SyntheticDragEvent from 'react-dom/lib/SyntheticDragEvent';
import DragAndDropItem from "./DragAndDropItem";
import Utils from "../../core/utils/DOMPrototype";

/** * @param {DragAndDropItem} item */
let item: ?DragAndDropItem;

export default class DragAndDropContext {

    constructor() {
        Object.preventExtensions(this);
    }

    /**
     *
     * @param {DragAndDropItem} _item
     */
    static setCurrent(_item) {
        item = _item;
    }


    /**
     *
     * @param {DragAndDropItem}item
     * @param {number}index
     */
    onMoved(item: DragAndDropItem, index: number) {
        alert("Przenioesiono " + Utils.toString(item) + " na pozycję " + index);
    }

    getItemIndex(element: HTMLElement) {
        // $FlowFixMe
        const children: NodeList = element.parentNode.children;
        for (let i = 0; i < children.length; i++)
            if (children[i] === element)
                return i;
        return null;
    }

    setStatus(text: string, timeout: ?number = null) {
        new Notify(this, "info", text, timeout).send();
    }


    dragEnd(e: SyntheticDragEvent, drop: boolean) {
        if (!item || !e) return;

        if (!item.placeholder || !item.placeholder.parentNode)
            return;

        if (drop) {
            const index = this.getItemIndex(item.placeholder);
            if (index == null)
                throw new Error("Item not found");
            this.onMoved(item, index);
        }

        item.placeholder.parentNode.removeChild(item.placeholder);
        this.setStatus("");
    }


    /*
     ondrag:
     ondragend
     ondragenter
     ondragleave
     ondragover
     ondragstart
     ondrop
     null
     */
    /**
     *
     * @param {DragAndDrop} item
     * @param {SyntheticDragEvent} e
     */
    dragOver(e: SyntheticDragEvent) {

        if (!item || !e) return;
        item.dstContext = this;

        e.preventDefault(); // zezwól na przetwarzanie

        const curr = e.currentTarget;

        if (curr === item.element)
            return;


        let next = curr.nextSibling;
        while (next && next === item.placeholder)
            next = item.placeholder.nextSibling;

        let before = ( e.clientY - curr.offsetTop) - (curr.clientHeight / 2) > 0;

        if (item.placeholder.parentNode)
            item.placeholder.parentNode.removeChild(item.placeholder);


        if (!next)
            curr.parentNode.appendChild(item.placeholder);
        else if (before)
            next.parentNode.insertBefore(item.placeholder, next);
        else
            next.parentNode.insertBefore(item.placeholder, curr);


        //this.setStatus(`Przeciągam "${this.getItemName(this.srcItem) || ""}" za "${this.getItemName(item) || ""}"`);
    }

    createPlaceholder(item: DragAndDropItem, e: SyntheticDragEvent) {
        const div: HTMLElement = document.createElement("div");
        // $FlowFixMe
        div.textContent = this.getItemName(item);
        div.style.padding = "4px 8px";
        div.style.border = "2px dashed red";
        div.style.textAlign = "center";

        const dnd = this;
        // $FlowFixMe
        div.ondragover = (e) => {
            e.preventDefault(); // zezwól na przetwarzanie
        }
        // $FlowFixMe
        div.dragdrop = (e) => {
            dnd.dragEnd(e, true);
        }

        return div;
    }


    getItemName(item: DragAndDropItem) {
        if (item && typeof item.toString === "function")
            return item.toString();
        return null;
    }
}


document.addEventListener("dragend", (e: SyntheticDragEvent) => {
    "use strict";

    setTimeout(() => {
        if (item && item.srcContext)
            item.srcContext.dragEnd(e, false);

        if (item && item.dstContext && item.dstContext !== item.srcContext)
            item.dstContext.dragEnd(e, false);

        item = null;
    }, 1);

});
