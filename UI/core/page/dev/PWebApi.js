import {React, PropTypes, Utils} from "../../core";
import {Page, Component, Table, Panel, ModalWindow, MW_BUTTONS} from "../../components";
import WebApi from "../../webapi/WebApi";
import RepoCtrl from "../../component/repository/RepoCtrl";
import * as WebApiRepo from "../../repository/WebApiRepo";
import RepoTable from "../../component/repository/RepoTable";
import {EWebApi} from "../../repository/WebApiRepo";
import JsonViewer from "../../component/JsonViewer";
import Field from "../../repository/Field";
import * as Type from "../../repository/Type";
import FCtrl from "../../component/form/FCtrl";
import * as Check from "../../utils/Check";
import {RWebApi} from "../../repository/WebApiRepo";
import {R_WEBAPI} from "../../repository/WebApiRepo";


export default class PWebApi extends Page {

    constructor() {
        super(...arguments);
        this.requireRepo(WebApiRepo.R_WEBAPI);
    }

    render() {

        const api: WebApi = WebApi.instance;

        const rctrl: RepoCtrl = new RepoCtrl(WebApiRepo.R_WEBAPI);

        return [
            <div>
                <span>URL:</span>
                <a href={api.url}>{api.url} </a>
            </div>,
            <RepoTable
                key={Utils.randomId()}
                repository={WebApiRepo.R_WEBAPI}
                onClick={(rec: EWebApi, row, column, instance, e) => {
                    ModalWindow.create((mw: ModalWindow) => {
                        mw.content = <Viewer data={rec.DATA.value}/>;
                        mw.title = "Dane";
                    }).open();
                }}/>
        ]
    }

}

R_WEBAPI.repoPage = obj => <PWebApi modal={obj.modal}/>;

class Viewer extends Component {

    static propTypes = {
        data: PropTypes.any
    };

    rfc: Field = Field.create(Type.BOOLEAN, "rfc", "RFC 4627", false);

    constructor() {
        super(...arguments);
        this.rfc.onChange.listen(this, e => this.forceUpdate());
    }

    render() {
        const allowed = "0123456789_abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        let value = JSON.stringify(this.props.data, null, 4);

        if (!this.rfc.value) {
            const result = [];
            const lines = value.split("\n");

            lines.forEach((line: string) => {
                if (line.trim()[0] === '"' && line.contains('":')) {
                    let from = line.indexOf('"');
                    let to = line.indexOf('":');

                    const name = line.substring(from + 1, to);

                    let safe = true;
                    for (let i = 0; i < name.length; i++)
                        if ((i === 0 && "0123456789".contains(name[i])) || !allowed.contains(name[i])) {
                            safe = false;
                            break;
                        }

                    if (safe)
                        line = line.substring(0, from) + name + line.substring(to + 1);
                }
                result.push(line);
            });

            value = result.join("\n");
        }

        return <Panel fit noPadding style={{minWidth: "700px", minHeight: "700px"}}>
            <div style={{padding: "4px"}}>
                <FCtrl edit value={1} name={2} field={this.rfc}/>
            </div>
            <textarea
                readOnly
                style={{
                    fontFamily: "monospaced, Consolas, Courier New",
                    fontSize: "10pt",
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    whiteSpace: "pre"
                }}
                value={value}
            />

        </Panel>

    }
}