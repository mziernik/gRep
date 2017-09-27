import React from 'react';

import {Route, BrowserRouter, Link, Redirect, Switch, Miss} from 'react-router-dom';

import NotFound from "./NotFound";
import Dashboard from "./dashboard/Dashboard";
import Endpoint from "../core/application/Endpoint";
import PCatalogs from "./PCatalog";
import DevRouter from "../core/page/dev/DevRouter";


export const CATALOGS = new Endpoint("catalog", "Katalog", "/cat/:id", PCatalogs).defaultParams({id: "all"});
export const DASHBOARD = new Endpoint("dashboard", "Dashboard", "/", Dashboard);
export const DEV = new DevRouter("/dev");

export const NOT_FOUND = Endpoint.NOT_FOUND = new Endpoint("notFound", "Nie znaleziono...", "*", NotFound).hidden(true)


Endpoint.homePage = DASHBOARD;


