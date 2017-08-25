import {Utils, Record, Field, Repository, CRUDE, AppStatus, Ready, Dev, API} from "../../core";
import WebApiResponse from "../../webapi/Response";
import RepositoryStorage from "./RepositoryStorage";
import WebApiRequest from "../../webapi/Request";
import WebApi from "../../webapi/WebApi";

export default class WebApiRepoStorage extends RepositoryStorage {

    load(repos: Repository[]): Promise {
        return new Promise((resolve, reject) => {

            if (!API.instance) {
                reject();
                return;
            }

            const list = [];

            const add = (repo: Repository) => !repo.config.onDemand && list.push(repo.key);

            Utils.forEach(repos, repo => add(repo));

            API.repoList(data => {
                const dynamic: Repository[] = Repository.processMetaData(data);

                Utils.forEach(dynamic, (repo: Repository) => {
                    if (!(repo.config.dynamic)) return;
                    add(repo);
                    Repository.register(repo)
                });

                // potwierdzenie gotowości repozytoriów dynamicznych
                Ready.confirm(WebApiRepoStorage, WebApiRepoStorage);

                API.repoGet({repositories: list}, ok => {
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
        return (API.repoEdit({data: dto}, response => {
            if (response)
                Repository.update(this, response);
        }): WebApiRequest).promise;
    }

    action(repo: Repository, action: string, pk: any, params: Object): Promise {
        return (API.repoAction({
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