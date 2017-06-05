// @flow
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import DragAndDropContext from "./DragAndDropContext";
import DragAndDropItem from "./DragAndDropItem";


export default class DragAndDrop extends React.Component {

    constructor() {
        super(...arguments);
    }

    render() {

        if (typeof this.props.children !== "object")
            throw new Error("Wymagany pojedynczy obiekt potomny");


        return React.cloneElement(this.props.children, {
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



