import {React, PropTypes, Field, Utils, Repository, Record, Endpoint, If} from '../../../core';
import {Page, FontAwesome, Link, Table, PageTitle, FieldComponent} from '../../../components';
import PageToolBar from "../../PageToolBar";
import Button from "../../../component/Button";


export default class PRepository extends Page {

    repo: ?Repository = null;
    static propTypes = {
        repo: PropTypes.string
    };

    constructor() {
        super(...arguments);
        this.repo = Repository.getF(this.props.repo);
        Repository.onChange.listen(this, (map: Map) => If.condition(map.has(this.repo), () => this.forceUpdate()));
    }

    render() {

        if (!this.repo.isReady)
            return <span>Inicjalizacja repozytorium. Proszę czekać...</span>;

        const columns = [];

        columns.push(<span key="#action" style={{textAlign: "center"}}>Akcje</span>);

        columns.addAll(this.repo.columns.map((f: Field) =>
            <span key={f._name} style={{textAlign: "center"}}>
                    <div>{f._name}</div>
                    <div style={{fontWeight: "normal"}}>{f._title}</div>
                    <div style={{fontWeight: "normal", fontStyle: "italic"}}>[{f.dataType.name}]</div>
                </span>));

        return <div>
            <PageTitle>Repozytorium "{this.repo.name}"</PageTitle>

            <PageToolBar>
                <Link
                    link={this.endpoint.RECORD.getLink({
                        repo: this.repo.id,
                        rec: "~new"
                    })}
                    icon={FontAwesome.PLUS_SQUARE}
                />
            </PageToolBar>

            <Table
                columns={columns}
                rows={this.repo.items}
                rowMapper={(record: Record) => {
                    const result = {};

                    result["#action"] = <span>
                            <Link
                                link={this.endpoint.RECORD.getLink({
                                    repo: this.repo.id,
                                    rec: record.primaryKey.get()
                                })}
                                icon={FontAwesome.CREDIT_CARD}
                            />
                    </span>;

                    record.fields.forEach((f: Field) =>
                        result[f._name] = <FieldComponent preview={true} field={f}/>);
                    return result;
                }}
            />
        </div>
    }
}
