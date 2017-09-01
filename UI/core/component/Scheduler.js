// @flow
'use strict';
import {React, ReactDOM, AppEvent, Trigger} from "../core.js";
import {Component} from "../components.js";

export class Scheduler extends Component {
    render() {

        return <div ref={e => e && this.build(e)}>

        </div>

    }

    buid(tag: HTMLDivElement) {
        debugger;
        var dManager = ej.DataManager($.extend(true, [], window.HorizontalResourcesData)).executeLocal(ej.Query().take(10));
        $("#Schedule1").ejSchedule({
            width: "100%",
            height: "525px", cellWidth: "40px",
            showCurrentTimeIndicator: false,
            orientation: "horizontal",
            currentDate: new Date(2017, 5, 5),
            currentView: ej.Schedule.CurrentView.Workweek,
            group: {
                resources: ["Owners"]
            },
            resources: [{
                field: "ownerId",
                title: "Owner",
                name: "Owners", allowMultiple: true,
                resourceSettings: {
                    dataSource: [
                        {text: "Nancy", id: 1, groupId: 1, color: "#f8a398"},
                        {text: "Steven", id: 3, groupId: 2, color: "#56ca85"},
                        {text: "Michael", id: 5, groupId: 1, color: "#51a0ed"},
                        {text: "Milan", id: 13, groupId: 3, color: "#99ff99"},
                        {text: "Paul", id: 15, groupId: 3, color: "#cc99ff"}
                    ],
                    text: "text", id: "id", groupId: "groupId", color: "color"
                }
            }],
            appointmentSettings: {
                dataSource: dManager,
                id: "Id",
                subject: "Subject",
                startTime: "StartTime",
                endTime: "EndTime",
                description: "Description",
                allDay: "AllDay",
                recurrence: "Recurrence",
                recurrenceRule: "RecurrenceRule",
                resourceFields: "ownerId"
            }
        });
    }
}