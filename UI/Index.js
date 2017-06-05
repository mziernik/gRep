// @flow
'use strict';

import Header from "./page/main/Header";
import NavBar from "./page/main/NavBar";
import Container from "./page/main/Container";
import StatusBar from "./page/main/StatusBar";

import "./page/Router";

// ==================================== inicjalizacja modułów ====================================

import Login from "./page/Login";
import './core/component/bootstrap/bootstrap.min.css';
import'./page/main/Layout.css';
import TitleBar, {Status} from "./page/main/TitleBar";

// ==================================== inicjalizacja aplikacji ====================================

import {React, Application, Utils, AppStatus, Repository, Store} from "./core/core";
import {PageTitle} from "./core/components";
import {PERMISSIONS} from "./core/repository/PermissionRepo";
import * as API from "./model/API";

PageTitle.renderer = (sender: PageTitle) => {
    TitleBar.setTitle(sender);
    return null;
};

AppStatus.factory = (context: any) => new Status();


window.addEventListener("load", () => {

        PERMISSIONS.refresh();

        Utils.forEach(Repository.all, (repo: Repository) => {
            repo.storage.store(Store.local);
            repo.storage.load();
        });

        API.initialize();

        Login.display((user) => {
            Application.render(<Header/>, "#app-header");
            Application.render(<NavBar/>, "#app-navbar");
            Application.render(<TitleBar/>, "#app-title");
            Application.render(<Container/>, "#app-container")
            Application.render(<StatusBar/>, "#app-status-bar");
        })
    }
);

