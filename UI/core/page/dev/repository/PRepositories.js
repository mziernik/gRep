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
                                link={this.endpoint.REPO.getLink({repo: repo.id})}
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
