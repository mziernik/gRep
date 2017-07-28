import {React, Utils, Repository, Endpoint} from "../../core";
import {Button, Page, MenuItem, PopupMenu} from "../../components";
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

                if (act.children && act.children.length) {
                    PopupMenu.openMenu(e, Utils.forEach(act.children, (a: RepoAction) =>
                        MenuItem.createItem((item: MenuItem) => {
                            item.name = a.name;
                            item.icon = a.icon;
                            item.onClick = (e, props) => a.execute()
                        })));
                    if (act.action)
                        act.action();
                    return;
                }

                act.execute();

            }}>{this.page.children.render(act.name)}</Button>);
    }

    editTab() {
        // nie można importować DevRouter-a
        Endpoint.devRouter.REPO.navigate({repo: this.repo.key}, "tab");
    }


}