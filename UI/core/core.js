/**
 * Plik eksportuje listę modułów core-oweych.
 * Użycie: import {React, AppStatus, Page, PageTitle} from "./core/exports";
 */

import * as Check from "./utils/Check";
export {Check};

import * as Utils from "./utils/Utils";
export {Utils};

import * as If from "./utils/If";
export {If};


export {default as EError} from "./utils/EError";

import * as ReactUtils from "./utils/ReactUtils";
export {ReactUtils};


export {default as Exception} from "./utils/Exception";

export {default as Debug} from "./Debug";
export {default as DOMPrototype} from "./utils/DOMPrototype";
export {default as ErrorHandler} from  "./utils/ErrorHandler";

export {default as Trigger} from "./utils/Trigger";
export {default as Dispatcher} from "./utils/Dispatcher";

// ------------------ React ------------------------------
export {default as React} from 'react';
export {default as ReactDOM} from 'react-dom';
export {default as PropTypes} from 'prop-types';


// -------------------- Aplikacja ---------------------------------
import * as Type from"./repository/Type";
export {Type};

import * as CRUDE from "./repository/CRUDE";
export {CRUDE};

export {default as Application} from "./application/Application";
export {EventType} from "./application/Event";
export {default as AppEvent} from "./application/Event";
export {default as AppStatus} from "./application/Status";

export {default as Endpoint} from "./application/Endpoint";
export {default as AppNode} from "./application/Node";


// --------------------- moduły ------------------------------

export {default as Repository} from "./repository/Repository";
export {default as Record} from "./repository/Record";
export {default as Field} from "./repository/Field";
export {default as Column} from "./repository/Column";
export {RepoConfig} from "./repository/Repository";

import * as ContextObject from "./application/ContextObject";
export {ContextObject};

export {default as Store} from "./Store";
