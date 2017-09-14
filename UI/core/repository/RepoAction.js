import Repository from "./Repository";
import API from "../application/API";
import Record from "./Record";
import {Utils, Is} from "../$utils";
import RepoFlag from "./RepoFlag";

export default class RepoAction {

    repo: Repository;
    record: boolean;

    key: string;
    name: string;
    action: ?() => void;
    hint: string;
    type: string;
    icon: string;
    confirm: string;
    params: Object; //ToDo obsługa
    paramsTitle: string;
    paramsButtonLabel: string;
    constraints: Object; //ToDo obsługa
    children: RepoAction[] = [];
    visibility: boolean | string;

    constructor(repo: Repository, key: string, name: string, action: () => void, confirm: string) {
        this.repo = repo;
        this.key = key;
        this.name = name;
        this.action = action;
        this.confirm = confirm;
    }

    static create(obj: Object, repo: Repository, key: string): RepoAction {
        const act = new RepoAction();
        act.repo = repo;
        act.key = obj.key || key;
        act.record = obj.record;
        act.name = obj.name;
        act.type = obj.type;
        act.icon = obj.icon;
        act.visibility = obj.visibility;
        act.paramsTitle = obj.paramsTitle;
        act.paramsButtonLabel = obj.paramsButtonLabel;
        act.confirm = obj.confirm;
        act.params = obj.params;
        act.constraints = obj.constraints;
        Utils.forEach(obj.children, (v, k) => act.children.push(RepoAction.create(v, repo, k)));
        return act;
    }

    isVisible(record: Record) {

        if (!!this.record !== !!record) return false;

        if (!Is.defined(this.visibility))
            return true;

        if (!record) return true;

        return new RepoFlag(this.visibility).ofCrude(record.action);
    }

    execute(record: Record, params: {}): Promise {
        return new Promise((resolve, reject) => {
            if (this.action) {
                const result = this.action();
                resolve(result);
            }
            else
                API.repoAction({
                        action: this.key,
                        repo: this.repo.key,
                        pk: record ? record.pk : null,
                        params: params
                    },
                    data => resolve(data),
                    e => reject(e));
        });
    }

}
