import swal from './sweetalert2.js';
import './sweetalert2.css';
import {If} from "../../core";

export default class Alert {
    //ToDo: Przerobić okno alertów (wiele instancji, zawijanie wierszy, zmiana kolejności)

    static error(sender: any, message: string | Error) {
        if (message instanceof Error)
            message = message.message;
        swal('Błąd', message, 'error')
    }

    static prompt() {
        swal({
            title: 'Submit email to run ajax request',
            input: 'email',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: function (email) {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        if (email === 'taken@example.com') {
                            reject('This email is already taken.')
                        } else {
                            resolve()
                        }
                    }, 2000)
                })
            },
            allowOutsideClick: false
        }).then(function (email) {
            swal({
                type: 'success',
                title: 'Ajax request finished!',
                html: 'Submitted email: ' + email
            })
        })
    }

    static confirm(sender: any, message: string, onConfirm: () => void, onReject: () => void) {
        swal({
            title: message,
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
            allowOutsideClick: false
        })
            .then(() => If.isFunction(onConfirm, f => f()))
            .catch(() => If.isFunction(onReject, f => f()));
    }

}