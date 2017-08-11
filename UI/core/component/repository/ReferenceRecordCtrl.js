import {
    React, PropTypes, Type, Utils, Field, Cell, Repository, CRUDE, Record, Check, EError, Dev, Is, Column
} from "../../core";
import RecordCtrl from "./RecordCtrl";


/** Kontroler edycji referencji */
export default class ReferenceRecordCtrl {

    parent: RecordCtrl;
    record: Record;
    changed: Cell[] = [];

    constructor(parent: RecordCtrl, foreignRecord: Record) {
        this.parent = Check.instanceOf(parent, [RecordCtrl]);
        this.record = Check.instanceOf(foreignRecord, [Record]);
        foreignRecord.parent = parent.record;
    }

    set (column: Column | string, value: any, hidden: boolean): ReferenceRecordCtrl {
        if (Is.string(column))
            column = this.record.repo.getColumn(column, true);

        const cell: Cell = this.record.get(column, true);
        cell.value = value;


        //      if (hidden)
        //          this.record.fields.delete(column);

        this.changed.push(cell);

        return this;
    }


    modalEdit(onChange: () => void) {
        const ctrl: RecordCtrl = new RecordCtrl(this.record);
        ctrl.local = this.parent.local;
        ctrl.showAdvanced = this.parent.showAdvanced;
        ctrl.showSuccessHint = false;
        ctrl.modalEdit(onChange);
    }


}


