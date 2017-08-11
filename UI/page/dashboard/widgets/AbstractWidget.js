import {React, ReactComponent, LocalStorage} from '../../../core/core.js';
import Dashboard from "../Dashboard";
import {Dynamic} from "../../../core/component/Component";


let globalIndex = 0;

export default class AbstractWidget extends Dynamic {

    key: string;
    name: string;
    _visible: boolean;
    position: any;
    config: Object;
    _dashboard: Dashboard;
    index: number = globalIndex++;
    grid: Object;

    x: number;
    y: number;
    w: number;
    h: number;

    constructor(key: string, name: string, visible: boolean) {
        super(null);
        this.key = key;
        this._key = key;
        this.name = name;
        this._visible = visible;

    }

    set visible(visible: boolean) {
        this._visible = visible;
        this.save();
        if (this._dashboard)
            this._dashboard.forceUpdate(true);
    }

    get visible(): boolean {
        return this._visible;
    }

    load() {
        const data = LocalStorage.get("widget." + this.key);
        if (!data) return;
        this._visible = data.vis;
        this.position = data.pos;
        this.config = data.cfg;
    }

    save() {
        LocalStorage.set("widget." + this.key, {
            pos: this.position,
            vis: this._visible,
            cfg: this.config
        });
    }

    render() {
        throw new Error("Brak implementacji");
    }

    update(delayed: boolean = true) {
        if (!this.visible || !this._ref) return;
        return super.update(delayed);
    }

    draw(dashboard: Dashboard) {
        this._dashboard = dashboard;
        return this.visible ? <div
            key={this.index}
            className="c-widget"
            data-index={this.index}
            data-grid={{
                x: this.x,
                y: this.y,
                w: this.w,
                h: this.h
            }}
        >
            <div className="c-widget-header">{this.name}</div>
            <div className="c-widget-content">{this.$}</div>
        </div> : null;
    }
}


