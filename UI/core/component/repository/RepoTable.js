import {React, PropTypes, Field, Utils, Column, Repository, Record, CRUDE, Endpoint} from '../../core.js';
import {Page, Icon, Link, Table, FCtrl, Panel, Button} from '../../components.js';


export default class RepoTable extends Table {

    repo: Repository;

    static propTypes = {
        repository: PropTypes.instanceOf(Repository).isRequired,
        onClick: PropTypes.func
    };

    constructor() {
        super(...arguments);
        this._showRowNum = true;
        this._className.unshift("c-repo-table");

        let mapping = [];

        const repo: Repository = this.repo = this.props.repository;

        let rowIdx = 0;

        this._onRowClick = (row, column, instance, e) => {
            let rec: Record = mapping[row.index];

            if (this.props.onClick) {
                rec = rec.repo.get(this, rec.pk); // kopia rekordu
                this.props.onClick(rec, row, column, instance, e);
                return;
            }

            Endpoint.devRouter.RECORD.navigate({
                repo: repo.key,
                id: rec.primaryKey.value
            }, e);

        };

        this._dataSource = () => {
            const rows = {};
            mapping.clear();

            Utils.forEach(repo.rows, (_row, pk) => {
                let cellIdx = 0;

                const row = {};
                const rec: Record = repo.createRecord(this);
                rec.row = _row;

                const mark = this._dataChanged && this._dataChanged.fullId === rec.fullId;

                rec.fields.forEach((f: Field) =>
                    row[f.key] = <FCtrl
                        ref={(e: FCtrl) => mark && e && e._markAsChanged(true)}
                        key={rowIdx++ + "." + (cellIdx++)}
                        field={f}
                        inline
                    />);

                mapping.push(rec);
                rows[rec.pk] = row;
            });

            return rows;
        };

        repo.onChange.listen(this, data => {
            // zdarzenie modyfikacji repozytorium ustawia tylko flagę, metoda render() zostanie wywołana z zewnątrz
            if (data.action !== CRUDE.UPDATE)  // ignorujemy aktualizacje komórek - obsługiwane będą przez FCtrl
                this._dataChanged = data.record;
        });

        this._columns = this._convertColumns(Utils.forEach(repo.columns, (c: Column) =>
            c.disabled ? undefined : c.hidden ? null :
                <span key={c.key} title={c.name + (c.description ? "\n" + c.description : "")}>{c.name}</span>));


    }

    editRecord(record: Record) {
        const ctrl: RecordCtrl = new RecordCtrl(this.node.currentPage, record, CRUDE.UPDATE);
        ModalWindow.create((mw: ModalWindow) => {
            mw.content = ctrl.render();
            mw.title = "Edycja rekordu " + Utils.escape(record.displayValue);
        }).open();
    }

    _drawRow(row, accessor, number = false) {
        const result = super._drawRow(row, accessor, number);
        return <div className={number ? "c-table-number" : null}>
            {result}
        </div>;

    }

}