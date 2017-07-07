import {React, PropTypes, If} from "../core"
import {Component} from "../components"
import AppNode from "../application/Node";

export default class Form extends Component {

    static propTypes = {

        record: PropTypes.any,
        style: PropTypes.any,

        button: PropTypes.object
    };

    constructor() {
        super(...arguments);
        If.isFunction(this.props.instance, f => f(this));
    }

    render() {
        return <div style={this.props.style}>{super.renderChildren()}</div>
    };


}
