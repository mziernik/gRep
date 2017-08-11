import {Page, Panel, PopupMenu, MenuItem} from "../../core/components.js";
import {React, ReactDOM, Utils} from '../../core/core.js';


import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import AbstractWidget from "./widgets/AbstractWidget";
import ClockWidget from "./widgets/Clock";
import RepoWidget from "./widgets/RepoWidget";

import {Responsive, WidthProvider} from 'react-grid-layout';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


const WIDGETS: AbstractWidget[] = [

    new ClockWidget(),
    new RepoWidget(),
    //  new MessagesWidget(),
    // new NotificationsWidget(),
];

export default class Dashboard extends Page {

    constructor() {
        super(...arguments);
        this.title.set("Dashboard");
        this.titleBar.visible = false;
    }

    //ToDo: Tryb showcase https://strml.github.io/react-grid-layout/examples/0-showcase.html

    render() {
        return (
            <Panel noPadding scrollable fit>
                <ResponsiveReactGridLayout
                    breakpoints={{lg: 1200, md: 800, sm: 480}}
                    cols={{lg: 3, md: 2, sm: 1}}
                    rowHeight={150}
                >
                    {Utils.forEach(WIDGETS, (widget: AbstractWidget) => widget.draw(this))}
                </ResponsiveReactGridLayout>
            </Panel>
        )
    }
}
