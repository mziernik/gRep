import React from 'react';

import {Route, BrowserRouter, Link, Redirect, Switch, Miss} from 'react-router-dom';

import NotFound from "./NotFound";
import Dashboard from "./dashboard/Dashboard";
import Endpoint from "../core/application/Endpoint";
import "../core/page/dev/PDev";
import PDev from "../core/page/dev/PDev";
import PCatalogs from "./PCatalogs";


export const CATALOGS = new Endpoint("Katalog", "/cat/:id", PCatalogs).defaultParams({id: "all"});
export const DASHBOARD = new Endpoint("Dashboard", "/", Dashboard);
export const DEV = new PDev("/dev");

export const NOT_FOUND = Endpoint.NOT_FOUND = new Endpoint("Nie znaleziono...", "*", NotFound).hidden(true)


Endpoint.homePage = DASHBOARD;


