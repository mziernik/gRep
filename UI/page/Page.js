// @flow
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Debug from "../core/Debug";
import Notify from "../core/Notify";
import Component from "../core/Component";
import Events from "../model/Events";

export default class Page extends Component {

    title: string;

    constructor(title: string) {
        super(...Array.prototype.slice.call(arguments, 1)); // pomiń pierwszy argument
        this.title = title;
        Debug.log(this, "Create");
    }


    componentWillReceiveProps() {
        Debug.log(this, "componentWillReceiveProps");
    }

    shouldComponentUpdate() {
        Debug.log(this, "shouldComponentUpdate");
        return true;
    }

    componentDidUpdate() {
        Debug.log(this, "componentDidUpdate");
    }

    componentWillMount() {
        Debug.log(this, "componentWillMount");
        Events.HEADER_TITLE.send(this, this.title);
    }

    render(): any {
        Debug.log(this, "Render");
    }

    componentDidMount() {
        Debug.log(this, "componentDidMount");
    }

    componentWillUnmount() {
        Debug.log(this, "componentWillUnmount");
    }

    setState() {
        Debug.log(this, "setState");
    }

    forceUpdate() {
        Debug.log(this, "forceUpdate");
    }
}



