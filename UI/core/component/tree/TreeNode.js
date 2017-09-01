// @flow
'use strict';

import Tree from './Tree';
import TreeElement from "./TreeElement";
import {Icon} from "../glyph/Icon";

export default class TreeNode extends TreeElement {

    id: string;
    name: string;
    render: () => any;
    index: number = 0; // pozycja elementu względem rodzica
    icon: ?Icon | ?string = null; // ikona font awesome
    children: TreeNode[] = [];
    level: number = 0;
    expanded: boolean = false;
    parent: ?TreeNode;
    checkbox: boolean = false;
    tree: Tree;
    visible = true;
    _hidden: ?boolean = null; // boolean, ukryte na skutek filtrowania
    _found: boolean = false; // znaleziono frazę
    checked: ?boolean = false;
    selected: boolean = false;
    //--------------------------------------

    tHeader: HTMLElement;
    tUl: HTMLUListElement;

    //-----------------------------
    onClick: ?(e: MouseEvent) => void;

    /**
     *
     * @param {TreeNode} parent
     * @param {string} id
     * @param {string} name
     */
    constructor(parent: Tree | TreeNode, id: string, name: string) {
        super();
        this.id = id;
        this.name = name;
        this.index = parent ? parent.children.length : 0;
        this.parent = parent instanceof TreeNode ? parent : null;
        this.tree = parent instanceof Tree ? parent : parent.tree;
        this.checkbox = this.tree.checkboxes;

        let p = parent;
        while (p && p !== this.tree) {
            ++this.level;
            p = p.parent;
        }

        if (parent && parent.children)
            parent.children.push(this);

        if (id)
            this.expanded = this.tree._expanded.contains(id);
    }

    select(): void {
        if (!this.tree.selectMultiple) {
            this.tree.selected.forEach(node => {
                node.tHeader && node.tHeader.removeAttribute("selected");
                node.selected = false;
            });
            this.tree.selected.length = 0;
        }
        this.selected = true;
        this.tHeader.setAttribute("selected", "true");
        this.tree.selected.push(this);
    }

    toString(): string {
        return this.name;
    }

}
