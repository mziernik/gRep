import {React, PropTypes, Field, Utils, Column, Repository, Record, Type, Endpoint} from '../../../core';
import {Page, Icon, Link, Table, FCtrl, Panel, Button} from '../../../components';
import RepoCtrl from "../../../component/repository/RepoCtrl";
import RecordCtrl from "../../../component/repository/RecordCtrl";
import DevRouter from "../DevRouter";
import RepoTable from "../../../component/repository/RepoTable";


export default class PRepository extends Page {

    repo: ?Repository = null;
    showAdv: Field = Field.create(Type.BOOLEAN, "showAdv", "Pokaż zaawansowane", false);

    constructor() {
        super(...arguments);
        this.requireRepo(this.props.repo);
        this.showAdv.onChange.listen(this, () => this.forceUpdate(true));
    }

    render() {
        this.repo = Repository.get(this.props.repo, true);

        let hasAdv = !!Utils.find(this.repo.columns, (col: Column) => col.disabled);

        const rctrl: RepoCtrl = new RepoCtrl(this, this.repo);


        return <Panel fit>
            {super.renderTitle(`Repozytorium "${this.repo.name}"`)}

            {this.renderToolBar([
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

