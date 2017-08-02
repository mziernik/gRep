// @flow
'use strict';
import {React, PropTypes, Field, Check, Utils, Is, Dev, Type, Repository} from '../../core.js';
import {Component, Icon, Input, Memo, List, Multiple, DatePicker, Select, Checkbox, Hint} from '../../components.js';
import RepoCtrl from "../repository/RepoCtrl";

/**
 * Komponent ułatwiający obsługę obiektu Field. Umożliwia edycję i podgląd wartości, błędów i innych flag
 */

//FixMe: Zamienić span-y na div-y

const mode = [
    "inline", // kontrolery wyświetlane w jednej linii obok siebie: required, name, value, error, description
    "row", // wiersz tabeli <tr> required, name, value, error, description </tr>
    "block" // dwie linie 1: required, name; 2: description, value, error
];
export default class FCtrl extends Component {

    static propTypes = {

        field: PropTypes.object.isRequired,
        /** sposób wyświetlania - domyślnie inline*/
        mode: PropTypes.oneOf(mode),
        /** Pole edycyjne */
        value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        /** Podgląd wartości tylko do odczytu*/
        preview: PropTypes.bool,
        /** Podgląd uproszczony (np na potrzeby tabel) */
        inline: PropTypes.bool,
        /** Nazwa pola (etykieta) */
        name: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        /** Wskaźnik błędu lub ostrzeżenia */
        error: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        /** Wskaźnik ostrzeżenia */
        required: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        /** Ikona podglądu opisu*/
        description: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),

        markChanges: PropTypes.bool,
        onChange: PropTypes.func,
        title: PropTypes.string,

        /** Rozciągnij zawartość */
        fit: PropTypes.bool,

