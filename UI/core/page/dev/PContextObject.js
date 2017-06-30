import {React, AppNode, Application, EventType, Utils, ContextObject} from "../../core";
import {Page, Component, PageTitle, Table} from "../../components";
import {Observer} from "../../utils/Dispatcher";


export default class PContextObject extends Page {


    static counter: {};


    render() {

        const objects = Utils.forEach(ContextObject.getMap(), (arr, ctx) => {
            return {
                context: Utils.className(ctx),
                objects: arr.length
            }
        });

        return <div>
            <PageTitle>Obiekty kontekstu</PageTitle>

            <Table
                columns={{
                    context: "Kontekst",
                    objects: "Obiekty"
                }}
                rows={objects}
            />
        </div>;
    }


}

