import * as Application from "../../application/Application";

import {React, PropTypes, Field, Repository, Record, PageDef} from '../../core';
import {Page, FontAwesome, Link, Table, PageTitle, FieldComponent} from '../../components';

let REPO: PageDef;

export default class PRepositories extends Page {

    render() {
        const data = [];

        return <div>
            <PageTitle>Repozytoria</PageTitle>

            <Table
                columns={{
                    id: "ID",
                    name: "Nazwa",
                    recs: "Rekordów",
                    actions: "Akcje"
                }}
                rows={Repository.all}
                rowMapper={(repo: Repository) => {
                    return {
                        name: repo.name,
                        id: repo.id,
                        recs: repo.items.length,
                        actions: (<span>
                            <Link
                                downloadName={repo.id + ".json"}
                                downloadData={() => repo.storage.build()}
                                icon={FontAwesome.DOWNLOAD}
                            />
                            <Link
                                link={REPO.getLink({id: repo.id})}
                                icon={FontAwesome.EYE}
                            />
                        </span>)
                    }
                }
                }
            />

        </div>
    }


}

Application.onCreate.listen(null, () => {
    const parent = PageDef.pageOf(PRepositories);
    REPO = parent.child("Repozytorium", parent._path + "/:id", RepositoryPage).defaultParams({id: "permissions"});
});

export class RepositoryPage extends Page {

    repo: ?Repository = null;
    static propTypes = {
        id: PropTypes.string
    };

    constructor() {
        super(...arguments);
        this.repo = Repository.getF(this.props.id);
    }

    render() {

        const columns = [] = this.repo.columns.map((f: Field) =>
            <span key={f._name} style={{textAlign: "center"}}>
                    <div>{f._name}</div>
                    <div style={{fontWeight: "normal"}}>{f._title}</div>
                    <div style={{fontWeight: "normal", fontStyle: "italic"}}>[{f.dataType.name}]</div>
                </span>);

        return <div>
            <PageTitle>Repozytorium "{this.repo.name}"</PageTitle>

            <Table
                columns={columns}
                rows={this.repo.items}
                rowMapper={(record: Record) => {
                    const result = {};
                    record.fields.forEach((f: Field) =>
                        result[f._name] = <FieldComponent preview={true} field={f}/>);
                    return result;
                }}
            />
        </div>
    }
}


