import React from 'react';

import {Route, BrowserRouter, Link, Redirect, Switch, Miss} from 'react-router-dom';

import NotFound from "./NotFound";
import Dashboard from "./dashboard/Dashboard";
import PageDef from "../core/application/PageDef";
import "../core/page/dev/PDev";
import PDev from "../core/page/dev/PDev";

export const DASHBOARD = new PageDef("Dashboard", "/", Dashboard);

export const DEV = new PDev("/dev");

export const NOT_FOUND = PageDef.NOT_FOUND = new PageDef("Nie znaleziono...", "*", NotFound).hidden(true);


PageDef.homePage = DASHBOARD;


