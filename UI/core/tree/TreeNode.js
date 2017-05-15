// @flow
'use strict';

import Tree from './Tree';

export default class TreeNode {

    id: string;
    name: string;
    index: number = 0; // pozycja elementu względem rodzica
    icon: ?string = null; // ikona font awesome
    children: TreeNode[] = [];
    level: number = 0;
    expanded: boolean = false;
    parent: ?TreeNode;
    checkbox: boolean = false;
    tree: Tree;
    visible = true;
    found: ?boolean = null; // boolean, ukryte na skutek filtrowania
    checked: ?boolean = false;
    selected: boolean = false;
    //--------------------------------------

    tHeader: HTMLElement;
    tUl: HTMLUListElement;


    /**
     *
     * @param {TreeNode} parent
     * @param {string} id
     * @param {string} name
     */
    constructor(parent: Tree | TreeNode, id: string, name: string) {
        this.id = id;
        this.name = name;
        this.index = parent ? parent.children.length : 0;
        this.parent = parent instanceof TreeNode ? parent : null;
        this.tree = parent instanceof Tree ? parent : parent.tree;
        this.checkbox = this.tree.checkboxes;

        if (parent && parent.children)
            parent.children.push(this);
    }

    select(): void {
        if (!this.tree.selectMultiple) {
            this.tree.selected.forEach(node => {
                node.tHeader.removeAttribute("selected");
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
