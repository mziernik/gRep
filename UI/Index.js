// @flow
import "./core/Bootstrap";
import "./core/utils/ErrorHandler";
import "./core/core";
import Header from "./page/main/Header";
import NavBar from "./page/main/NavBar";
import PageContainer from "./core/page/PageContainer";
import StatusBar from "./page/main/StatusBar";
import "./page/Router";
import Login from "./page/Login";
import './page/main/Layout.css';

import {React, Application, API} from "./core/core";
import {PERMISSIONS} from "./core/repository/impl/PermissionRepo";
import "./model/Repositories";
import StatusHint from "./core/component/application/StatusHint";
import RepositoryStorage from "./core/repository/storage/RepositoryStorage";
import * as Model from "./model/Model";
import {SignalRTransport} from "./core/webapi/Transport";
import WebApi from "./core/webapi/WebApi";
import GrepApi from "./model/GrepApi";
import CoreConfig from "./core/config/CoreConfig";
import {DEV_MODE} from "./core/Dev";


window.addEventListener("load", () => {

        CoreConfig.api.wsUrl.defaultValue = "http://localhost:80/api";

        const api: GrepApi = new GrepApi(new WebApi(null));
        API.set(api, api.repository);

        Model.init();

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

