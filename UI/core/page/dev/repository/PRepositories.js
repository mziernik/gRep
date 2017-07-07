import {React, PropTypes, Field, Repository, Record, Endpoint} from '../../../core';
import {Page, Panel, FontAwesome, Link, Table, FieldComponent} from '../../../components';
import ToolBar from "../../PageToolBar";

export default class PRepositories extends Page {

    constructor() {
        super(...arguments);
        Repository.onUpdate.listen(this, () => this.forceUpdate());
    }

    draw() {
        const data = [];

        return <Panel fit>
            {super.renderTitle("Repozytoria")}

            <Table
                columns={{
                    actions: "Akcje",
                    id: "ID",
                    name: "Nazwa",
                    recs: "Rekordów",
                    updates: "Ilość aktualizacji",
                    last: "Ostatnia aktualizacja",
                    refs: "Referencje",
                    crude: "CRUDE"
                }}
                rows={Repository.all}
                rowMapper={(repo: Repository) => {
                    return {
                        name: repo.name,
                        id: repo.key,
                        recs: repo.rows.size,
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
                        </span>),
                        refs: repo.refs.length,
                        crude: repo.config.crude
                    }
                }
                }
            />

        </Panel>
    }
}
