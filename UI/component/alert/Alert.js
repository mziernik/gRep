import swal from './sweetalert2';

export default class Alert {
    //ToDo: Przerobić okno alertów (wiele instancji, zawijanie wierszy, zmiana kolejności)

    static error(sender: any, message: string | Error) {
        if (message instanceof Error)
            message = message.message;
        swal('Błąd', message, 'error')
    }

}