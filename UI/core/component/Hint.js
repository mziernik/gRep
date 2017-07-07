import {React, PropTypes, Utils} from "../core"
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
        return (
            <span ref={(elem) => this._setPosition(elem)}
                  style={{
                      ...this.props.style,
                      visibility: 'hidden',
                      whiteSpace: 'nowrap',
                      position: 'fixed',
                      background: '#585858',
                      color: '#ffffff',
                      borderRadius: '5px',
                      padding: '5px 20px 5px 20px',
                      //margin: '10px',
                      zIndex: 1000
                  }}>
                {super.renderChildren()
                || Utils.forEach(this.props.message.split('\n'), (line, index) => {
                    return <div key={index}>{line}</div>;
                })}
            </span>
        )
    }
}
