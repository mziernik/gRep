import Endpoint from "../../application/Endpoint";
import PSkin from "./PSkin";
import PPermissions from "./PPermissions";
import PRepositories from "./repository/PRepositories";
import PWebTester from "./PWebTester";
import PComponents from "./PComponents";
import PLocalStorage from "./PLocalStorage";
import PEvents from "./PEvents";
import PModules from "./PModules";
import PRepository from "./repository/PRepository";
import PRecord from "./repository/PRecord";
import Repository from "../../repository/Repository";
import AppEvent from "../../application/Event";
import Demo from "../demo/PDemo";
import PContextObject from "./PContextObject";
import PRepoDetails from "./repository/PRepoDetails";
import PIcons from "./PIcons";
import * as Utils from "../../utils/Utils";

export default class DevRouter extends Endpoint {

    static INSTANCES: DevRouter[] = [];

    DEMO: Endpoint;
    SKIN: Endpoint;
    EVENTS: Endpoint;
    PERMISSIONS: Endpoint;
    REPOS: Endpoint;
    JS_TESTER: Endpoint;
    COMPONENTS: Endpoint;
    LOCAL_STORAGE: Endpoint;
    MODULES: Endpoint;
    CTX_OBJS: Endpoint;
    ICONS: Endpoint;

    REPO: Endpoint;
    REPO_DETAILS: Endpoint;
    RECORD: Endpoint;

    constructor(baseUrl: string) {
        super("dev", "#dev", baseUrl, null);

        this.REPOS = this.child("repos", "Repozytoria", baseUrl + "/repositories", PRepositories);
        this.REPO = this.REPOS.child("repo", "Repozytorium", this.REPOS._path + "/:repo", PRepository).hidden(true);
        this.REPO_DETAILS = this.REPOS.child("repodetails", "Szczegóły", this.REPOS._path + "/:repo/details", PRepoDetails).hidden(true);
        this.DEMO = this.child("demo", "Demo", baseUrl + "/demo", Demo);
        this.SKIN = this.child("skin", "Skórka", baseUrl + "/skin", PSkin);
        this.EVENTS = this.child("events", "Zdarzenia", baseUrl + "/events", PEvents);
        this.PERMISSIONS = this.child("perms", "Uprawnienia", baseUrl + "/permissions", PPermissions);

        this.JS_TESTER = this.child("webTester", "WEB Tester", baseUrl + "/webtest", PWebTester);
        this.COMPONENTS = this.child("components", "Komponenty", baseUrl + "/components", PComponents);
        this.CTX_OBJS = this.child("ctxObjs", "Obiekty kontekstu", baseUrl + "/ctxobj", PContextObject);

        this.LOCAL_STORAGE = this.child("localStorage", "Magazyn lokalny", baseUrl + "/localstorage", PLocalStorage);
        this.MODULES = this.child("modules", "Moduły", baseUrl + "/modules", PModules);
        this.ICONS = this.child("icons", "Ikony", `${baseUrl}/icons`, PIcons);


        this.RECORD = this.REPOS.child("rec", "Rekord", this.REPOS._path + "/:repo/edit/:id", PRecord)
            .defaultParams({
                repo: "permissions",
                rec: null
            }).hidden(true);

        this.REPOS.REPO = this.REPO;
        this.REPO.RECORD = this.RECORD;
        this.REPO.REPO_DETAILS = this.REPO_DETAILS;

        DevRouter.INSTANCES.push(this);

        Object.preventExtensions(this);

        AppEvent.REPOSITORY_REGISTERED.listen(this, data => {
                const repo: Repository = data.repository;
                const group = repo.config.group;
                let parent: Endpoint = this.REPOS;
                if (group) {
                    let key = Utils.formatId(group).toLowerCase();
                    parent = this.REPOS._children.find((e: Endpoint) => e.key.endsWith("." + key));
                    if (!parent)
                        parent = this.REPOS.child(key, group, null, null);
                }
                parent.child(repo.key.replaceChars(".-", ""), repo.name, this.REPOS._path + "/" + repo.key, PRepository).icon(repo.config.icon);
            }
        );

    }

}


//----------------------------------------------- DEWELOPERSKIE --------------------------------------------------------
