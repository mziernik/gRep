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

    editTab() {
        // nie można importować DevRouter-a
        Endpoint.devRouter.REPO.navigate({repo: this.repo.key}, "tab");
    }

    renderActionButtons() {
        Utils.forEach(this.repo.config.actions, (act: RepoAction) => {
                if (!act.rec)
                    this.page.buttons.add((btn: Btn) => {
                        btn.key = act.key;
                        btn.icon = act.icon;
                        btn.text = act.name;
                        btn.confirm = act.confirm;
                        btn.onClick = e => {
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
                        }
                    });
            }
        );
    }

}