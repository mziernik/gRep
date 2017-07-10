import {React, AppStatus} from "../../core";
import {Page, Spinner, Panel} from "../../components";

export default class PAppTest extends Page {

    render() {
        return <Panel fit>
            {super.renderTitle("Procedury testowe aplikacji")}
            <div>
                <button onClick={() => AppStatus.debug(this, "Test:\nDebug", "Szczegóły\n\nLinia1\nLinia2")}>Debug
                </button>
                <button onClick={() => AppStatus.info(this, "Test: Info", "Szczegóły")}>Info</button>
                <button onClick={() => AppStatus.success(this, "Test: Sukces", "Szczegóły")}>Sukces</button>
                <button onClick={() => AppStatus.warning(this, "Test: Ostrzeżenie", "Szczegóły")}>Ostrzeżenie</button>
                <button onClick={() => AppStatus.error(this, "Test: Błąd")}>Błąd</button>

                <hr/>

                <button
                    onClick={() => {
                        const spinner = new Spinner();
                        setTimeout(() => spinner.hide(), 3000);
                    }
                    }
                >Spinner 3s
                </button>

                <button
                    onClick={() => {
                        const spinner = new Spinner();
                        //  setTimeout(() => spinner.hide(), 1);
                    }
                    }
                >Spinner 0
                </button>
            </div>
        </Panel>
    }
}

