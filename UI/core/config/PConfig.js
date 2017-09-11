import {PropTypes, React, EventType, Field} from '../core';
import RepoPage from "../page/base/RepoPage";
import {EConfigField, R_CONFIG_FIELD} from "./ConfigRepositories";
import Tree from "../component/tree/Tree";
import ConfigNode from "./ConfigNode";
import {Dispatcher, Utils} from "../$utils";
import TreeNode from "../component/tree/TreeNode";
import TreeElement from "../component/tree/TreeElement";
import CTree from "../component/tree/CTree";
import {Component, Panel, Icon} from "../components";
import ConfigField from "./ConfigField";
import {Attr, Attributes} from "../component/form/Attributes";
import Resizer from "../component/Resizer";
import {Btn} from "../component/Button";
import Repository from "../repository/Repository";
import Link from "../component/Link";
import AppStatus from "../application/Status";

export default class PConfig extends RepoPage {

    cnode: CConfigNode;
    changed: Map = new Map();

    btnSave: Btn;

    constructor(props: Object, context: Object, updater: Object) {
        super(R_CONFIG_FIELD, props, context, updater);
    }

    onFieldChange(field: Field) {
        this.changed.set(field.key, field);
        this.btnSave && this.btnSave._disabled && (this.btnSave.disabled = false);
    }

    save() {
        if (!this.changed.size) return;

        const apply: Dispatcher = new Dispatcher(this);

        const records = Utils.forEach(this.changed, (field: Field) => {
            const rec: EConfigField = R_CONFIG_FIELD.get(this, field.key, true);
            const cf: ConfigField = field.attributes.configField;
            const changed: boolean = field.value !== cf._defaultValue;
            rec.CUSTOM_VALUE.value = changed;
            rec.VALUE.value = field.value;

            apply.listen(this, x => {
                cf._isCustomValue = changed;
                cf.setValue(changed, field.value);
            });

            return rec;
        });

        this.btnSave && (this.btnSave.disabled = true);
        Repository.commit(this, records).then(e => {
            AppStatus.success(this, "Zaktualizowano konfigurację");
            apply.dispatch(this);
            this.cnode && this.cnode.forceUpdate(true);
        });
    }

    render() {
        this.changed.clear();
        if (!this.btnSave)
            this.btnSave = this.buttons.add((btn: Btn) => {
                btn.type = "success";
                btn.text = "Zapisz";
                btn.onClick = e => this.save();
                btn.disabled = true;
            });

        const visit = (cnode: ConfigNode, tnode: TreeElement) => {
            const tn: TreeNode = tnode.node(cnode.key, cnode.name);

            tn.onClick = e => this.cnode && this.cnode.display(cnode);

            Utils.forEach(cnode.children, (cn: ConfigNode) => visit(cn, tn));

        };

        const tree: Tree = new Tree("cfg");

        Utils.forEach(ConfigNode.ALL, (node: ConfigNode) => !node.parent && visit(node, tree));


        return <Panel fit vertical noPadding>
            <Resizer east style={{width: "300px", minWidth: "100px"}}>
                <div style={{
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    border: "1px solid #aaa",
                    padding: "4px",
                    flex: "auto"
                }}>
                    <CTree data={tree}/>
                </div>
            </Resizer>
            <CConfigNode ref={e => this.cnode = e} page={this}/>
        </Panel>
    }
}


class CConfigNode extends Component {

    cnode: ConfigNode;

    static propTypes = {
        page: PropTypes.instanceOf(PConfig)
    };

    display(node: ConfigNode) {
        this.cnode = node;
        this.forceUpdate(true);
    }

    render() {

        const page: PConfig = this.props.page;

        return <div style={{
            height: "100%",
            flex: "auto"
        }}>
            <Attributes key={Utils.randomId()} edit style={{
                minWidth: "50%",
                maxWidth: "100%"
            }}>
                {Utils.forEach(this.cnode && this.cnode.fields, (cf: ConfigField) => {
                    const field: Field = cf.field.clone();
                    field.attributes.configField = cf;
                    field.value = cf.value;
                    field.onChange.listen(this, () => page.onFieldChange(field));
                    let attr = null;
                    return <Attr
                        ref={e => attr = e}
                        style={{color: cf.isCustomValue ? "blue" : null}}
                        key={field.key}
                        field={field}
                        renderAfter={cf.isCustomValue ?
                            <Link
                                icon={Icon.UNDO}
                                title="Przywróć wartość domyślną"
                                onClick={e => {
                                    field.value = cf._defaultValue;
                                    attr && attr.forceUpdate();
                                }
                                }/> : null}
                    />
                })}
            </Attributes>

        </div>
    }
}