import {React, PropTypes, If} from "../core"
import {Component} from "../components"

export default class Form extends Component {

    static propTypes = {

        record: PropTypes.any,

    };

    constructor() {
        super(...arguments);
        If.isFunction(this.props.instance, f => f(this));
    }

    render() {
        return <div style={{
            display: "inline-block"
        }}>{this.props.children}</div>
    };

}