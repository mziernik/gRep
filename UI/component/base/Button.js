import React from 'react';
import PropTypes from 'prop-types';
import Component from "../../core/Component";


export default class Button extends Component {

    static propTypes = {
        type: PropTypes.oneOf(["basic", "default", "primary", "success", "info", "warning", "danger", "link"]),
        title: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        style: PropTypes.object
    };

    render() {
        return super.create("button", {
            onClick: this.props.onClick,
            className: "btn btn-" + this.props.type,
            title: this.props.title,
            style: {
                boxSizing: "border-box",
                fontSize: "16px",
                padding: "6px 12px",
                marginRight: "10px",
                marginTop: "10px",
                cursor: "pointer",
                border: "1px solid #444"
            }
        });
    }


}