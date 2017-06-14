// @flow
'use strict';

//FixMe Poprawić
//ToDo Możliwość dodania spinnera do konrolek (np do przycisku)


import {React, PropTypes} from "../core";
import "./spinner.css";

let layer = null;
const list: Spinner[] = [];
let showTimeout;
let style: HTMLStyleElement;

export default class Spinner {

    dark: boolean = true;

    constructor(dark: boolean = true) {
        this.dark = dark;
        if (!layer) {
            layer = document.createElement("div");
            layer.setAttribute("class", "spinner-layer");

            const spinner = document.createElement("div");
            layer.appendChild(spinner);

            spinner.setAttribute("class", "spinner");
            spinner.setAttribute("dark", this.dark);

            for (let i = 0; i < 12; i++)
                spinner.appendChild(document.createElement("div"));

            showTimeout = setTimeout(function () {
                layer.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
                spinner.style.opacity = "1";
            }, 100);
        }

        if (list.length === 0)
            document.body.appendChild(layer);

        list.push(this);
    };


    hide() {
        if (list.length === 0)
            return;

        let idx = list.indexOf(this);
        if (idx >= 0)
            list.splice(idx, 1);

        if (list.length === 0 && layer.parentNode === document.body) {
            document.body.removeChild(layer);
            clearTimeout(showTimeout);
            layer = null;
        }
    };


}

