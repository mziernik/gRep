import {React} from '../../../core/core.js';
import AbstractWidget from "./AbstractWidget";

export default class MessagesWidget extends AbstractWidget {

    constructor() {
        super("message", "Wiadomości", true);
        this.grid = {x: 0, y: 0, w: 1, h: 1};
    }

    render() {
        return <div>
           Nieprzeczytanych wiadomości: 0
        </div>
    }
}
