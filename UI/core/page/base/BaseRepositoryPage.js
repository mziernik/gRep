// @flow

import {React, Repository, Endpoint, Is, Record, Utils} from "../../core.js";
import {Page, Panel, Icon, Button} from "../../components.js";
import RepoTable from "../../component/repository/RepoTable";
import {object} from "../../utils/Is";
import {Btn} from "../../component/Button";
import RepoPage from "./RepoPage";
import {EReportInfo, R_REPORT_INFO, RReportInfo} from "../../../model/Repositories";
import {RepoCursor} from "../../repository/Repository";
import {MenuItem, PopupMenu} from "../../component/PopupMenu";
import ReportWindow from "../../../page/reports/ReportWindow";
import RecordCtrl from "../../component/repository/RecordCtrl";
import * as AppConfig from "../../../model/AppConfig";
import * as CRUDE from "../../repository/CRUDE";


export default class BaseRepositoryPage extends RepoPage {

    recordEndpoint: Endpoint;
    modalEdit: boolean;
    defaultTarget: string = null; //tab, popup
    reports: EReportInfo[] = [];
    rowFilter: (rec: Record) => boolean = null;

    constructor(repository: Repository, recordEndpoint: Endpoint, props: Object, context: Object, updater: Object) {
        super(repository, props, context, updater);
        this.recordEndpoint = props.recordEndpoint || recordEndpoint;
        this.rowFilter = props.rowFilter;
    }

    onReady(repo: Repository, list: Repository[]) {
        super.onReady(repo, list);

        if (repo.canCreate)
            this.buttons.add((btn: Btn) => {
                btn.type = "primary";
                btn.text = "Dodaj";
                btn.icon = Icon.PLUS;
                btn.onClick = e => this.navigate(null, this.defaultTarget || e);
            });
/*
        R_REPORT_INFO.find(this, (cursor: RepoCursor) => {
            const repos: [] = cursor.get(RReportInfo.LINKED_REPOSITORIES);
            if (repos && repos.contains(this.repo.key))
                this.reports.push(cursor.getRecord(this));
        });
        if (!this.reports.length) return;


        const displayReport = (report: EReportInfo) => {
            const url = AppConfig.reports.host.value + Utils.processVariables(AppConfig.reports.viewer.value, v => {
                switch (v) {
                    case "id":
                        return this.report.ID.value;
                        throw new Error("Nieznana zmienna: " + v);
                }
            });

            window.open(url);
        };

        this.buttons.insert((btn: Btn) => {
                btn.type = "default";
                btn.text = "Raport";
                btn.icon = Icon.TH_LIST;
                btn.onClick = e => {

                    const items = Utils.forEach(this.repo.rows, (v, k) => k);
                    if (this.reports.length === 1) {
                        displayReport(this.reports[0], items).open();
                        return;
                    }
                    PopupMenu.open(e, Utils.forEach(this.reports, (report: EReportInfo) =>
                        MenuItem.create((item: MenuItem) => {
                            item.name = report.REPORT_NAME.value;
                            item.onClick = () => {

                                this.url = AppConfig.reports.host.value + Utils.processVariables(AppConfig.reports.viewer.value, v => {
                                    switch (v) {
                                        case "id":
                                            return this.report.ID.value;
                                            throw new Error("Nieznana zmienna: " + v);
                                    }
                                });

                            };
                        })
                    ));
                };
            }
        );*/
    }

    navigate(rec: Record, e: Event) {
        if (this.modalEdit) {
            new RecordCtrl(rec || this.repo.createRecord(null, CRUDE.CREATE)).modalEdit();
            return;
        }

        this.recordEndpoint.navigate({id: rec ? rec.pk : "~new"}, this.defaultTarget || e);
    }

    render() {
        this.title.set(this.repo.name);
        return <RepoTable
            modalEdit={this.modalEdit}
            repository={this.repo}
            rowFilter={this.rowFilter}
            onClick={(...args) => this.navigate(...args)}
        />
    }


}

