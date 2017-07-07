import {React, AppNode, Application, EventType, Utils, ContextObject} from "../../core";
import {Page, Component, Table, Panel} from "../../components";
import {Observer} from "../../utils/Dispatcher";


export default class PContextObject extends Page {


    static counter: {};


    draw() {

        const objects = Utils.forEach(ContextObject.getMap(), (arr, ctx) => {
            return {
                context: Utils.className(ctx),
                objects: arr.length
            }
        });

        return <Panel fit>
            {super.renderTitle("Obiekty kontekstu")}

            <Table
                columns={{
                    context: "Kontekst",
                    objects: "Obiekty"
                }}
                rows={objects}
            />
        </Panel>;
    }


}

