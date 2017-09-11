import Repository, {RepoError} from "./Repository";
import {Utils} from "../$utils";
import Record from "./Record";
import Column from "./Column";
import * as CRUDE from "./CRUDE";

export default class RepoCursor {
    repo: Repository;
    _index: number = -1;
    _rows: [] = [];

    constructor(repo: Repository) {
        this.repo = repo;
        repo.rows.forEach(row => this._rows.push(row));
    }

    forEach(consumer: (cursor: RepoCursor, stop: () => void) => void): any[] {
        this.reset();
        let stopped: false;
        const stop = () => stopped = true;
        const result = [];
        while (!stopped && this.next()) {
            const res = consumer(this, stop);
            if (res !== undefined)
                result.push(res);
        }
        return result;
    }

    next(): boolean {
        ++this._index;
        return this._index < this._rows.length;
    }

    back(): boolean {
        --this._index;
        return this._index >= 0;
    }

    reset() {
        this._index = -1
    }

    get row(): any[] {
        return Utils.clone(this._rows[this._index]);
    }

    get primaryKey(): any {
        return this.get(this.repo.primaryKeyColumn);
    }

    getRecord(context: any) {
        const rec: Record = this.repo.createRecord(context, CRUDE.UPDATE);
        rec.row = this._rows[this._index];
        return rec;
    }

    get(column: Column): any {
        const idx = this.repo.getColumnIndex(column);

        if (this._index < 0 || this._index >= this._rows.length)
            throw new RepoError(this.repo, "Kursor poza zakresem");

        return this._rows[this._index][idx];
    }
}
