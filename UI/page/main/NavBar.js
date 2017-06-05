// @flow
'use strict';

import React from 'react';
import Component from "../../core/component/Component";
import Alert from "../../core/component/alert/Alert";
import PageDef from "../../core/application/PageDef";
import Link from "react-router-dom/es/Link";


export default class NavBar extends Component<*, *, *> {

    constructor() {
        super(...arguments);
    }

    render() {
        function draw(pages: PageDef[]) {
            return pages.map((page: PageDef, idx: number) =>
                page._hidden || (page._parent && pages === PageDef.all) ? null :
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
                    {draw(PageDef.all)}
                    <li>
                        <button onClick={() => Alert.error(this, "Testowy błąd") }>Alert</button>
                    </li>
                    <li>
                        <button onClick={() => Tasks.test()}>DTO</button>
                    </li>

                    <li>
                        {/*<UserPreview/>*/}
                    </li>
                </ul>

            </nav>


        );
    }
}



