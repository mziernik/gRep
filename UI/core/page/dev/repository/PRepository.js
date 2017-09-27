import {React, PropTypes, Field, Utils, Column, Repository, Record, Type, Endpoint, CRUDE} from '../../../core';
import {
    Page,
    Icon,
    Link,
    Btn,
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
import RepoTable from "../../../component/repository/RepoTable";
import {RecordDataGenerator} from "../../../repository/Record";
import WebApiResponse from "../../../webapi/Response";
import RepoPage from "../../base/RepoPage";
import RecordCtrl from "../../../component/repository/RecordCtrl";
import RepoCtrl from "../../../component/repository/RepoCtrl";


export default class PRepository extends RepoPage {


    showAdv: Field = Field.create(Type.BOOLEAN, "showAdv", "Pokaż zaawansowane", false);

    constructor(props: Object, context: Object, updater: Object) {
        super(props.repo, ...arguments);
        this.showAdv.onChange.listen(this, () => this.forceUpdate(true));
    }

    onReady(repo: Repository, list: Repository[]) {

        super.onReady(repo, list);
        this.renderActionButtons(null);

        this.buttons.add((btn: Btn) => {
            btn.key = "btnGenerator";
            btn.type = "default";
            btn.icon = Icon.CLOCK_O;
            btn.text = "Generator";
            btn.onClick = () => ModalWindow.create((mw: ModalWindow) => this._generateData(mw)).open();
        });

        this.buttons.add((btn: Btn) => {
            btn.key = "btnDetails";
            btn.type = "default";
            btn.link = Endpoint.devRouter.REPO_DETAILS.getLink({repo: this.repo.key});
            btn.title = "Szczegóły repozytorium";
            btn.icon = Icon.INFO;
            btn.text = "Szczegóły";
        });

        this.buttons.add((btn: Btn) => {
            btn.key = "btnAdd";
            btn.type = "primary";
            btn.onClick = e => RecordCtrl.actionCreate(this.repo, e);
            btn.title = "Dodaj nowy rekord";
            btn.icon = Icon.PLUS;
            btn.text = "Dodaj";
            btn.disabled = !this.repo.canCreate;
        });
    }

    render() {
        this.repo = Repository.get(this.props.repo, true);
        this.title.set(`Repozytorium "${this.repo.name}"`);

        if (this.repo.error)
            return Page.renderError(this, this.repo.error);

        let hasAdv = false; // !!Utils.find(this.repo.columns, (col: Column) => col.disabled);

        return [
            <div key={Utils.randomId()}>
                <FCtrl ignore={!hasAdv} field={this.showAdv} value={1} name={2}/>
            </div>,
            <RepoTable key={Utils.randomId()} repoCtrl={new RepoCtrl(this.repo)} showAdvanced={this.showAdv.value}/>
        ]
    }


    _generateData(mw: ModalWindow) {

        const gen: RecordDataGenerator = new RecordDataGenerator(this.repo);
        const seq: Field = Field.create(Type.BOOLEAN, "seq", "Sekwencyjny", false);
        const rnd: Field = Field.create(Type.BOOLEAN, "rnd", "Losowe wartości", false);
        const local: Field = Field.create(Type.BOOLEAN, "local", "Lokalne", true);
        const instance: Field = Field.create(Type.BOOLEAN, "instance", "Numer instancji", false);
        const cnt: Field = Field.create(Type.INT, "cnt", "Ilość", 10);
        const factor: Field = Field.create(Type.INT, "factor", "Procent wypełnienia", 30);

        seq.config.description = "Tryb sekwencyjny - generuj rekordy kolejno jeden po drugim zamiast zbiorczo";
        rnd.config.description = "Generuj wartości losowe zamiast sekwencyjnych (kolejnych)";
        local.config.description = "Generuj rekordy tylko lokalnie (nie zapisuj w bazie)";
        instance.config.description = "Dodaj wartość instancji do pol tekstowych\n(przydatne do identyfikacji grup generowanych rekordów)";
        cnt.config.description = "Ilość generowanych rekordów";
        factor.config.description = "Procent wypełnienia wartości nie wymaganych pól";
        factor.config.defaultUnit = "%";

        mw.title = "Wypełniacz";
        mw.icon = Icon.CLOCK_O;
        mw.content = <Attributes fill style={{margin: "10px"}} edit>
            <Attr field={seq}/>
            <Attr field={local}/>
            <Attr field={rnd}/>
            <Attr field={instance}/>
            <Attr field={cnt}/>
            <Attr field={factor}/>
            <h6>Wartości domyślne:</h6>
            {gen.fields.map((f: Field) => <Attr field={f} edit/>)}
        </Attributes>;

        mw.buttons = MW_BUTTONS.OK_CANCEL;
        mw.onConfirm = () => {
            const spinner: Spinner = Spinner.create();

            try {
                gen.random = rnd.value;
                gen.sequence = seq.value;
                gen.total = cnt.value;
                gen.local = local.value;

                const rec = (idx: number) => {
                    const rec: Record = this.repo.createRecord(this, CRUDE.CREATE);
                    rec.localCommit = local.value;
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

    }


}

