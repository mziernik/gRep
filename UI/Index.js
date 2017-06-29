// @flow
'use strict';

import Header from "./page/main/Header";
import NavBar from "./page/main/NavBar";
import Container from "./page/main/Container";
import StatusBar from "./page/main/StatusBar";
import "./page/Router";
import Login from "./page/Login";
import './core/component/bootstrap/bootstrap.min.css';
import'./page/main/Layout.css';

import {React, Application, Utils, Repository, Store} from "./core/core";
import {PageTitle} from "./core/components";
import {PERMISSIONS} from "./core/repository/PermissionRepo";
import * as API from "./model/API";
import "./model/Repositories";
import StatusHint from "./core/component/application/StatusHint";
import RepositoryStorage from "./core/repository/storage/RepositoryStorage";
// nie renderuj tytułów stron
//PageTitle.renderer = () => null;

window.addEventListener("load", () => {


        PERMISSIONS.refresh();

        Login.display((user) => {
            RepositoryStorage.loadData();

            Application.render(<Header/>, "#app-header");
            Application.render(<NavBar/>, "#app-navbar");
            Application.render(<Container/>, "#app-container");
            Application.render(<StatusBar/>, "#app-status-bar");
            Application.render(<StatusHint/>, "#app-status-hint");
        })
    }
);

