// @flow
'use strict';


import React from 'react';
import Header from "./page/main/Header";
import NavBar from "./page/main/NavBar";
import Utils from './core/utils/Utils';
import Container from "./page/main/Container";
import StatusBar from "./page/main/StatusBar";
import Application from "./core/Application";

// ==================================== inicjalizacja modułów ====================================
import  "./core/utils/DOMPrototype";
import "./core/utils/ErrorHandler";
import Login from "./page/Login";
import AppNode from "./core/Node";
Utils.importHeadStyle(require('./core/bootstrap/bootstrap.min.css'));
Utils.importHeadStyle(require('./page/main/Layout.css'));
Utils.importHeadStyle(require('./core/utils/font-awesome.css'));
Utils.importHeadStyle(require('./core/swal/sweetalert2.css'));

// ==================================== inicjalizacja aplikacji ====================================


Login.display((user) => {
    Application.render(<Header/>, "#app-header");
    Application.render(<NavBar/>, "#app-navbar");
    Application.render(<Container/>); // ten widok będzie podpinany dynamicznie
    //Application.render(<Container/>, "#app-container")
    Application.render(<StatusBar/>, "#app-status-bar");
});




