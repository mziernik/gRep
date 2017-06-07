import Endpoint from "../../application/Endpoint";
import PSkin from "./PSkin";
import PPermissions from "./PPermissions";
import PRepositories from "./repository/PRepositories";
import PWebTester from "./PWebTester";
import PComponents from "./PComponents";
import PLocalStorage from "./PLocalStorage";
import PEvents from "./PEvents";
import PAppTest from "./AppTest";
import PModules from "./PModules";
import PRepository from "./repository/PRepository";
import PRecord from "./repository/PRecord";

export default class DevRouter extends Endpoint {

    SKIN: Endpoint;
    EVENTS: Endpoint;
    PERMISSIONS: Endpoint;
    REPOS: Endpoint;
    JS_TESTER: Endpoint;
    COMPONENTS: Endpoint;
    LOCAL_STORAGE: Endpoint;
    APP_TEST: Endpoint;
    MODULES: Endpoint;

    REPO: Endpoint;
    RECORD: Endpoint;

    constructor(baseUrl: string) {
        super("DEV", baseUrl, null);
        this.SKIN = this.child("Skórka", baseUrl + "/skin", PSkin);
        this.EVENTS = this.child("Zdarzenia", baseUrl + "/events", PEvents);
        this.PERMISSIONS = this.child("Funkcjonalności", baseUrl + "/permissions", PPermissions);

        this.JS_TESTER = this.child("WEB Tester", baseUrl + "/webtest", PWebTester);
        this.COMPONENTS = this.child("Komponenty", baseUrl + "/components", PComponents);
        this.LOCAL_STORAGE = this.child("Magazyn lokalny", baseUrl + "/localstorage", PLocalStorage);
        this.APP_TEST = this.child("Test aplikacji", baseUrl + "/apptest", PAppTest);
        this.MODULES = this.child("Moduły", baseUrl + "/modules", PModules);

        this.REPOS = this.child("Repozytoria", baseUrl + "/repositories", PRepositories);
        this.REPO = this.REPOS.child("Repozytorium", this.REPOS._path + "/:repo", PRepository).defaultParams({repo: "permissions"});
        this.RECORD = this.REPOS.child("Rekord", this.REPOS._path + "/:repo/:rec", PRecord).defaultParams({
            repo: "permissions",
            rec: null
        });

        this.REPOS.REPO = this.REPO;
        this.REPO.RECORD = this.RECORD;

        Object.preventExtensions(this);
    }

}


//----------------------------------------------- DEWELOPERSKIE --------------------------------------------------------
