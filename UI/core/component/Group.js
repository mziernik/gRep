/**
 * Abstrakcyjny komponent grupujący kontrolki z możliwością zdefiniowania ich uprawnień
 */
import {React, PropTypes, Field} from "../core";
import {Component} from "../components";

export default class If extends Component {

    static propTypes = {
        permissions: PropTypes.any,
        condition: PropTypes.bool
    };

    render() {
        return this.props.children.length ? <span>{this.props.children}</span> : this.props.children;
    }

}