// @flow
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Link, Redirect, Switch, Miss} from 'react-router-dom';
import Component from "../../core/Component";
import API from "../../model/API";
import Alert from "../../core/Alert";


export default class NavBar extends Component<*, *, *> {

    constructor() {
        super(...arguments);
    }

    render() {

        return (

            <nav style={{}} id="app-navbar">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">Informacje</Link></li>
                    <li><Link to="/user">Użytkownik</Link></li>
                    <li>
                        <button onClick={() => API.grep()}> Grep</button>
                    </li>

                    <li>
                        <button onClick={() => Alert.error(this, "Testowy błąd") }>Alert</button>
                    </li>
                </ul>
            </nav>


        );
    }
}
