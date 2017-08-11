import {React} from '../../../core/core.js';
import AbstractWidget from "./AbstractWidget";

export default class NotificationsWidget extends AbstractWidget {

    constructor() {
        super("notify", "Powiadomienia", true);
        this.grid = {x: 0, y: 0, w: 1, h: 1};
    }

    render() {
        return <div>
            Brak powiadomień
        </div>

    }
}