import GrepApi from "./GrepApi";
import WebApi from "../core/webapi/WebApi";
import Alert from "../core/component/alert/Alert";
import WebApiResponse from "../core/webapi/Response";
import EError from "../core/utils/EError";
import Repository from "../core/repository/Repository";
import * as Utils from "../core/utils/Utils";
import WebApiRepositoryStorage from "../core/webapi/WebApiRepositoryStorage";

const wapi: WebApi = new WebApi("http://localhost:80/api");
export const api = new GrepApi(wapi);

wapi.onError = (error: EError, response: WebApiResponse, handled: boolean) => {
    Alert.error(this, error.message);
};

export function initialize() {
    Repository.externalStore = new WebApiRepositoryStorage(api.repository);
}

wapi.onEvent.listen(this, (source: string, event: string, data: object, context: WebApiResponse) => {

    switch (source) {
        case "repository":
            Repository.update(context, data);
            return;
    }

});
