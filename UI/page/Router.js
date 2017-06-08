import React from 'react';

import {Route, BrowserRouter, Link, Redirect, Switch, Miss} from 'react-router-dom';

import NotFound from "./NotFound";
import Dashboard from "./dashboard/Dashboard";
import PageDef from "../core/application/Endpoint";
import "../core/page/dev/PDev";
import PDev from "../core/page/dev/PDev";
import Tests from "./Tests";

export const DASHBOARD = new PageDef("Dashboard", "/", Dashboard);
export const TEST = new PageDef("Test", "/test", Tests);
export const DEV = new PDev("/dev");

export const NOT_FOUND = PageDef.NOT_FOUND = new PageDef("Nie znaleziono...", "*", NotFound).hidden(true);


PageDef.homePage = DASHBOARD;


