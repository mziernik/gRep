// @flow
'use strict';

import {React, Endpoint, Trigger} from "../../core/core";
import {Component, Panel} from "../../core/components";
import Link from "react-router-dom/es/Link";
import Tree from "../../core/component/tree/Tree";
import CTree from "../../core/component/tree/CTree";
import TreeNode from "../../core/component/tree/TreeNode";
import TreeElement from "../../core/component/tree/TreeElement";
import {EndpointLink} from "../../core/application/Endpoint";
import * as Utils from "../../core/utils/Utils";

const trigger: Trigger = new Trigger();

export default class NavBar extends Component<*, *, *> {

    constructor() {
        super(...arguments);
        Endpoint.onChange.listen(this, () => trigger.call(() => this.forceUpdate(), 100))
    }

    render() {

        const tree = new Tree("navbar");
        tree.menuMode = true;
        tree.rightIndicator = true;

        const visit = (endp: Endpoint, node: TreeElement) => {
            if ((node === tree && endp._parent) || endp._hidden)
                return;

            const tn: TreeNode = node.node(endp._name, endp._name);
            //   tn.render = children => endp.hasLink() ? <Link to={endp.getLink()}>{children}</Link> : <a>{children}</a>;
            tn.icon = endp._icon;
            tn.onClick = (e: MouseEvent) => endp.navigate(null, e);

            endp._children.forEach((e: Endpoint) => {
                visit(e, tn);
            });
        };

        Endpoint.ALL.forEach((endp: Endpoint) => visit(endp, tree));


        return (
            <Panel scrollable resizable east noPadding id="app-navbar">
                <CTree key={Utils.randomId()} data={tree}/>
            </Panel>
        );
    }
}



