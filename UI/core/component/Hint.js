import {React, PropTypes, Application, AppNode, Utils} from "../core"
import {Component} from "../components"

export default class Hint extends Component {

    props: {
        visible: boolean,
        message: ?string
    };

    static propTypes = {
        visible: PropTypes.bool,
        message: PropTypes.string
    };

    constructor() {
        super(...arguments);
    }

    /** Wyświetla hinta. UWAGA! Nadpisuje zawartość rodzica
     * @param parent element w którym ma się narysować hint. Zawartość zostanie nadpisana
     * @param msg treść komunikatu hinta
     * @returns {AppNode} uchwyt do hinta, który należy przekazać w hide lub usunąć ręcznie
     */
    static show(parent, msg): AppNode {
        return Application.render(<Hint visible={true} message={msg}/>, parent);
    }

    /** ukrywa hinta
     * @param hint uchwyt wyświetlonego hinta
     */
    static hide(hint: AppNode) {
        hint.remove();
    }

    _setPosition(elem) {
        if (!elem)return;
        const el = elem.getBoundingClientRect();
        const parent = elem.parentElement.getBoundingClientRect();
        /* poziom */
        if ((parent.left + parent.width + el.width) >= window.innerWidth) {
            elem.style.left = (parent.left - el.width) + 'px';
        } else
            elem.style.left = (parent.left + parent.width) + 'px';

        /* pion */
        if ((parent.top + parent.height + el.height) >= window.innerHeight) {
            elem.style.top = (parent.top - el.height) + 'px';
        } else
            elem.style.top = (parent.top + parent.height) + 'px';
        elem.style.visibility = 'visible';
    }

    render() {
        if (!this.props.visible) {
            return null;
        }
        //
        return (
            <div className="c-hint" ref={(elem) => this._setPosition(elem)}
                  style={{
                      ...this.props.style,
                  }}>
                {super.renderChildren()
                || this.props.message ? Utils.forEach(this.props.message.split('\n'), (line, index) => {
                    return <div key={index}>{line}</div>;
                }) : null}
            </div>
        )
    }
}
