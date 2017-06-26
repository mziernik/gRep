import {Utils, Record, Field, Repository, CRUDE} from "../../core";
import WebApiResponse from "../../webapi/Response";
import RepositoryStorage from "./RepositoryStorage";
import WebApiRequest from "../../webapi/Request";

export default class WebApiRepoStorage extends RepositoryStorage {

    methods: Object;

    constructor(methods: Object) {
        super();

        this.methods = methods;
        const repos = {};

        // Utils.forEach(Repository.all, (repo: Repository) => {
        //     if (repo.isLocal) return;
        //     repos[repo.key] = repo.autoUpdate;
        // });
        //
        // methods.get({repositories: repos}, (data: Object, response: WebApiResponse) => Repository.update(this, data));
    }

    load(repos: Repository[]): Promise {
        const list = {};
        Utils.forEach(repos, (repo: Repository) => list[repo.key] = repo.autoUpdate);
        return (this.methods.get({repositories: list}): WebApiRequest).promise;
    }

    static buildDTO(records: Record[], includeUnchanged: boolean = false): {} {
        const dto: Object = {};
        const map: Map<Repository, Record[]> = Utils.agregate(records, (rec: Record) => rec.repository);

        map.forEach((records: Record[], repo: Repository) => {

            const obj = dto[repo.key] = [];
            records.forEach((record: Record) => {
                const r = {};
                r.action = record._action ? (record._action: CRUDE).name : null;
                r.fields = {};
                record.fields.forEach((field: Field) => {
                    if (includeUnchanged || field.changed)
                        r.fields[field.key] = field.type.serialize(field.value);
                });

                obj.push(r);
            });
        });
        return dto;
    }

    save(context: any, records: Record[]): Promise {
        const dto: Object = WebApiRepoStorage.buildDTO(records);
        return (this.methods.edit({data: dto}): WebApiRequest).promise;
    }
}