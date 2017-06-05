// @flow
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import CTreeNode from './CTreeNode';
import style from  './Tree.css';
import DragAndDropContext from "../DragAndDrop/DragAndDropContext";
import Tree from "./Tree";




export default class CTree extends React.Component {

    static propTypes = {
        data: PropTypes.instanceOf(Tree).isRequired
    };

    tree: Tree;


    constructor() {
        super(...arguments);
        this.tree = this.props.data;
    }


    render() {
        let searchTimeout;
        const search = (e) => {
            const value = e.target.value;
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.tree.search(value);
                this.forceUpdate();
            }, 300);
        };

        return (
            <div>
                <style>{style}</style>
                <div>
                    <input type="search" placeholder="Szukaj" onChange={search}/>
                </div>
                <ul className="x-tree">
                    {this.tree.children.map((item) => <CTreeNode key={item.id} item={item}/>)}
                </ul>
            </div>
        );
    }
}


