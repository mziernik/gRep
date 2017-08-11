import {React} from '../../../core/core.js';
import AbstractWidget from "./AbstractWidget";
import Moment from "moment";

export default class ClockWidget extends AbstractWidget {

    constructor() {
        super("clock", "Zegar", true);
        window.setInterval(() => this.update(), 1000);
        this.x = 1;
        this.y = 2;
        this.w = 1;
        this.h = 1;
    }

    render() {
        const now: Date = new Date();

        let moment = Moment();
        moment.locale('pl');

        return <div style={{fontSize: "2em", textAlign: "center", fontWeight: "bold"}}>
            <div>{moment.format("D MMMM YYYY")}</div>
            <div>{moment.format("HH:mm:ss")}</div>
        </div>
    }
}