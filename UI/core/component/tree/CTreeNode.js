// @flow
'use strict';

import {React, PropTypes, Is, Utils} from "../../core";
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
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

    _expand(state: boolean, e: MouseEvent) {
        const item: TreeNode = this.props.item;

        if (typeof state !== "boolean")
            state = !item.expanded;

        if (item.onClick)
            item.onClick(e);

        item.expanded = state;
        this.expanding = true;
        this.setState({
            expanded: state
        });

        if (item.id) {
            if (state)
                this.tree._expanded.push(item.id);
            else
                this.tree._expanded.remove(item.id);
        }
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
        const item: TreeNode = this.props.item;
        const tree: Tree = item.tree;

        if (item._hidden !== null && !item._hidden) return null;

        const childrenVisible = item._hidden !== null ? item._hidden : item.expanded && item.children && item.children.length;

        let ul = childrenVisible ?
            <ul ref={ul => this._ulReady(ul)}>
                {item.children.map(item => <CTreeNode key={Utils.randomId()} item={item}/>)}
            </ul>
            : null;


        let indicator = !item.children.length ? ""
            : "fa fa-caret-" + (item.expanded ? "down" : tree.rightIndicator ? "left" : "right");

        const header =
            <div className="x-tree-header"
                 data-found={item._found ? true : null}
                 style={{paddingLeft: ((item.level + 1) * 20) + "px"}}
                 ref={tag => this.item.tHeader = tag}
                 onClick={e => this._expand(null, e)}
                 title={Utils.forEach(item.path, (node: TreeNode) => node.name).join(" » ")}
            >

                {tree.rightIndicator ? null : <span className={"x-tree-expand-indicator " + indicator}/>}
                {item.checkbox ? (<input className={"x-tree-checkbox"} type="checkbox"/>) : null}
                {item.icon ? <span className={"x-tree-icon " + item.icon}/> : null}

                <span className="x-tree-header-label">
                <span>{Utils.toString(item.name)}</span>
            </span>
                {tree.rightIndicator ? <span className={"x-tree-expand-indicator " + indicator}/> : null}
            </div>;

        return (
            <li data-expanded={item.expanded}
                data-level={item.level}
                className="x-tree-node">
                {/*<DragAndDrop dnd={this.dnd} item={item} itemIndex={item.index}>*/}
                {Is.func(item.render) ? item.render(header) : header}
                {/*</DragAndDrop>*/}
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

