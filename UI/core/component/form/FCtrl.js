// @flow
'use strict';
import {React, PropTypes, Field, Check, Utils, If} from '../../core.js';
import {Component, FontAwesome} from '../../components.js';
import Hint from "../Hint";

//ToDo wszystko

/**
 * Komponent ułatwiający obsługę obiektu Field. Umożliwia edycję i podgląd wartości, błędów i innych flag
 * Założenia:
 *  -   Komponent FCtrl wie o istnieniu innych komponentów tego typu powiązanych z polem Field (rejestruje się w tablicy Field.fctrls,
 *      w momencie zniszczenie usuwa się z niej.
 *  -   jeśli jedna z flag (error, required, description) nie jest zdefiniowana (null/undefined) wtedy komponent przeszukuje listę Field.fctrls
 *      i szacuje czy dla danej strony istnieje już kontroler obsługujący tą flagę. Jeśli nie, automatycznie ją obsługuje
 *
 */

const mode = [
    "inline", // kontrolery wyświetlane w jednej linii obok siebie: required, name, error, description
    "row", // wiersz tabeli <tr> required, name, error, description </tr>
    "block" // dwie linie 1: required, name; 2: description, value, error
];
export default class FCtrl extends Component {

    static propTypes = {
        field: PropTypes.object.isRequired,
        /** sposób wyświetlania - domyślnie inline*/
        mode: PropTypes.oneOf(mode),
        /** Pole edycyjne */
        value: PropTypes.bool,
        /** Podgląd wartości tylko do odczytu*/
        preview: PropTypes.bool,
        /** Podgląd uproszczony (np na potrzeby tabel) */
        inline: PropTypes.bool,
        /** Nazwa pola (etykieta) */
        name: PropTypes.bool,
        /** Wskaźnik błędu lub ostrzeżenia */
        error: PropTypes.bool,
        /** Wskaźnik ostrzeżenia */
        required: PropTypes.bool,
        /** Ikona podglądu opisu*/
        description: PropTypes.bool,
    };


    //przyklad = <div><FCtrl field={null} value/> <FCtrl field={null} error description/></div>

    field: Field;
    error: boolean;
    required: boolean;
    description: boolean;

    /* domyślne ikony */
    defError: Object = <span className={FontAwesome.EXCLAMATION_CIRCLE.className}
                             style={{color: 'red', margin: '0px 8px', position: 'relative'}}/>;
    defWarning: Object = <span className={FontAwesome.EXCLAMATION_TRIANGLE.className}
                               style={{color: '#ffad00', margin: '0px 8px'}}/>;
    defDesc: Object = <span className={FontAwesome.QUESTION_CIRCLE.className}
                            style={{color: '#0091ff', margin: '0px 8px'}}/>;
    defReq: Object = <span className={FontAwesome.ASTERISK.className}
                           style={{fontSize: '.7em', verticalAlign: 'top', color: 'red', margin: '0px 8px'}}/>;

    props: {
        field: Field,
        value: boolean,
        preview: boolean,
        inline: boolean,
        name: boolean,
        error: boolean,
        required: boolean,
        description: boolean,
    };
    // Wskaźnik błędu i ostrzeżenia występują zamiennie, pozostałe sumują się

    state: {
        render: boolean;
        message: ?string;
        hint: boolean;
        defIcon: Object;
    };

    constructor() {
        super(...arguments);
        this.field = Check.instanceOf(this.props.field, [Field]);

        this.field._fctrls.push(this);

        this.error=this.props.error;
        this.description=this.props.description;
        this.required=this.props.required;

        this.defError = this.props.defError || this.defError;
        this.defWarning = this.props.defWarning || this.defWarning;
        this.defDesc = this.props.defDesc || this.defDesc;
        this.defReq = this.props.defReq || this.defReq;

        this.state = {
            render: false,
            message: null,
            defIcon: this.defDesc,
            hint: false
        };

    }

    _checkFlags() {
        Utils.forEach(this.field._fctrls, (ctrl: FCtrl) => {
            if (ctrl.description) this.description = false;
            if (ctrl.required) this.required = false;
            if (ctrl.error) this.error = false;
        });

        if (If.isDefined(this.props.description)) this.description = this.props.description;
        if (If.isDefined(this.props.required)) this.required = this.props.required;
        if (If.isDefined(this.props.error)) this.error = this.props.error;

        if(!If.isDefined(this.description))this.description=true;
        if(!If.isDefined(this.required))this.required=true;
        if(!If.isDefined(this.error))this.error=true;

    }

    componentDidMount() {
        this._checkFlags();

        let msg = this.description ? this.field.config.description : null;
        if (!msg)
            msg = (this.required && this.field.config.required) ? 'Pole obowiązkowe' : null;
        const ren = msg ? true : (this.required && this.field.config.required);
        this.setState({
            render: ren,
            message: msg,
            defIcon: this.required && this.field.config.required ? this.defReq : this.defDesc,
            hint: false
        });
        if (this.error)
            this.field.onError.listen(this, (msg) => this._handleFieldErrorEvent(msg));
        if (this.error)
            this.field.onWarning.listen(this, (msg) => this._handleFieldWarningEvent(msg));
        if (this.error && this.field.error)
            this._setMessage(this.field.error, this.defError);
        else if (this.error && this.field.warning)
            this._setMessage(this.field.warning, this.defWarning);
    }

    componentWillUnmount() {
        super.componentWillUnmount(...arguments);
        this.field._fctrls.remove(this);
    }

    _handleFieldErrorEvent(msg: ?string) {
        this._setMessage(msg, this.defError);
    }

    _handleFieldWarningEvent(msg: ?string) {
        this._setMessage(msg, this.defWarning);
    }

    _setMessage(msg: ?string, icon: ?Object) {
        let m = msg || (this.description ? this.field.config.description : null);
        if (!m)
            m = (this.required && this.field.config.required) ? 'Pole obowiązkowe' : null;
        this.setState({
            defIcon: msg ? icon : this.required && this.field.config.required ? this.defReq : this.defDesc,
            message: m,
            render: m ? true : (this.required && this.field.config.required)
        });
    }

    _handleMouseEnter() {
        this.setState({
            hint: this.state.message ? true : false
        });
    }

    _handleMouseLeave() {
        this.setState({hint: false});
    }



    render() {
        return (
            <span style={{
                position: 'relative',
                visibility: this.state.render ? 'visible' : 'hidden'
            }}
                  onMouseEnter={() => this._handleMouseEnter()}
                  onMouseLeave={() => this._handleMouseLeave()}>
                {super.renderChildren() || this.state.defIcon}
                <Hint
                    visible={this.state.hint}
                    message={this.state.message}
                />
            </span>);

    }
}