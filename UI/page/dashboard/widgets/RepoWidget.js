import {React, AppEvent, Repository, Utils} from '../../../core/core.js';
import AbstractWidget from "./AbstractWidget";


export default class RepoWidget extends AbstractWidget {

    constructor() {
        super("repo", "Repozytoria", true);
        this.x = 2;
        this.y = 1;
        this.w = 1;
        this.h = 1;

        AppEvent.REPOSITORY_REGISTERED.listen(this, e => {
            this.update(true)
        })
    }

    render() {
        let repos = 0;
        let records = 0;
        Utils.forEach(Repository.all, (repo: Repository) => {
            ++repos;
            records += repo.rows.size;
        });

        return <div>
            <div>Repozytoria: {repos}</div>
            <div>Rekordy: {records}</div>
        </div>
    }
}