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
import PFontAwesome from "./PFontAwesome";
import Repository from "../../repository/Repository";
import AppEvent from "../../application/Event";
import Demo from "../demo/PDemo";
import PContextObject from "./PContextObject";

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
    APP_TEST: Endpoint;
    MODULES: Endpoint;
    FONT_AWESOME: Endpoint;

    REPO: Endpoint;
    RECORD: Endpoint;

    constructor(baseUrl: string) {
        super("dev", "#dev", baseUrl, null);

        this.REPOS = this.child("repos", "Repozytoria", baseUrl + "/repositories", PRepositories);
        this.REPO = this.REPOS.child("repo", "Repozytorium", this.REPOS._path + "/:repo", PRepository)
            .defaultParams({repo: "permissions"})
            .hidden(true);

        this.DEMO = this.child("demo", "Demo", baseUrl + "/demo", Demo);
        this.SKIN = this.child("skin", "Skórka", baseUrl + "/skin", PSkin);
        this.EVENTS = this.child("events", "Zdarzenia", baseUrl + "/events", PEvents);
        this.PERMISSIONS = this.child("perms", "Uprawnienia", baseUrl + "/permissions", PPermissions);

        this.JS_TESTER = this.child("webTester", "WEB Tester", baseUrl + "/webtest", PWebTester);
        this.COMPONENTS = this.child("components", "Komponenty", baseUrl + "/components", PComponents);
        this.CTX_OBJS = this.child("ctxObjs", "Obiekty kontekstu", baseUrl + "/ctxobj", PContextObject);


        this.LOCAL_STORAGE = this.child("localStorage", "Magazyn lokalny", baseUrl + "/localstorage", PLocalStorage);
        this.MODULES = this.child("modules", "Moduły", baseUrl + "/modules", PModules);

        this.FONT_AWESOME = this.child("fontAwesome", "Font Awesome", baseUrl + "/fontawesome", PFontAwesome);

        this.RECORD = this.REPOS.child("rec", "Rekord", this.REPOS._path + "/:repo/:rec", PRecord)
            .defaultParams({
                repo: "permissions",
                rec: null
            }).hidden(true);

        this.REPOS.REPO = this.REPO;
        this.REPO.RECORD = this.RECORD;

        DevRouter.INSTANCES.push(this);

        Object.preventExtensions(this);

        AppEvent.REPOSITORY_REGISTERED.listen(this, (repo: Repository) => {
                this.REPOS.child(repo.key, repo.name, this.REPOS._path + "/" + repo.key, PRepository)
                    .icon(repo.config.icon);
            }
        );

    }

}


//----------------------------------------------- DEWELOPERSKIE --------------------------------------------------------
