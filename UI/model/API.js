import GrepApi from "./GrepApi";
import WebApi from "../core/webapi/WebApi";
import Alert from "../core/component/alert/Alert";
import WebApiResponse from "../core/webapi/Response";
import EError from "../core/utils/EError";
import Repository from "../core/repository/Repository";
import WebApiRepositoryStorage from "../core/repository/storage/WebApiRepoStorage";

const wapi: WebApi = new WebApi("http://localhost:80/api");
export const api = new GrepApi(wapi);

wapi.onError = (error: EError, response: WebApiResponse, handled: boolean) => {
    if (!handled)
        Alert.error(this, error.message);
};

Repository.defaultStorage = new WebApiRepositoryStorage(wapi, api.repository);

wapi.onEvent.listen("API", obj => {

    switch (obj.source) {
        case "repository":
            Repository.update(obj.response, obj.data);
            return;
    }

});


