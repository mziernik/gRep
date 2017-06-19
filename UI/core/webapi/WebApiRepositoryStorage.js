import {Utils, Record, Field, Repository, CRUDE} from "../core";
import WebApiResponse from "./Response";

export default class WebApiRepositoryStorage {


    methods: Object;

    constructor(methods: Object) {
        this.methods = methods;
        const repos = {};

        Utils.forEach(Repository.all, (repo: Repository) => {
            if (repo.isLocal) return;
            repos[repo.id] = repo.autoUpdate;
        });

        methods.get({repositories: repos}, (data: Object, response: WebApiResponse) => Repository.update(this, data));
    }

    static buildDTO(records: Record[]): {} {
        const dto: Object = {};
        const map: Map<Repository, Record[]> = Utils.agregate(records, (rec: Record) => rec.repository);
        map.forEach((records: Record[], repo: Repository) => {

            const obj = dto[repo.id] = [];
            records.forEach((record: Record) => {
                const r = {};
                r.action = record._action ? (record._action: CRUDE).name : null;
                r.fields = {};
                record.fields.forEach((field: Field) => {
                    if (field.changed)
                        r.fields[field._name] = field.get();
                });

                obj.push(r);
            });
        });
        return dto;
    }

    submit(context: any, records: Record[]): Promise {
        const dto: Object = WebApiRepositoryStorage.buildDTO(records);
        return this.methods.edit({data: dto}).promise;
    }
}