//@Flow
'use strict';
import {React, AppStatus} from '../../core';
import {Component, Spinner}from '../../components';

export default class AlertsTab extends Component {

    render() {
        return <div>
            <button onClick={() => AppStatus.debug(this, "Test:\nDebug", "Szczegóły\n\nLinia1\nLinia2")}>Debug
            </button>
            <button
                onClick={() => AppStatus.info(this, "Test: Info", "Szczegóły:\n\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"", 0)}>
                Info
            </button>
            <button onClick={() => AppStatus.success(this, "Test: Sukces", "Szczegóły")}>Sukces</button>
            <button onClick={() => AppStatus.warning(this, "Test: Ostrzeżenie", "Szczegóły")}>Ostrzeżenie
            </button>
            <button onClick={() => AppStatus.error(this, "Test: Błąd", 0)}>Błąd</button>

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
