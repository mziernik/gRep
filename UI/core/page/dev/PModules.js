import {React} from "../../core";
import {Page, Component, Table, Panel} from "../../components";


export default class PModules extends Page {


    static counter: {};


    draw() {

        const rows = [];

        window._modules.forEach(arr => {

            const mod = arr[0];
            const fileName = arr[1];

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
                    file: fileName
                });
            }
        });

        return <Panel fit>
            {super.renderTitle("Moduły")}

            <Table
                columns={{
                    id: "ID",
                    file: "Plik",
                    name: "Nazwa",
                }}
                rows={rows}
            />
        </Panel>;
    }


}

