import {React, PropTypes, Field, Utils, Column, Repository, Record, CRUDE, Endpoint, Is} from '../../core.js';
import {Page, Icon, Link, Table, FCtrl, Panel, Button, ModalWindow} from '../../components.js';
import {ENDPOINT_TARGET_POPUP} from "../../application/Endpoint";

//ToDo: Hint dla wiersza - lista field + displayValue

export default class RepoTable extends Table {

    repo: Repository;

    static propTypes = {
        repository: PropTypes.instanceOf(Repository).isRequired,
        onClick: PropTypes.func, //(rec, e,  row, column, table)
        showAdvanced: PropTypes.bool,
        modalEdit: PropTypes.bool,
        rowFilter: PropTypes.func,
        references: PropTypes.array,
        fit: PropTypes.bool,
        style: PropTypes.object
    };

    static defaultProps = {
        showAdvanced: false
    };

    constructor() {
        super(...arguments);
        this._showRowNum = true;
        this._className.unshift("c-repo-table");

        let mapping = [];
        const indexes: Map = new Map();

        const repo: Repository = this.repo = this.props.repository;


        this._onRowClick = (row, column, instance, e) => {
            let rec: Record = mapping[row.index];

            if (this.props.onClick) {
                rec = rec.repo.get(this, rec.pk); // kopia rekordu
                this.props.onClick(rec, e, row, column, instance);
                return;
            }

            Endpoint.devRouter.RECORD.navigate({
                repo: repo.key,
                id: rec.primaryKey.value
            }, this.props.modalEdit ? ENDPOINT_TARGET_POPUP : e);

        };

        this._dataSource = () => {
            const rows = {};
            mapping.clear();
            indexes.clear();

            let idx = 0;

            const addRec = (rec: Record, cellIdx) => {
                const row = {};
                if (this.props.rowFilter && this.props.rowFilter(rec) === false)
                    return;
                //
                // rec.onUpdateMarkerChange.listen(this, state => {
                //     debugger;
                // });

                const mark = this._dataChanged && this._dataChanged.fullId === rec.fullId;

                rec.fields.forEach((f: Field) =>
                    row[f.key] = <FCtrl
                        key={++idx}
                        field={f}
                        inline
                    />);

                indexes.set(rec.pk, mapping.length);
                mapping.push(rec);
                rows[rec.pk] = row;
            };

            Utils.forEach(repo.rows, (_row, pk) => {

                const rec: Record = repo.createRecord(this, CRUDE.UPDATE);
                rec.row = _row;
                addRec(rec);
            });

            Utils.forEach(this.props.references, (rec: Record) => {
                debugger;
                addRec(rec);
            });

            return rows;
        };

        repo.onChange.listen(this, data => {
            // zdarzenie modyfikacji repozytorium ustawia tylko flagę, metoda render() zostanie wywołana z zewnątrz
            if (data.action !== CRUDE.UPDATE) {  // ignorujemy aktualizacje komórek - obsługiwane będą przez FCtrl
                this._dataChanged = data.record;
                this.forceUpdate(true);
                return;
            }

            if (!this._htmlTableElement) return;
            const idx = indexes.get(data.record.pk);
            if (!Is.defined(idx)) return;
            const tr = document.querySelector(".rt-tr-group[data-idx='" + idx + "']");
            if (!tr) return;
            tr.setAttribute("data-changed", "true");
            this.setTimeout(() => tr.setAttribute("data-changed", "false"), 3000);
        });

        this._columns = this._convertColumns(Utils.forEach(repo.columns, (c: Column) => {
            if (!c.disabled || this.props.showAdvanced) return c;
        }));

    }

    // editRecord(record: Record) {
    //     const ctrl: RecordCtrl = new RecordCtrl(this.node.currentPage, record, CRUDE.UPDATE);
    //     ModalWindow.create((mw: ModalWindow) => {
    //         mw.content = ctrl.render();
    //         mw.title = "Edycja rekordu " + Utils.escape(record.displayValue);
    //     }).open();
    // }

    // _drawCell(row, accessor, number = false) {
    //     const result = super._drawCell(row, accessor, number);
    //     return <div>
    //         {result}
    //     </div>;
    //
    // }

}