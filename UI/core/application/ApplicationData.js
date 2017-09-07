import {Dispatcher} from "../core";
import {PROCESS_ENV} from "../Dev";

class ApplicationData {
    onChange: Dispatcher = new Dispatcher("ApplicationData");

    uiVersion: string = PROCESS_ENV.BUILD_VERSION;
    uiDate: Date = new Date(PROCESS_ENV.BUILD_DATE);

    serviceVersion: string;
    serviceDate: Date;

}

export default new ApplicationData();
