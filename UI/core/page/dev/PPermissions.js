import {PermissionRecord, PERMISSIONS} from "../../repository/PermissionRepo";

import {React, Field} from '../../core';
import {Page, PageTitle, Table} from '../../components';


export default class PPermissions extends Page {

    records: PermissionRecord[] = [];

    constructor() {
        super(...arguments);
        PERMISSIONS.items.forEach((p: PermissionRecord) => this.records.push(this.beginEdit(p)));
    }

    render() {
        PERMISSIONS.refresh();
        const add = (record: PermissionRecord, field: Field) =>
            <input type="checkbox"
                   defaultChecked={field.value}
                   onChange={e => field.value = e.currentTarget.checked}
                   style={{
                       width: "16px",
                       height: "16px"
                   }}/>;

        return <div>

            <PageTitle>Uprawnienia / funkcjonalności</PageTitle>

            <Table
                columns={{
                    id: "ID",
                    name: "Nazwa",
                    c: "Tworzenie",
                    r: "Odczyt",
                    u: "Aktualizacja",
                    d: "Usunięcie",
                    e: "Wykonanie"
                }}
                rows={this.records}
                rowMapper={(p: PermissionRecord) => {
                    return {
                        id: p.ID.get(),
                        name: p.NAME.get(),
                        c: add(p, p.CREATE),
                        r: add(p, p.READ),
                        u: add(p, p.UPDATE),
                        d: add(p, p.DELETE),
                        e: add(p, p.EXECUTE)
                    }
                }}
            />
        </div>
    }


}

