import {React, Utils} from "../../core";
import {Page, Component, Table, Panel} from "../../components";
import * as Bootstrap from "../../Bootstrap";


export default class PModules extends Page {


    static counter: {};


    render() {

        const rows = [];

        let prevTs = 0;
        Utils.forEach(Bootstrap.MODULES, data => {

            const ts = data.created.getTime();
            const mod = data.module;
            let time = prevTs ? (ts - prevTs) + "ms" : null;

            for (let name in mod.exports) {
                const val = mod.exports[name];
                if (!val) continue;

                if (name.charAt(0).toLowerCase() === name.charAt(0))
                    continue;

                if (mod.children.length)
                    debugger;

                rows.push({
                    id: mod.id,
                    name: name,
                    file: data.name,
                    time: time
                });
            }


            prevTs = ts;
        });

        return <Table
            columns={{
                id: "ID",
                file: "Plik",
                name: "Nazwa",
                time: "Czas ładowania"
            }}
            rows={rows}
        />
    }
}

