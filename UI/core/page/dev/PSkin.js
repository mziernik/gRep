import {React} from "../../core";
import {Page, Table, Panel} from "../../components";
import {Section} from "../../application/Skin";
import * as Skin from "../../application/Skin";


export default class PSkin extends Page {

    draw() {


        function visit(section: Section, parentName: string) {
            const map = section.sections.map(sec => visit(sec, parentName + sec.name));
            return map.concat(section.elements.map((element: Element) =>
                <tr>
                    <td>{parentName}</td>
                    <td>{element.name}</td>
                    <td>{element.cssField}</td>
                    <td>{element.value}</td>
                </tr>
            ));

        }

        return <Panel fit>

            {super.renderTitle("Skórki")}

            <Table
                columns={ {
                    sec: "Sekcja",
                    elm: "Element",
                    css: "CSS",
                    val: "Wartość"
                } }
            >
                <tbody>
                {   visit(Skin.MAIN, "")    }
                </tbody>
            </Table>

        </Panel>
    }


}

