import {
    React,
    Utils,
    Check,
    If,
    Field,
    Repository,
    Dispatcher,
    Debug,
    CRUDE,
    Record,
    EError,
    ContextObject
} from "../../core";
import {Component, Button, Page, Icon, Spinner, Alert} from "../../components";
import AppStatus from "../../application/Status";
import {RepoAction} from "../../repository/Repository";

export default class RepoCtrl {

    page: Page;
    repo: Repository;

    constructor(page: Page, repo: Repository) {
        this.page = page;
        this.repo = repo;
    }

    renderActionButtons(): [] {
        return Utils.forEach(this.repo.config.actions, (act: RepoAction) => act.rec ? null : <Button
            key={act.key}
            icon={act.icon}
            type={act.type || "default"}
            confirm={act.confirm}
            onClick={e => {
                this.repo.storage.action(this.repo, act.key, null, {})
            }}>{this.page.children.render(act.name)}</Button>);
    }

}