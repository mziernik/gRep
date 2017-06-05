import {React, PropTypes} from "../core"
import {Component} from "../components"

export default class Hint extends Component {

    props: {
        style: object,
        visible: boolean,
        message: ?string
    };

    static PropTypes = {
        style: PropTypes.object,
        visible: PropTypes.bool,
        message: PropTypes.string
    };

    constructor() {
        super(...arguments);
    }

    _setPosition(elem) {
        if (!elem)return;
        let el = elem.getBoundingClientRect();
        /* poziom */
        if ((el.left + el.width) >= window.innerWidth) {
            elem.style.left = -(el.width + 10) + 'px';
        }

        /* pion */
        if ((el.top + el.height) >= window.innerHeight) {
            elem.style.top = -(el.height) + 'px';
        }

        elem.style.visibility = 'visible';
    }

    render() {
        if (!this.props.visible) {
            return null;
        }
        return (
            <span ref={(elem) => this._setPosition(elem)}
                  style={{...this.props.style, visibility: 'hidden', whiteSpace: 'nowrap'}}>
                {this.props.children
                || this.props.message.split('\n').map((line, index) => {
                    return <div key={index}>{line}</div>;
                })}
            </span>
        )
    }
}