        ignore: PropTypes.bool, // warunek wykluczający rysowanie
    };

    static defaultProps = {
        markChanges: true
    };

    //przyklad = <div><FCtrl field={null} value/> <FCtrl field={null} error description/></div>

    htmlElement: HTMLElement;
    field: Field;
    error: boolean;
    required: boolean;
    description: boolean;
    tagProps: Object;

    /* domyślne ikony */
    defError: Object = <span className={Icon.EXCLAMATION_CIRCLE.className}
                             style={{color: '#c00'}}/>;
    defWarning: Object = <span className={Icon.EXCLAMATION_TRIANGLE.className}
                               style={{color: '#ffad00'}}/>;
    defDesc: Object = <span className={Icon.QUESTION_CIRCLE.className}
                            style={{color: '#0091ff'}}/>;
    defReq: Object = <span className={Icon.ASTERISK.className}
                           style={{fontSize: '.6em', verticalAlign: 'top', color: '#c00'}}/>;


    props: {
        field: Field,
        mode: string,
        value: boolean,
        preview: boolean,
        inline: boolean,
        name: boolean,
        error: boolean,
        required: boolean,
        description: boolean,
        fit: boolean,
        markChanges: boolean,
        onChange: () => void
    };
    // Wskaźnik błędu i ostrzeżenia występują zamiennie, pozostałe sumują się

    state: {
        warning: ?string, // treść ostrzeżenia
        error: ?string // treść błędu
    };

    constructor() {
        super(...arguments);
        this.field = Check.instanceOf(this.props.field, [Field]);

        this.defError = this.props.defError || this.defError;
        this.defWarning = this.props.defWarning || this.defWarning;
        this.defDesc = this.props.defDesc || this.defDesc;
        this.defReq = this.props.defReq || this.defReq;

        this.state = {error: this.field.error, warning: this.field.warning};

        this.field.onUpdate.listen(this, data => {
            this._markAsChanged(true);
            Is.func(this.props.onChange, f => f(this, data));
            this.forceUpdate(true);
        });

        this.tagProps = {
            style: this.props.style,
            title: this.props.title,
            className: "c-fctrl",
            ref: e => this._setHtmlElement(e)
        }
    }

    _markAsChanged(state: boolean) {
        if (!this.htmlElement || !this.props.markChanges) return;
        this.htmlElement.setAttribute("changed", state);
        if (this.htmlElement.parentNode)
            this.htmlElement.parentNode.setAttribute("fctrl-changed", state);
        if (state) setTimeout(() => this._markAsChanged(false), 3000);
    }

    _setHtmlElement(element: HTMLElement) {
        if (this.htmlElement || !element) return;
        this.htmlElement = element;
        const now = new Date().getTime();
        const tolerance = 4000;
        const mark = this.field
            && ((this.field.lastUpdate && (now - this.field.lastUpdate < tolerance))
                || (this.field.record && now - this.field.record.lastUpdate < tolerance ));
        this._markAsChanged(mark ? true : null);
    }

    componentDidMount() {
        if (this.props.error) {
            this.field.onError.listen(this, () => this.setState({
                error: this.field.error,
                warning: this.field.warning
            }));
            this.field.onWarning.listen(this, () => this.setState({
                error: this.field.error,
                warning: this.field.warning
            }));
            if (this.field.error || this.field.warning)
                this.setState({error: this.field.error, warning: this.field.warning});
        }
    }

    _handleMouseEnter(e: Event, msg: ?string) {
        let target = e.currentTarget.lastChild;
        if (!target) target = e.currentTarget;
        this._hint = Hint.show(target, msg)
    }

    _handleMouseLeave() {
        if (this._hint) {
            this._hint.remove();
            this._hint = null;
        }
    }

    render() {

        const style = this.field.config.enumStyles ? this.field.config.enumStyles[this.field.value] : null;

        if (this.props.inline
            || (!this.props.required
                && !this.props.name
                && !this.props.preview
                && !this.props.description
                && !this.props.error
                && !this.props.value)) {

            if (this.field.config.enumIcons) {
                let ic = this.field.config.enumIcons[this.field.value];
                if (ic)
                    return <span {...this.tagProps} className={"c-fctrl " + ic}/>;
            }

            return <span {...this.tagProps} >{this.field.displayValue}</span>;
        }

        switch (this.props.mode) {
            case "row":
                return this.renderRow();
            case "block":
                return this.renderBlock();
            case "inline":
            default:
                return this.renderInline();
        }
    }

    /***************************************************************/
    /************************** RENDERERS **************************/

    /***************************************************************/

    /** zwraca jedną z kontrolek required, description, error
     * @param type typ kontrolki
     * @returns {XML} kontrolka
     */
    renderCtrl(type: string) {
        let icon = null,
            msg = null,
            visible = false;
        switch (type) {
            case "required":
                icon = this.defReq;
                msg = "Pole obowiązkowe";
                visible = this.field.config.required;
                break;
            case "description":
                icon = this.defDesc;
                msg = this.field.config.description;
                visible = this.field.config.description;
                break;
            case "error":
                icon = this.state.error ? this.defError : this.defWarning;
                msg = msg || this.state.error || this.state.warning;
                visible = !!(this.state.error || this.state.warning);
                break;
            case "name":

                if (this.field.config.foreign) {
                    const repo: Repository = this.field.config.foreign();
                    if (!this.field.record || repo !== this.field.record.repo) {
                        const ctrl: RepoCtrl = new RepoCtrl(this.node.currentPage, repo);
                        return <span key="name"
                                     className="c-fctrl-name-link"
                                     onClick={(e) => ctrl.editTab()}
                        >{this.field.name}</span>;
                    }
                }

                return <span key="name"
                             className="c-fctrl-name"
                >{this.field.name}</span>;
        }
        if (msg === '') msg = null;

        return (
            <span
                key={type}
                style={{
                    position: 'relative',
                    margin: '0 4px',
                    visibility: visible ? 'visible' : 'hidden',
                }}
                onMouseEnter={(e) => this._handleMouseEnter(e, msg)}
                onMouseLeave={() => this._handleMouseLeave()}>
                {icon}
                <span/>
            </span>);
    }

    /** zwraca pole edycyjne lub podgląd opakowane w <span display=flex>
     * @returns {*} kontrolka
     */
    renderFlexValue() {
        if (!this.props.value && !this.props.preview && !this.props.inline) return null;
        return <span key="value" style={{flex: '1 1 auto'}}>{this.renderValue()}</span>;
    }

    /** zwraca pole edycyjne lub podgląd
     * @returns {*} kontrolka
     */
    renderValue() {
        if (!this.props.value && !this.props.preview && !this.props.inline) return null;
        const field: Field = this.field;
        const value: any = field.value;

        if (!this.field) return null;

        if (this.props.preview && this.props.inline) {

            const title = field.name + ": " + field.displayValue;
            return value === null
                ? <span title={title} style={{color: "#aaa"}}>null</span>
                : typeof value === "boolean"
                    ? <span title={title} className={value ? Icon.CHECK : Icon.TIMES}/>
                    : <span title={title}>{this.field.displayValue}</span>;
        }

        if (this.props.preview && this.field.enumerate) {
            const map: Map = this.field.enumerate();
            const v = map.get(value);
            return <span>{Field.formatValue(Is.defined(v) ? v : value)}</span>
        }

        if (this.field.type instanceof Type.ListDataType || this.field.type instanceof Type.MapDataType)
            return <List field={this.field} preview={this.props.preview}/>;

        if (this.field.type instanceof Type.MultipleDataType)
            return <Multiple field={this.field}/>;

        if (this.field.enumerate)
            return <Select readOnly={this.field.readOnly} field={this.field}/>;

        if (this.field.units)
            this._unitSelect = <Select
                style={{flex: 'auto', width: '10px'}}
                field={this.field}
                units={this.field.units()}
            />;

        switch (this.field.type.name) {
            case "password":
                return this.renderInput({type: "password"});
            case "string":
            case "uuid":
                return this.renderInput({type: "text"});
            case "email":
                return this.renderInput({type: "email"});
            case "memo":
                return <Memo field={this.field} preview={this.props.preview} inline={this.props.inline}/>;
            case "length":
                return this.renderInput({type: "number", min: 0});
            case "double":
                return this.renderInput({type: "number", step: 0.001});
            case "int":
                return this.renderInput({type: "number"});
            case "boolean":
                return <Checkbox field={this.field} label={false} preview={this.props.preview}/>;
            case "date":
                return <DatePicker field={this.field} preview={this.props.preview}
                                   dtpProps={{format: "DD-MM-YYYY", time: false}}/>;
            case "time":
                return <DatePicker field={this.field} preview={this.props.preview}
                                   dtpProps={{format: 'HH:mm', calendar: false}}/>;
            case "timestamp":
                return <DatePicker field={this.field} preview={this.props.preview}
                                   dtpProps={{format: 'DD-MM-YYYY HH:mm'}}/>;

            default:
                switch (this.field.type.simpleType) {
                    case "string":
                        return this.renderInput({type: "text"});
                    case "number":
                        return this.renderInput({type: "number"});
                    case "boolean":
                        return <Checkbox field={this.field} label={this.props.name} preview={this.props.preview}/>;
                    default:
                        Dev.warning(this, "Brak obsługi typu " + Utils.escape(this.field.type.name));
                        return this.renderInput({type: "text"});
                }
        }
    }

    /** sortuje propsy. Pola z true są umieszczane na końcu
     * @returns {*[]} kontrolki
     */
    sortedCtrl() {
        let props = [
            {n: 'required', v: this.props.required},
            {n: 'name', v: this.props.name},
            {n: 'value', v: this.props.value || this.props.preview || this.props.inline},
            {n: 'error', v: this.props.error},
            {n: 'description', v: this.props.description},
        ].sort((a, b) => {
            if (a.v === b.v) return 0;
            if (a.v === undefined || a.v === null || typeof(a.v) === 'boolean') return 1;
            if (b.v === undefined || b.v === null || typeof(b.v) === 'boolean') return -1;
            return a.v - b.v;
        });

        return Utils.forEach(props, (p) => {
            if (!p.v) return;
            switch (p.n) {
                case 'value':
                    return this.renderFlexValue();
                case 'name':
                case 'required':
                case 'description':
                case 'error':
                    return this.renderCtrl(p.n);
                default:
                    return;
            }
        })
    }

    /** zwraca kontrolki w trybie inlnie
     * @returns {XML} zestaw kontrolek
     */
    renderInline() {
        return (
            <span
                {...this.tagProps}
                style={{
                    ...this.tagProps.style,
                    display: this.props.fit ? 'flex' : 'inline-flex',
                    width: this.props.fit ? "100%" : null,
                    whiteSpace: 'nowrap',
                    position: 'relative'
                }}>
                {this.sortedCtrl()}
                    </span>);
    }

    /** zwraca kontrolki w trybie row <tr><td>...
     * @returns {XML} zestaw kontrolek
     */
    renderRow() {
        return (
            <tr {...this.tagProps}>
                {Utils.forEach(this.sortedCtrl(), (ctrl) => {
                    return <td>{ctrl}</td>;
                })}
            </tr>);
    }

    /** zwraca kontrolki w trybie block <span><div><div>
     * @returns {XML} zestaw kontrolek
     */
    renderBlock() {
        return <span
            {...this.tagProps}
            style={{...this.tagProps.style, position: 'relative'}}>
            {this.props.required || this.props.name ?
                <div>
                    {this.props.required ? this.renderCtrl('required') : null}
                    {this.props.name ? this.renderCtrl("name") : null}
                </div> : null}
            <div style={{display: 'flex'}}>
                {this.props.description ? this.renderCtrl('description') : null}
                {this.renderFlexValue()}
                {this.props.error ? this.renderCtrl('error') : null}
        </div>
        </span>
    }

    /** zwraca inputa z podanymi propsami
     * @param props propsy dla tagu <input>
     * @returns {XML} <input>
     */
    renderInput(props: ? Object) {
        return <Input field={this.field}
                      preview={this.props.preview}
                      units={this._unitSelect}
                      inputProps={props}/>
    }
}