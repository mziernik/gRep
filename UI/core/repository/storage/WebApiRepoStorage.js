import {Utils, Record, Field, Repository, CRUDE, AppStatus, Ready, Dev} from "../../core";
import WebApiResponse from "../../webapi/Response";
import RepositoryStorage from "./RepositoryStorage";
import WebApiRequest from "../../webapi/Request";
import WebApi from "../../webapi/WebApi";

export default class WebApiRepoStorage extends RepositoryStorage {

    methods: Object;
    api: WebApi;

    constructor(api: WebApi, methods: Object) {
        super();
        this.api = api;
        this.methods = methods;
        const repos = {};
    }

    load(repos: Repository[]): Promise {
        return new Promise((resolve, reject) => {

            const list = [];

            const add = (repo: Repository) => !repo.config.onDemand && list.push(repo.key);

            Utils.forEach(repos, repo => add(repo));

            this.methods.list(data => {
                const dynamic: Repository[] = Repository.processMetaData(data);

                Utils.forEach(dynamic, (repo: Repository) => {
                    if (!(repo.config.dynamic)) return;
                    add(repo);
                    Repository.register(repo)
                });

                // potwierdzenie gotowości repozytoriów dynamicznych
                Ready.confirm(WebApiRepoStorage, WebApiRepoStorage);

                this.methods.get({repositories: list}, ok => {
                    resolve(ok);
                }, (err) => {
                    if (this.api && !this.api.transport.connected)
                        return;
                    AppStatus.error(this, err);
                    reject(err);
                });

            }, err => {
                reject(err);
            });
        });
    }


    save(context: any, records: Record[]): Promise {
        const dto: Object = Repository.buildDTO(records, false);

        if (!dto)
            return new Promise((resolve, reject) => resolve());

        Dev.log(context, "Save", dto);
        return (this.methods.edit({data: dto}, response => {
            if (response)
                Repository.update(this, response);
        }): WebApiRequest).promise;
    }

    action(repo: Repository, action: string, pk: any, params: Object): Promise {
        return (this.methods.action({
            repo: repo.key,
            action: action,
            pk: pk,
            params: params
        }, response => {
            const result = response.result;
            if (response.repositories)
                Repository.update(this, response.repositories);

        }): WebApiRequest).promise;
    }

}