/// @flow
'use strict';

import {EventType} from "../core/Event";

export default {
    HEADER_TITLE: new EventType("Tytuł podstrony"),
    STATUS_BAR_TEXT: new EventType("Treść paska statusu"),
    WEB_API_STATUS: new EventType("Status połączenia WebApi"),
}