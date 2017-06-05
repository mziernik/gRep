// @flow
'use strict';
import {React, PropTypes, Field, Check} from '../core';
import {Component, FontAwesome} from '../components';
import Hint from "./Hint";

export default class FieldController extends Component {

    field: Field;

    /* domyślne ikony */
    defError: Object = <span className={FontAwesome.EXCLAMATION_CIRCLE.className} style={{color: 'red', margin: '0px 8px'}}/>;
    defWarning: Object = <span className={FontAwesome.EXCLAMATION_TRIANGLE.className}
                               style={{color: '#ffad00', margin: '0px 8px'}}/>;
    defInfo: Object = <span className={FontAwesome.QUESTION_CIRCLE.className} style={{color: '#0091ff', margin: '0px 8px'}}/>;
    defReq: Object = <span className={FontAwesome.ASTERISK.className}
                           style={{fontSize: '.7em', verticalAlign: 'top', color: 'red', margin: '0px 8px'}}/>;

    props: {
        field: Field,
        handleFieldError: boolean,
        handleFieldWarning: boolean,
        handleRequired: boolean,
        handleInformation: boolean,
        defError: Object,
        defWarning: Object,
        defInfo: Object,
        defReq: Object
    };

    state: {
        render: boolean;
        message: ?string;
        hint: boolean;
        defIcon: Object;
    };

    static propTypes = {
        field: PropTypes.instanceOf(Field).isRequired,
        onChange: PropTypes.func,
        handleFieldError: PropTypes.bool,
        handleFieldWarning: PropTypes.bool,
        handleRequired: PropTypes.bool,
        handleInformation: PropTypes.bool,
        defError: PropTypes.object,
        defWarning: PropTypes.object,
        defInfo: PropTypes.object,
        defReq: PropTypes.object

    };

    constructor() {
        super(...arguments);
        this.field = Check.instanceOf(this.props.field, [Field]);

        this.defError = this.props.defError || this.defError;
        this.defWarning = this.props.defWarning || this.defWarning;
        this.defInfo = this.props.defInfo || this.defInfo;
        this.defReq = this.props.defReq || this.defReq;

        const msg = this.props.handleInformation ? this.field.info : null;
        const ren = msg ? true : (this.props.handleRequired && this.field.isRequired());
        this.state = {
            render: ren,
            message: msg,
            defIcon: this.props.handleRequired && this.field.isRequired() ? this.defReq : this.defInfo,
            hint: false
        };
        if (this.props.handleFieldError)
            this.field.onError.listen(this, (msg) => this._handleFieldErrorEvent(msg));
        if (this.props.handleFieldWarning)
            this.field.onWarning.listen(this, (msg) => this._handleFieldWarningEvent(msg));
    }

    componentDidMount() {
        if (this.props.handleFieldError && this.field.error)
            this._setMessage(this.field.error, this.defError);
        else if (this.props.handleFieldWarning && this.field.warning)
            this._setMessage(this.field.warning, this.defWarning);
    }

    _handleFieldErrorEvent(msg: ?string) {
        this._setMessage(msg, this.defError);
    }

    _handleFieldWarningEvent(msg: ?string) {
        this._setMessage(msg, this.defWarning);
    }

    _setMessage(msg: ?string, icon: ?Object) {
        const m = msg || (this.props.handleInformation ? this.field.info : null);
        this.setState({
            defIcon: msg ? icon : this.props.handleRequired && this.field.isRequired() ? this.defReq : this.defInfo,
            message: m,
            render: m ? true : (this.props.handleRequired && this.field.isRequired())
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
                {this.props.children || this.state.defIcon}
                <Hint
                    visible={this.state.hint}
                    message={this.state.message}
                    style={{
                        position: 'absolute',
                        background: '#585858',
                        color: '#ffffff',
                        borderRadius: '5px',
                        padding: '5px 20px 5px 20px',
                        margin: '10px',
                        zIndex: 1000
                    }}/>
            </span>);

    }
}