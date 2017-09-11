import {React, AppNode, Application, EventType} from "../../core";
import {Page, Component, Table, Panel} from "../../components";
import {Observer} from "../../utils/Dispatcher";
import {Dynamic, NODE} from "../../component/Component";


export default class PComponents extends Page {


    static counter: {};


    render() {

        const components = [];
        Application.nodes.forEach((node: AppNode) => node.components.forEach(c => components.push(c)));

        this.title.set("Aktywne komponenty");

        return <Table
            fit
            columns={{
                node: "Gałąź",
                name: "Nazwa",
                listen: "Nasłuchuje",
                rec: "Odebrano"
            }}
            rows={components}
            rowMapper={(component: Component) => {

                let observers = [];
                let received = 0;
                Observer.all.forEach((o: Observer) => {
                    if (o.context === component) {
                        received += o.dispatcher.received;
                        const name = o.dispatcher.context instanceof EventType ? '"' + o.dispatcher.context.name + '"' : "";
                        observers.push(`${name} [${o.dispatcher.senders.join(", ")}]`);
                    }
                });

                return {
                    node: component[NODE].name,
                    name: component instanceof Dynamic ? component.$ : component.toString(),
                    listen: observers.join(", "),
                    rec: received
                }
            }}
        />
    }


}

