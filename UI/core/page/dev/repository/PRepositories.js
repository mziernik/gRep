import {React, PropTypes, Field, Repository, Record, Endpoint} from '../../../core';
import {Page, FontAwesome, Link, Table, PageTitle, FieldComponent} from '../../../components';
import ToolBar from "../../PageToolBar";

export default class PRepositories extends Page {

    constructor() {
        super(...arguments);
        Repository.onChange.listen(this, () => this.forceUpdate());
    }

    render() {
        const data = [];

        return <div>
            <PageTitle>Repozytoria</PageTitle>

            <Table
                columns={{
                    id: "ID",
                    name: "Nazwa",
                    recs: "Rekordów",
                    updates: "Ilość aktualizacji",
                    last: "Ostatnia aktualizacja",
                    actions: "Akcje"
                }}
                rows={Repository.all}
                rowMapper={(repo: Repository) => {
                    return {
                        name: repo.name,
                        id: repo.key,
                        recs: repo.items.length,
                        updates: repo.updates,
                        last: repo.lastUpdated ? repo.lastUpdated.toLocaleString() : "",
                        actions: (<span>
                            <Link
                                downloadName={repo.key + ".json"}
                                downloadData={() => repo.storage.build()}
                                icon={FontAwesome.DOWNLOAD}
                            />
                            <Link
                                link={this.endpoint.REPO.getLink({repo: repo.key})}
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
