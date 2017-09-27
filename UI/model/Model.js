import * as Repositories from "./Repositories";
import {RepoTree} from "../core/repository/Repository";
import * as Router from "../page/Router";
import Endpoint from "../core/application/Endpoint";
import {RCatalog} from "./Repositories";
import PCatalogs from "../page/PCatalog";

let catalogTree: RepoTree;

export function init() {

    function visit(tree: RepoTree, ep: Endpoint) {

        if (tree !== tree.root)
            ep = ep.child("" + tree.get(RCatalog.ID), tree.get(RCatalog.NAME), Router.CATALOGS._path, PCatalogs)
                .defaultParams({id: tree.get(RCatalog.ID)});

        tree.children.forEach((rt: RepoTree) => visit(rt, ep));
    }

    Repositories.R_CATALOG.onChange.listenDelayed("model", 10, () => {
        catalogTree = Repositories.R_CATALOG.tree();
        visit(catalogTree, Router.CATALOGS)
    });

}

