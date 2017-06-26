// @flow
'use strict';

//FixMe: importy


import {React} from "../components";
import Component from "../component/Component";
import Record from "../repository/Record";
import Repository from "../repository/Repository";
import Spinner from "../component/Spinner";
import Endpoint from "../application/Endpoint";
import * as Utils from "../utils/Utils";

export default class Page extends Component {


    endpoint: Endpoint;

    constructor(scrollable: boolean) {
        super(...arguments);
        this.endpoint = this.props.route.endpoint;
        Utils.makeFinal(this, ["endpoint"])
    }

    beginEdit(record: Record) {
        const rec = record.beginEdit(this);

        this.onDestroy(() => rec.cancelEdit());
        record.onChange.listen(this, () => this.forceUpdate());
        return rec;
    }

    submit(...records: Record) {
        const spinner = new Spinner();
        Repository.submit(this, records).then(() => {
            debugger;
            spinner.hide();
        });

    }

}



