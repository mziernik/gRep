// @flow
'use strict';

import React from 'react';
import Page from "../core/page/Page";

export default class NotFound extends Page {

    render() {
        return <div style={{
            marginTop: "10%",
            textAlign: "center",
            fontSize: "20pt",
            fontWeight: "bold",
            color: "#c00"
        }}>
            <span>Nie znaleziono strony "{this.props.location.pathname.substring(1)}"</span>
        </div>
            ;
    }
}

