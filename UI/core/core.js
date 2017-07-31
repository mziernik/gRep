/**
 * Plik eksportuje listę modułów core-oweych.
 * Użycie: import {React, AppStatus, Page, PageTitle} from "./core/exports";
 */

import "./utils/DOMPrototype";

import * as Check from "./utils/Check";

export {Check};

import * as Utils from "./utils/Utils";

export {Utils};
export {default as CustomFilter} from "./utils/CustomFilter";

import * as Is from "./utils/Is";

export {Is};

import {default as Var} from "./Var";

export {Var};


export {LOCAL as LocalStorage} from "./Store";
export {SESSION as SessionStorage} from "./Store";

export {default as EError} from "./utils/EError";
import * as ReactUtils from "./utils/ReactUtils";

export {ReactUtils};

import * as Ready from "./utils/Ready";

export {Ready};

export {default as Exception} from "./utils/Exception";

export {default as Dev, DEV_MODE, TEST_MODE, PROD_MODE} from "./Dev";


export {default as Trigger} from "./utils/Trigger";
export {default as Dispatcher} from "./utils/Dispatcher";

// ------------------ React ------------------------------
export {default as React} from 'react';
export {Component as ReactComponent} from "react";

import * as ReactDOM from 'react-dom';

export {ReactDOM};

//import * as PropTypes from 'prop-types';
export {default as PropTypes} from 'prop-types';


// -------------------- Aplikacja ---------------------------------
import * as Type from "./repository/Type";

export {Type};

import * as CRUDE from "./repository/CRUDE";

export {CRUDE};


export {EventType} from "./application/Event";
export {default as AppEvent} from "./application/Event";
export {default as AppStatus} from "./application/Status";
export {default as Endpoint} from "./application/Endpoint";

// --------------------- moduły ------------------------------

export {default as Repository} from "./repository/Repository";
export {default as Record} from "./repository/Record";
export {default as Field} from "./repository/Field";
export {default as Cell} from "./repository/Cell";
export {default as Column} from "./repository/Column";
export {RepoConfig} from "./repository/Repository";

import * as ContextObject from "./application/ContextObject";

export {ContextObject};

import * as Store from "./Store";

export {Store};


// te moduły muszą być na końcu listy importów bo są powiązane z komponentami
export {default as Application} from "./application/Application";
export {default as AppNode} from "./application/Node";