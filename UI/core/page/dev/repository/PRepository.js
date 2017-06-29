import {React, PropTypes, Field, Utils, Column, Repository, Record, Endpoint, If, CRUDE} from '../../../core';
import {Page, FontAwesome, Link, Table, PageTitle, FieldComponent, Panel} from '../../../components';
import PageToolBar from "../../PageToolBar";


export default class PRepository extends Page {

    repo: ?Repository = null;
    static propTypes = {
        repo: PropTypes.string
    };

    constructor() {
        super(...arguments);
        this.repo = Repository.get(this.props.repo, true);
        //ToDo: Do usunięcia
        this.repo.onChange.listen(this, (map: Map) => this.forceUpdate());
    }

    render() {

        if (!this.repo.isReady)
            return <div>
                <PageTitle>Repozytorium "{this.repo.name}"</PageTitle>
                <span>Inicjalizacja repozytorium. Proszę czekać...</span>
            </div>;

        const columns = [];

        columns.push(<span key="#action" style={{textAlign: "center"}}>Akcje</span>);
        columns.push(<span key="#refs" style={{textAlign: "center"}}>Referencje</span>);

        columns.addAll(this.repo.columns.map((f: Column) =>
            f.hidden ? null : <span key={f.key} style={{textAlign: "center"}}>
                    <div>{f.key}</div>
                    <div style={{fontWeight: "normal"}}>{f.name}</div>
                    <div style={{fontWeight: "normal", fontStyle: "italic"}}>[{f.type.name}]</div>
                </span>));

        return <Panel fit>
            <PageTitle>Repozytorium "{this.repo.name}"</PageTitle>

            <PageToolBar>
                <Link
                    link={this.endpoint.RECORD.getLink({
                        repo: this.repo.key,
                        rec: "~new"
                    })}
                    title="Dodaj nowy rekord"
                    disabled={!this.repo.canCreate}
                    icon={FontAwesome.PLUS_SQUARE}
                />
            </PageToolBar>

            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>Ilość aktualizacji</td>
                        <td>{this.repo.updates}</td>
                    </tr>
                    <tr>
                        <td>Ostatnia aktualizacja</td>
                        <td>{this.repo.lastUpdated ? this.repo.lastUpdated.toLocaleString() : null}
                            ({this.repo.lastUpdatedBy})
                        </td>
                    </tr>
                    <tr>
                        <td>Uprawnienia</td>
                        <td>{CRUDE.parse(this.repo.config.crude).map(c => c.title).join(", ")}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <Table
                columns={columns}
                rows={this.repo.rows}
                rowMapper={(row: [], pk: any) => {

                    const result = {};
                    const rec: Record = this.repo.get(this, pk, true);
                    result["#action"] = <span>
                            <Link
                                link={this.endpoint.RECORD.getLink({
                                    repo: this.repo.key,
                                    rec: rec.primaryKey.value
                                })}
                                icon={FontAwesome.CREDIT_CARD}
                            />
                    </span>;
                    result["#refs"] = this.repo.getRefs(pk).length;
                    rec.fields.forEach((f: Field) =>
                        result[f.key] = <FieldComponent preview={true} singleLine={true} field={f}/>);
                    return result;
                }}
            />
        </Panel>
    }
}
