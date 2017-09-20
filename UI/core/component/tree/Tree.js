// @flow
'use strict';

import React from 'react';
import TreeNode from './TreeNode';
import DragAndDropContext from "../DragAndDrop/DragAndDropContext";
import TreeElement from "./TreeElement";
import {VarArray} from "../../Var";
import Similarity from "../../utils/Similarity";

export class SearchData {
    similarity: Similarity;
    matched: boolean;
    distance: number;
    expanded: boolean;
    visible: boolean;
}

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
        value = (value || "").trim();

        const similarity: Similarity = new Similarity();
        const empty = !value;

        if (!empty) {
            this.visit((item: TreeNode) => similarity.add(item, [item.name]));
            similarity.search(value);
        }

        this.visit((item: TreeNode) => {

            if (item.selected) {
                let it = item;
                while (it = it.parent) it.expanded = true;
            }

            const sd: SearchData = item._search = empty ? null : new SearchData();
            if (empty) return;

            const res = similarity.results.get(item);
            sd.similarity = similarity;
            sd.matched = !!res;
            sd.visible = sd.matched;
            sd.expanded = sd.matched;

            if (sd.matched) {
                // ustaw wszystkie nadrzędne gałęzie jako widoczne
                let it = item;
                while (it = it.parent) {
                    it._search.visible = true;
                    it._search.expanded = true;
                }
            }
            /*
                        ++total;
                        item._found = false;
                        const matched = !empty && similarity.results.has(item);
                        if (matched) ++found;
                        item._found = matched;
                        // if (item.parent && item.parent._hidden === false) {
                        //     item._hidden = false;
                        //     return;
                        // }

                        item._hidden = empty ? null : !matched;

                        let it = item.parent;
                        while (it) {
                            if (item._hidden === false)
                                it._hidden = null;
                            it = it.parent;
                        }
            */
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