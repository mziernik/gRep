import {React, AppNode, Application, EventType} from "../../core";
import {Page, Component, PageTitle, Table} from "../../components";
import {Observer} from "../../utils/Dispatcher";


export default class PComponents extends Page {


    static counter: {};


    render() {

        const components = [];
        Application.nodes.forEach((node: AppNode) => node.components.forEach(c => components.push(c)));


        return <div>
            <PageTitle>Aktywne komponenty</PageTitle>

            <Table

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
                        node: component.node.name,
                        name: component.name,
                        listen: observers.join(", "),
                        rec: received
                    }
                }}
            />
        </div>;
    }


}

