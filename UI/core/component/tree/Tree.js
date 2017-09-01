// @flow
'use strict';

import React from 'react';
import TreeNode from './TreeNode';
import DragAndDropContext from "../DragAndDrop/DragAndDropContext";
import TreeElement from "./TreeElement";
import {VarArray} from "../../Var";


export default class Tree extends TreeElement {
    children: Array<TreeNode> = [];
    multiple: boolean = false; // zaznacz wiele
    checkboxes: boolean = false;
    selected: Array<TreeNode> = []; // zaznaczone gałęzie
    selectMultiple: boolean = false;
    dnd: TreeDragAndDropContext = new TreeDragAndDropContext();
    _expanded: VarArray = new VarArray();
    rightIndicator: boolean = false;
    menuMode: boolean = false;
    searchable: boolean = false; // szukajka

    constructor(id: string) {
        super();
        if (id)
            this._expanded.localStorage("tree." + id);
    }

    search(value: string) {
        let found = 0;
        let total = 0;

        value = value.toLowerCase().trim();
        const empty = value === "";

        this.visit((item: TreeNode) => {
            ++total;
            item._found = false;

            item._hidden = empty ? null : false;
            if (!empty && item.name.toLowerCase().indexOf(value) >= 0) {
                ++found;
                item._found = true;
                let it = item;
                while (it) {
                    it._hidden = true;
                    it = it.parent;
                }
            }
        })
        // alert("Znaleziono " + found + " z " + total);
    }

    visit(callback: (item: TreeNode) => ?boolean) {
        const visit = (item) => {
            if (!item || !item.children)
                return false;
            for (let i = 0; i < item.children.length; i++) {
                const it = item.children[i];
                if (callback(it) !== false)
                    visit(it);
            }
        };

        visit(this);
        return this;
    }

    generate(count: number) {
        let total = 0;


        function generate(count: number, parent: Tree | TreeNode, level: number) {

            for (let i = 1; i < count; i++) {

                ++total;
                const ti = new TreeNode(parent,
                    // $FlowFixMe
                    parent && parent.id ? parent.id + "_" + i : "id_" + i,
                    // $FlowFixMe
                    parent && parent.name ? parent.name + " " + i : "Gałąź " + i);

                ti.level = level;
                ti.expanded = false;
                ti.icon = i % 4 ? "bolt" : "bath";
                generate(count / (1.2) - 2 - i, ti, level + 1);
            }
        }

        generate(count || 25, this, 0);
        return this;
    }
}


class TreeDragAndDropContext extends DragAndDropContext {
    getItemIndex(element) {

        element = element.parentNode;

        for (var i = 0; i < element.parentNode.children.length; i++)
            if (element.parentNode.children[i] === element)
                return i;
        return null;
    }
}