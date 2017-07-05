import {React, EventType} from '../../core';
import {Page} from '../../components';
import Table from "../../component/Table";


export default class PEvents extends Page {

    render() {
        return <div>
            {super.renderTitle("Zdarzenia")};

            <Table
                columns={{
                    name: "Nazwa",
                    senders: "Nadawcy",
                    listeners: "Odbiorcy",
                    sent: "Nadano",
                    rec: "Odebrano"
                }}
                rows={EventType.all}
                rowMapper={(type: EventType) => {
                    return {
                        name: type.name,
                        senders: type.dispatcher.senders.join(", "),
                        listeners: type.dispatcher.getListeners().join(", "),
                        sent: type.dispatcher.sent,
                        rec: type.dispatcher.received
                    }
                }}
            />

        </div>
    }
}

