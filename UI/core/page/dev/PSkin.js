import {React} from "../../core";
import {Page, PageTitle, Table} from "../../components";
import {Section} from "../../application/Skin";
import * as Skin from "../../application/Skin";


export default class PSkin extends Page {

    render() {


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

        return <div>

            <PageTitle>Skórki</PageTitle>

            {/*<Table*/}
            {/*columns={ {*/}
            {/*sec: "Sekcja",*/}
            {/*elm: "Element",*/}
            {/*css: "CSS",*/}
            {/*val: "Wartość"*/}
            {/*} }*/}
            {/*>*/}
            {/*<tbody>*/}
            {/*{   visit(Skin.MAIN, "")    }*/}
            {/*</tbody>*/}
            {/*</Table>*/}


            <div style={ {
                resize: "both",
                overflow: "auto",
                border: "1px solid red",
                display: "inline-block",
                padding: "10px",
                margin: "10px",
                whiteSpace: "pre-wrap",
                fontSize: "30pt",
                width: "30px",
                wordBreak: "break-all",
            } }>
                <div>
                    sdfdsfgfdhgsfdlkjg;sfdkjiusdhfosiduygoisudfg
                </div>
            </div>


        </div>
    }


}

