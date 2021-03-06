import {React, EventType} from '../../core';
import {Page, Panel, Table} from '../../components';

export default class PEvents extends Page {

    render() {
        return <Table
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
    }
}

