// @flow
'use strict';

//FixMe Poprawić
//ToDo Możliwość dodania spinnera do konrolek (np do przycisku)


import {React, PropTypes} from "../core";


let layer = null;
const list: Spinner[] = [];
let showTimeout;
let style: HTMLStyleElement;

export default class Spinner {

    dark: boolean = true;

    constructor(dark: boolean) {
        this.dark = dark;
        if (!style) {
            style = createCSS();
            style.onload = (e) => setTimeout(() => this._build(this));
        } else
            setTimeout(() => this._build(this));
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


    _build() {

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
                layer.style.backgroundColor = "rgba(50, 50, 50, 0.4)";
                spinner.style.opacity = "1";
            }, 100);
        }

        if (list.length === 0)
            document.body.appendChild(layer);

        list.push(this);
    }

}

function createCSS(): HTMLStyleElement {

    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
    /*# sourceURL=file:///spinner.css*/

    .spinner-layer{
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 1000;
        transition: all 3s;
        background-color: rgba(150, 150, 150, 0);
    }
    
        
    .spinner {
        transition: all 3s;
        opacity: 0;
        width: 80px;
        height: 80px;
        left: 50%;
        top: 50%;
        margin: -40px;
        position: fixed;
    }

    .spinner > div {    
        width: 100%;
        height: 100%;
        position: absolute;
 
        left: 0;
        top: 0;
    }

    .spinner > div:before {
        content: '';
        display: block;
        margin: 0 auto;
        width: 15%;
        height: 15%;       
        border-radius: 100%;
        animation: spinner-anim 1.2s infinite ease-in-out;
    }
    
    .spinner[dark=true] > div:before { 
        background-color: #333; 
        border: 1px solid #555;
    }
    .spinner[dark=false] > div:before { 
        background-color: #ccc;
        border: 1px solid #aaa;
    }
       
    .spinner > div:nth-child(02) { transform: rotate(30deg);  }
    .spinner > div:nth-child(03) { transform: rotate(60deg);  }
    .spinner > div:nth-child(04) { transform: rotate(90deg);  }
    .spinner > div:nth-child(05) { transform: rotate(120deg); }
    .spinner > div:nth-child(06) { transform: rotate(150deg); }
    .spinner > div:nth-child(07) { transform: rotate(180deg); }
    .spinner > div:nth-child(08) { transform: rotate(210deg); }
    .spinner > div:nth-child(09) { transform: rotate(240deg); }
    .spinner > div:nth-child(10) { transform: rotate(270deg); }
    .spinner > div:nth-child(11) { transform: rotate(300deg); }
    .spinner > div:nth-child(12) { transform: rotate(330deg); }
    .spinner > div:nth-child(02):before { animation-delay: -1.1s; }
    .spinner > div:nth-child(03):before { animation-delay: -1.0s; }
    .spinner > div:nth-child(04):before { animation-delay: -0.9s; }
    .spinner > div:nth-child(05):before { animation-delay: -0.8s; }
    .spinner > div:nth-child(06):before { animation-delay: -0.7s; }
    .spinner > div:nth-child(07):before { animation-delay: -0.6s; }
    .spinner > div:nth-child(08):before { animation-delay: -0.5s; }
    .spinner > div:nth-child(09):before { animation-delay: -0.4s; }
    .spinner > div:nth-child(10):before { animation-delay: -0.3s; }
    .spinner > div:nth-child(11):before { animation-delay: -0.2s; }
    .spinner > div:nth-child(12):before { animation-delay: -0.1s; }

    @-webkit-keyframes spinner-anim {
        0%, 39%, 100% { opacity: 0; }
        40% { opacity: 1; }
    }

    @keyframes spinner-anim {
        0%, 39%, 100% { opacity: 0; }
        40% { opacity: 1; } 
    }
        `;
    document.head.appendChild(style);
    return style;
}