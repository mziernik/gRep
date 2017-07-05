import {React, AppNode, Application, EventType, Utils, ContextObject} from "../../core";
import {Page, Component, Table} from "../../components";
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
            {super.renderTitle("Obiekty kontekstu")}

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

