import {React, AppNode, Application, EventType, Utils, ContextObject} from "../../core";
import {Page, Component, Table, Panel} from "../../components";
import {Observer} from "../../utils/Dispatcher";


export default class PContextObject extends Page {


    static counter: {};


    render() {

        this.title.set("Obiekty kontekstu");

        const objects = Utils.forEach(ContextObject.getMap(), (arr, ctx) => {
            return {
                context: Utils.className(ctx),
                objects: arr.length
            }
        });

        return <Table
            columns={{
                context: "Kontekst",
                objects: "Obiekty"
            }}
            rows={objects}
        />

    }


}

