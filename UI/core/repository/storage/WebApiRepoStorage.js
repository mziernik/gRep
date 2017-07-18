import {Utils, Record, Field, Repository, CRUDE, AppStatus, Ready, Debug} from "../../core";
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
                const dynamic: Repository[] = Repository.processList(data);

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

    static buildDTO(records: Record[], includeUnchanged: boolean = false, crude: CRUDE): {} {
        const dto: Object = {};
        const map: Map<Repository, Record[]> = Utils.agregate(records, (rec: Record) => rec.repo);

        map.forEach((records: Record[], repo: Repository) => {

            const obj = dto[repo.key] = [];
            records.forEach((record: Record) => {
                const r = {};
                record.fields.forEach((field: Field) => {
                    if (includeUnchanged || field.changed || record.primaryKey === field) {
                        const value = field.value;
                        if (value === null && crude === CRUDE.CREATE)
                            return;
                        r[field.key] = field.type.serialize(value);
                    }

                });

                obj.push(r);
            });
        });
        return dto;
    }

    save(context: any, records: Record[], crude: CRUDE): Promise {
        const dto: Object = WebApiRepoStorage.buildDTO(records, crude === CRUDE.CREATE, crude);

        Debug.log(context, "Save", dto);
        return (this.methods.edit({data: dto}): WebApiRequest).promise;
    }

    action(repo: Repository, action: string, pk: any, params: object): Promise {
        return (this.methods.action({
            repo: repo.key,
            action: action,
            pk: pk,
            params: params
        }): WebApiRequest).promise;
    }

}