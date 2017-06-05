import './sweetalert2.js';
import './sweetalert2.css';
import {If} from "../../components";

export default class Alert {
    //ToDo: Przerobić okno alertów (wiele instancji, zawijanie wierszy, zmiana kolejności)

    static error(sender: any, message: string | Error) {
        if (message instanceof Error)
            message = message.message;
        swal('Błąd', message, 'error')
    }

    static confirm(sender: any, message: string, onConfirm: () => void, onReject: () => void) {

        const result = window.confirm(message);

        if (result && If.isFunction(onConfirm))
            onConfirm();

        if (!result && If.isFunction(onReject))
            onReject();

    }

}