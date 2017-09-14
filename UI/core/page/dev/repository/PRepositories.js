import {React, PropTypes, Field, Repository, Record, Endpoint} from '../../../core';
import {Page, Panel, Icon, Link, Table, FCtrl} from '../../../components';
import ToolBar from "../../../component/ToolBar";

export default class PRepositories extends Page {

    constructor() {
        super(...arguments);
    }

    render() {
        let cnt = 0;
        return <Table
            columns={{
                cnt: "#",
                id: "ID",
                group: "Grupa",
                name: "Nazwa",
                cols: "Kolumny",
                actions: "Akcje",
                recs: "Rekordów",
                updates: "Ilość aktualizacji",
                last: "Ostatnia aktualizacja",
                refs: "Referencje",
                crude: "CRUDE"
            }}
            rows={Repository.all}
            rowMapper={(repo: Repository) => {
                return {
                    cnt: ++cnt,
                    name: repo.name,
                    group: repo.config.group,
                    id: <Link link={this.endpoint.REPO.getLink({repo: repo.key})}>{repo.key}</Link>,
                    cols: repo.columns.length,
                    actions: repo.actions ? repo.actions.length : null,
                    recs: repo.rows.size,
                    updates: repo.updates,
                    last: repo.lastUpdated ? repo.lastUpdated.toLocaleString() : "",
                    refs: repo.refs.length,
                    crude: repo.config.crude
                }
            }
            }
        />
    }
}
