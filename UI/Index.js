// @flow
'use strict';

import "./core/utils/ErrorHandler";
import "./model/API";
import Header from "./page/main/Header";
import NavBar from "./page/main/NavBar";
import PageContainer from "./core/page/PageContainer";
import StatusBar from "./page/main/StatusBar";
import "./page/Router";
import Login from "./page/Login";
import './core/component/bootstrap/bootstrap.min.css';
import'./page/main/Layout.css';

import {React, Application, Utils, Repository, Store} from "./core/core";
import {PERMISSIONS} from "./core/repository/PermissionRepo";

import "./model/Repositories";
import StatusHint from "./core/component/application/StatusHint";
import RepositoryStorage from "./core/repository/storage/RepositoryStorage";
import * as Model from "./model/Model";
// nie renderuj tytułów stron
//PageTitle.renderer = () => null;

window.addEventListener("load", () => {


        PERMISSIONS.refresh();

        Login.display((user) => {
            Model.init();
            RepositoryStorage.loadData();

            Application.render(<Header/>, "#app-header");
            Application.render(<NavBar/>, "#app-navbar");
            Application.render(<PageContainer/>, "#app-pages-container");
            Application.render(<StatusBar/>, "#app-status-bar");
            Application.render(<StatusHint/>, "#app-status-hint");
        })
    }
);

