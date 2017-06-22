// @flow
'use strict';

import React from 'react';
import Component from "../../core/component/Component";
import Alert from "../../core/component/alert/Alert";
import Endpoint from "../../core/application/Endpoint";
import Link from "react-router-dom/es/Link";
import Delayed from "../../core/utils/Delayed";


const delayed: Delayed = new Delayed();

export default class NavBar extends Component<*, *, *> {

    constructor() {
        super(...arguments);
        Endpoint.onChange.listen(this, () => delayed.call(() => this.forceUpdate(), 100))
    }

    render() {
        function draw(pages: Endpoint[]) {
            return pages.map((page: Endpoint, idx: number) =>
                page._hidden || (page._parent && pages === Endpoint.all) ? null :
                    <li key={idx}>
                        { page.hasLink() ? <Link to={page.getLink()}>{page._name}</Link> : <a>{page._name}</a> }
                        {page._children.length ? <ul>
                            {draw(page._children)}
                        </ul> : null}
                    </li>
            )
        }


        return (
            <nav style={{}} id="app-navbar">
                <ul>
                    {draw(Endpoint.all)}
                </ul>
            </nav>
        );
    }
}



