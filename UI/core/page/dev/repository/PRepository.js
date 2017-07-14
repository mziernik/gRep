import {React, PropTypes, Field, Utils, Column, Repository, Record, Endpoint, If, CRUDE} from '../../../core';
import {Page, Icon, Link, Table, FCtrl, Panel, Button} from '../../../components';


export default class PRepository extends Page {

    repo: ?Repository = null;
    static propTypes = {
        repo: PropTypes.string
    };

    constructor() {
        super(...arguments);
        this.waitForRepo(this.props.repo);
    }

    render() {
        this.repo = Repository.get(this.props.repo, true);
        const columns = [];

        columns.push(<span key="#action" style={{textAlign: "center"}}/>);
        columns.addAll(this.repo.columns.map((f: Column) =>
            f.hidden ? null : <span key={f.key} style={{
                textAlign: "center",
                fontWeight: "normal",

            }}>
                   <div style={{
                       overflow: "hidden",
                       textOverflow: "ellipsis"
                   }}>{f.name}</div>
                    <div style={{fontSize: "0.8em"}}>{f.key}</div>
                    <div style={{fontSize: "0.8em"}}>[{f.type.name}]</div>
                </span>));
        columns.push(<span key="#refs" style={{textAlign: "center"}}>#ref</span>);

        let counter = 0;
        return <Panel fit>
            {super.renderTitle(`Repozytorium "${this.repo.name}"`)}

            {this.renderToolBar([
                <Button
                    key="btnDetails"
                    type="default"
                    link={this.endpoint.REPO_DETAILS.getLink({
                        repo: this.repo.key
                    })}
                    title="Szczegóły repozytorium"
                    icon={Icon.INFO}>Szczegóły</Button>,
                <Button
                    key="btnAdd"
                    type="primary"
                    link={this.endpoint.RECORD.getLink({
                        repo: this.repo.key,
                        rec: "~new"
                    })}
                    title="Dodaj nowy rekord"
                    disabled={!this.repo.canCreate}
                    icon={Icon.PLUS}
                >Dodaj</Button>
            ])}

            <Table
                columns={columns}
                rows={this.repo.rows}
                rowMapper={(row: [], pk: any) => {

                    const result = {};
                    const rec: Record = this.repo.get(this, pk, true);
                    result["#action"] = <span>
                        <span> {++counter + "."}  </span>
                        <Link
                            link={this.endpoint.RECORD.getLink({
                                repo: this.repo.key,
                                rec: rec.primaryKey.value
                            })}
                            icon={Icon.CREDIT_CARD}
                        />
                    </span>;
                    result["#refs"] = this.repo.getRefs(pk).length;
                    rec.fields.forEach((f: Field) =>
                        result[f.key] = <FCtrl preview inline field={f}/>);
                    return result;
                }}
            />
        </Panel>
    }
}
