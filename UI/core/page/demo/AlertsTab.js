//@Flow
'use strict';
import {React, AppStatus} from '../../core';
import {Component, Spinner}from '../../components';

export default class AlertsTab extends Component {

    render() {
        return <div>
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
    }
}
