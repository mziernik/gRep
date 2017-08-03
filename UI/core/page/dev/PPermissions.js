import {PermissionRecord, PERMISSIONS} from "../../repository/PermissionRepo";
import {React, Field} from '../../core';
import {Page, Table, Panel} from '../../components';


export default class PPermissions extends Page {

    records: PermissionRecord[] = [];

    constructor() {
        super(...arguments);

        PERMISSIONS.rows.forEach((v, k) => {
            const rec: PermissionRecord = PERMISSIONS.get(this, k, true);
            this.records.push(rec);
        });

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

        this.title.set("Uprawnienia / funkcjonalności");

        return <Table
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
                    id: p.ID.value,
                    name: p.NAME.value,
                    c: add(p, p.CREATE),
                    r: add(p, p.READ),
                    u: add(p, p.UPDATE),
                    d: add(p, p.DELETE),
                    e: add(p, p.EXECUTE)
                }
            }}
        />
    }


}

