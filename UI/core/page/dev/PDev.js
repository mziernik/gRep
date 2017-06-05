import PageDef from "../../application/PageDef";
import PSkin from "./PSkin";
import PPermissions from "./PPermissions";
import PRepositories from "./PRepositories";
import PWebTester from "./PWebTester";
import PComponents from "./PComponents";
import PLocalStorage from "./PLocalStorage";
import PEvents from "./PEvents";
import PAppTest from "./AppTest";
import PModules from "./PModules";

export default class PDev extends PageDef {

    SKIN: PageDef;
    EVENTS: PageDef;
    PERMISSIONS: PageDef;
    REPOS: PageDef;
    JS_TESTER: PageDef;
    COMPONENTS: PageDef;
    LOCAL_STORAGE: PageDef;
    APP_TEST: PageDef;
    MODULES: PageDef;

    constructor(baseUrl: string) {
        super("DEV", baseUrl, null);
        this.SKIN = this.child("Skórka", baseUrl + "/skin", PSkin);
        this.EVENTS = this.child("Zdarzenia", baseUrl + "/events", PEvents);
        this.PERMISSIONS = this.child("Funkcjonalności", baseUrl + "/permissions", PPermissions);
        this.REPOS = this.child("Repozytoria", baseUrl + "/repositories", PRepositories);
        this.JS_TESTER = this.child("WEB Tester", baseUrl + "/webtest", PWebTester);
        this.COMPONENTS = this.child("Komponenty", baseUrl + "/components", PComponents);
        this.LOCAL_STORAGE = this.child("Magazyn lokalny", baseUrl + "/localstorage", PLocalStorage);
        this.APP_TEST = this.child("Test aplikacji", baseUrl + "/apptest", PAppTest);
        this.MODULES = this.child("Moduły", baseUrl + "/modules", PModules);
        Object.preventExtensions(this);
    }

}

//----------------------------------------------- DEWELOPERSKIE --------------------------------------------------------
