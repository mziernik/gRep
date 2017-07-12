// @flow
'use strict';

import {React, PropTypes, EventType} from "../core";
import {Component, Page} from "../components";
import "./components.css";

export class TitleBar extends Component {

    static propTypes = {
        page: PropTypes.instanceOf(Page).isRequired,
        title: PropTypes.string.isRequired,
        toolbar: PropTypes.func,
    };

    render() {

        const page: Page = this.props.page;

        const items = this.props.toolbar ? this.props.toolbar() : null;

        return <div className="c-title-bar">
            {page.endpoint._icon ? <span className={"c-title-bar-icon " + page.endpoint._icon }/> : null  }
            <h5>{this.props.title}</h5>

            <span style={{flex: "auto"}}/>

            {items}

            <hr style={ {marginTop: "0"} }/>
        </div>
    }
}
