import ConfigField from "./ConfigField";
import * as Type from "../repository/Type";

class CoreConfig {
    api: Api = new Api();
    repo: Repo = new Repo();
    idleTimeout: ConfigField = ConfigField.create(Type.DURATION, "idleTimeout", "Maksymalny czas nieaktywności", 15 * 60 * 1000); // 15 minut
}

class Repo {
    historyBackOnCreate: ConfigField = ConfigField.create(Type.BOOLEAN, "historyBackOnCreate", "Powrót po zapisaniu nowego rekordu", true);
}

class Api {
    url: ConfigField = ConfigField.create(Type.URL, "url", "Adres URL serwera WebSocket", window.location.origin);
}

export default new CoreConfig();