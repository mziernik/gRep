import {React, PropTypes, Field, Utils, Column, Repository, Record, Type, Endpoint, CRUDE} from '../../../core';
import {
    Page,
    Icon,
    Link,
    Table,
    FCtrl,
    Panel,
    Button,
    ModalWindow,
    MW_BUTTONS,
    Attributes,
    Attr,
    Alert,
    Spinner
} from '../../../components';
import RepoCtrl from "../../../component/repository/RepoCtrl";
import RecordCtrl from "../../../component/repository/RecordCtrl";
import DevRouter from "../DevRouter";
import RepoTable from "../../../component/repository/RepoTable";
import {RecordDataGenerator} from "../../../repository/Record";
import WebApiResponse from "../../../webapi/Response";


export default class PRepository extends Page {

    repo: ?Repository = null;
    showAdv: Field = Field.create(Type.BOOLEAN, "showAdv", "Pokaż zaawansowane", false);

    constructor() {
        super(...arguments);
        this.requireRepo(this.props.repo);
        this.showAdv.onChange.listen(this, () => this.forceUpdate(true));
    }


    _dataGenerator() {
        return <Button
            title="Benchmark"
            icon={Icon.CLOCK_O}
            onClick={() => ModalWindow.create((mw: ModalWindow) => {

                const seq: Field = Field.create(Type.BOOLEAN, "seq", "Sekwencyjny", false);
                const rnd: Field = Field.create(Type.BOOLEAN, "rnd", "Losowe wartości", false);
                const all: Field = Field.create(Type.BOOLEAN, "all", "Wszystkie pola", false);
                const cnt: Field = Field.create(Type.INT, "cnt", "Ilość", 10);

                const fields = Utils.forEach(this.repo.columns, (c: Column) => new Field(c));

                mw.title = "Wypełniacz";
                mw.icon = Icon.CLOCK_O;
                mw.content = <div>
                    <Attributes style={{margin: "10px"}} edit>
                        <Attr field={seq}/>
                        <Attr field={rnd}/>
                        <Attr field={all}/>
                        <Attr field={cnt}/>
                        <h6>Wartości domyślne:</h6>
                        {fields.map((f: Field) => <Attr field={f} edit/>)}
                    </Attributes>;
                </div>;

                mw.buttons = MW_BUTTONS.OK_CANCEL;
                mw.onConfirm = () => {
                    const spinner: Spinner = new Spinner();

                    try {
                        const gen: RecordDataGenerator = new RecordDataGenerator();
                        gen.fields = fields;
                        gen.random = rnd.value;
                        gen.sequence = seq.value;
                        gen.total = cnt.value;
                        gen.all = all.value;

                        const rec = (idx: number) => {
                            const rec: Record = this.repo.createRecord(this, CRUDE.CREATE);
                            this.repo.fillRecord(gen, rec, idx);
                            return rec;
                        };

                        const list = [];
                        for (let i = 0; i < cnt.value; i++)
                            list.push(rec(i + 1));
                        const length = list.length;

                        let totalBackend = 0;
                        let totalFrontend = 0;


                        const times = [];

                        let ts = new Date().getTime();

                        const next = () => {
                            Repository.commit(this, list.shift())
                                .then(e => {
                                    const resp: WebApiResponse = e[0];
                                    totalBackend += resp.processTime;
                                    times.push(resp.processTime);

                                    if (list.length) {
                                        next();
                                        return;
                                    }

                                    let min = 99999999999999;
                                    let max = 0;
                                    let avg = 0;
                                    times.forEach(t => {
                                        if (t > max) max = t;
                                        if (t < min) min = t;
                                        avg += t;
                                    });

                                    avg = Math.round(avg / times.length);

                                    spinner.hide();

                                    totalFrontend = new Date().getTime() - ts - totalBackend;

                                    Alert.info(`backend: ${Utils.formatTime(totalBackend)} (${min} / ${avg} / ${max}), frontend: ${Utils.formatTime(totalFrontend)} `,
                                        "Test sekwencyjny, " + length + " rekordów");
                                }).catch(() => {
                                spinner.hide();
                            });
                        };


                        if (seq.value) {
                            next();
                            return;
                        }

                        Repository.commit(this, list)
                            .then(e => {
                                spinner.hide();
                                const resp: WebApiResponse = e[0];

                                let avg = Math.round(resp.processTime / cnt.value);

                                totalFrontend = new Date().getTime() - ts - resp.processTime;
                                Alert.info(`backend: ${resp.processTime} ms (średnia: ${avg}), frontend: ${totalFrontend} ms`,
                                    "Test grupowy, " + length + " rekordów");
                            }).catch(() => {
                            spinner.hide();
                        });


                    } catch (e) {
                        spinner.hide();
                        Alert.error(e);
                    }


                }
            }).open()
            }/>
    }

    render() {
        this.repo = Repository.get(this.props.repo, true);

        let hasAdv = !!Utils.find(this.repo.columns, (col: Column) => col.disabled);

        const rctrl: RepoCtrl = new RepoCtrl(this, this.repo);


        return <Panel fit>
            {super.renderTitle(`Repozytorium "${this.repo.name}"`)}

            {this.renderToolBar([
                this._dataGenerator(),
                ...rctrl.renderActionButtons(),
                <Button
                    key="btnDetails"
                    type="default"
                    link={Endpoint.devRouter.REPO_DETAILS.getLink({
                        repo: this.repo.key
                    })}
                    title="Szczegóły repozytorium"
                    icon={Icon.INFO}>Szczegóły</Button>,
                <Button
                    key="btnAdd"
                    type="primary"
                    link={Endpoint.devRouter.RECORD.getLink({
                        repo: this.repo.key,
                        id: "~new"
                    })}
                    title="Dodaj nowy rekord"
                    disabled={!this.repo.canCreate}
                    icon={Icon.PLUS}
                >Dodaj</Button>
            ])}

            <div>
                <FCtrl ignore={!hasAdv} field={this.showAdv} value={1} name={2}/>
            </div>

            <RepoTable key={Utils.randomId()} repository={this.repo} showAdvanced={this.showAdv.value}/>

        </Panel>
    }
}

