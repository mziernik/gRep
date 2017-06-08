import {Utils, Record, Field, Repository, CRUDE} from "../core";
import WebApiResponse from "./Response";

export default class WebApiRepositoryStorage {


    methods: Object;

    constructor(methods: Object) {
        this.methods = methods;

        const repos: string[] = Utils.forEachMap(Repository.all, (repo: Repository) => repo.id).splice(1);

        methods.getAll({repositories: repos}, (data: Object, response: WebApiResponse) => Repository.update(this, data));
    }

    submit(context: any, records: Record[]): Promise {

        const map: Map<Repository, Record[]> = Utils.agregate(records, (rec: Record) => rec.repository);

        debugger;

        const dto: Object = {};

        map.forEach((records: Record[], repo: Repository) => {

            const obj = dto[repo.id] = [];
            records.forEach((record: Record) => {
                const r = {};
                r.action = (record._action: CRUDE).name;
                r.fields = {};
                record.fields.forEach((field: Field) => {
                    if (field.changed)
                        r.fields[field._name] = field.get();
                });

                obj.push(r);
            });

            debugger;

            this.methods.edit({data: dto}, (data: Object, response: WebApiResponse) => {
                debugger;
                alert("ok");
            });


        });

    }
}