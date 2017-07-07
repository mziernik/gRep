// @flow
'use strict';

import {React, PropTypes} from "../../core.js";
import {Component} from "../../components.js";
import DragAndDropContext from "./DragAndDropContext";
import DragAndDropItem from "./DragAndDropItem";


export default class DragAndDrop extends Component {

    constructor() {
        super(...arguments);
    }

    render() {

        if (typeof this.props.children !== "object")
            throw new Error("Wymagany pojedynczy obiekt potomny");


        return React.cloneElement(super.renderChildren(), {
            draggable: "true",
            onDragStart: e => new DragAndDropItem(this.props.dnd, this.props.item, this.props.itemIndex, e),
            onDragOver: e => this.props.dnd.dragOver(e),
            onDragEnd: e => this.props.dnd.dragEnd(e, true)
        });
    }

}


DragAndDrop.propTypes = {
    dnd: PropTypes.instanceOf(DragAndDropContext).isRequired,
    item: PropTypes.any.isRequired,
    itemIndex: PropTypes.number.isRequired
};



