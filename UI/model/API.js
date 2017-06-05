import GrepApi from "./GrepApi";
import WebApi from "../core/webapi/WebApi";
import Alert from "../core/component/alert/Alert";

const wapi: WebApi = new WebApi("http://localhost:80/api");
export const api = new GrepApi(wapi);

wapi.onError = (error: EError, response: WebApiResponse, handled: boolean) => {
    Alert.error(this, error.message);
};

export function initialize() {

    api.model.getAll({repositories: ["categoryAttr"]}, (data: Object, response: WebApiResponse) => {
        debugger;
    })
}