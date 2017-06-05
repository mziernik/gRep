import {React, AppStatus} from "../../core";
import {Page, PageTitle} from "../../components";

export default class PAppTest extends Page {

    render() {
        return <div>
            <PageTitle>Procedury testowe aplikacji</PageTitle>
            <button onClick={() => AppStatus.set(this, "success", "Test: Success", "Szczegóły")}>Status [success]
            </button>

        </div>
    }
}

