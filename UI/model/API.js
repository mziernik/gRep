import GrepApi from "./GrepApi";
import WebApi from "../core/webapi/WebApi";
import Alert from "../core/component/alert/Alert";
import WebApiResponse from "../core/webapi/Response";
import EError from "../core/utils/EError";
import Repository from "../core/repository/Repository";
import * as Utils from "../core/utils/Utils";

const wapi: WebApi = new WebApi("http://localhost:80/api");
export const api = new GrepApi(wapi);

wapi.onError = (error: EError, response: WebApiResponse, handled: boolean) => {
    Alert.error(this, error.message);
};

export function initialize() {

    const repos: string[] = Utils.forEachMap(Repository.all, (repo: Repository) => repo.id).splice(1);

    api.model.getAll({repositories: repos}, (data: Object, response: WebApiResponse) => Repository.processDTO(this, data));
}