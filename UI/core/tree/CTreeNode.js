// @flow
'use strict';

import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import PropTypes from 'prop-types';
import DragAndDrop from "../DragAndDrop/DragAndDrop";
import Tree from "./Tree";
import TreeNode from "./TreeNode";


export default class CTreeNode extends React.Component {

    static propTypes = {
        item: PropTypes.instanceOf(TreeNode).isRequired
    };

    item: TreeNode;
    //----------- tagi -----------
    tHeaderLabel: HTMLElement;
    ul: HTMLUListElement;
    expanding: boolean = false;
    tree: Tree;
    dnd: DragAndDrop;
    placeholder: HTMLElement;

    constructor() {
        super(...arguments);
        this.item = this.props.item;
        this.tree = this.item.tree;
        this.dnd = this.tree.dnd;
        this.placeholder = document.createElement("li");
        this.placeholder.className = "placeholder";
    }

    _expand(state: boolean) {
        const item = this.props.item;

        if (typeof state !== "boolean")
            state = !item.expanded;

        item.expanded = state;
        this.expanding = true;
        this.setState({
            expanded: state
        });

        item.select();
    }

    toString() {
        return this.item.name;
    }

    _ulReady(_ul: HTMLUListElement) {
        if (_ul && !(_ul instanceof HTMLUListElement)) return;
        const ul = _ul || this.ul;
        this.ul = _ul;
        this.item.tUl = _ul;
        const state = _ul !== null;
        if (!ul) return;
        // $FlowFixMe
        ul.state = state;

        if (!this.expanding) {
            ul.style.display = ul.state ? "block" : "none";
            return;
        }

        this.expanding = false;

        if (state) {
            ul.style.height = "auto";
            ul.style.opacity = "0";
            ul.style.position = "absolute";
            ul.style.display = "block";
            let h = ul.clientHeight;
            ul.style.height = "0";
            ul.style.position = "";
            ul.style.opacity = "";

            setTimeout(() => {
                ul.style.height = h + "px";
            }, 1);
        } else {
            ul.style.height = ul.clientHeight + "px";
            setTimeout(() => ul.style.height = "0", 1);

        }


        if (!ul.onTransitionEnd)
        // $FlowFixMe
            ul.addEventListener("transitionend", ul.onTransitionEnd = () => {
                ul.style.height = "";
                ul.style.display = ul.state ? "block" : "none";
            }, false);
    }

    render() {
        const item = this.props.item;
        const visible = item.found !== null ? item.found : item.expanded && item.children && item.children.length;

        let ul = visible ?
            <ul ref={ul => this._ulReady(ul)}>
                {item.children.map(item => <CTreeNode key={item.id} item={item}/>)}
            </ul>
            : null;


        return (
            <li data-expanded={item.expanded}

                className="x-tree-node">
                <DragAndDrop dnd={this.dnd} item={item} itemIndex={item.index}>
                    <div className="x-tree-header"
                         ref={tag => this.item.tHeader = tag}
                    >
                        {item.checkbox ? (<input className={"x-tree-checkbox"} type="checkbox"/>) : null}
                        {item.icon ? (<span className={"x-tree-icon fa fa-" + item.icon}/>) : null}
                        <span onClick={this._expand.bind(this)}
                              ref={(span) => this.tHeaderLabel = span}>
                        {item.name} ({item.level})
                    </span>
                    </div>
                </DragAndDrop>
                <CSSTransitionGroup
                    transitionName="x-tree-slide"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
                >
                    {ul}
                </CSSTransitionGroup>
            </li>
        )
    }


}

