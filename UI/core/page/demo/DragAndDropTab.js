//@Flow
'use strict';
import {React, Field, Type, FieldConfig, Utils} from '../../core';
import {Component, Page, Icon, FCtrl}    from        '../../components';



export default class DragAndDropTab extends Component {


    render() {
        return <div onDragOver={e => {
            if (this.drag)
                e.preventDefault()
        }}
                    onDrop={(e) => {
                        if (!this.drag)return false;
                        e.preventDefault();
                        e.currentTarget.appendChild(this.drag);
                        this.drag = null;
                    }}
                    style={{height: '400px', border: '1px solid white'}}>
            <div style={{border: '1px solid black'}}>
                <div draggable
                     style={{color: 'white', backgroundColor: '#008dff', padding: '5px'}}
                     className={Icon.ARROWS_ALT}
                     onDragStart={(e) => {
                         this.drag = e.currentTarget.parentElement;
                     }}
                />
                <input type="text"/>
                Jakaś tam zawartość
            </div>
            <div onDragOver={(e) => {
                if (this.drag) e.preventDefault()
            }}
                 onDrop={(e) => {
                     if (!this.drag)return false;
                     e.preventDefault();
                     e.currentTarget.parentElement.insertBefore(this.drag, e.currentTarget);
                     this.drag = null;
                     e.stopPropagation();
                 }} style={{border: '1px solid gray'}}>
                <spna>coś</spna>
                <input type="text"/></div>
        </div>
    }


}

