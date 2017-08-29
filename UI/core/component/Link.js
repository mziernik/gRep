// @flow
'use strict';

import {React, Utils, PropTypes, Endpoint, Is} from "../core";
import {Component, Alert} from "../components";
import FileSaver from "file-saver";
import RouteLink from "react-router-dom/es/Link";

/**
 * Pobieranie pliku, przeciągnij i upuść na pulpit
 */
export default class Link extends Component {

    static propTypes = {
        ignore: PropTypes.any,
        downloadName: PropTypes.string,
        downloadData: PropTypes.func,
        className: PropTypes.string,
        link: PropTypes.any, //[String, Endpoint]
        icon: PropTypes.any, //(FontAwesome),
        style: PropTypes.object,
        onClick: PropTypes.func,
        title: PropTypes.string,
        disabled: PropTypes.bool,
        confirm: PropTypes.string // komunikat potwierdzenia przed wykonaniem onClick lub download
    };

    render() {

        let title = this.props.title;

        const arr = [];

        const style = this.props.style || {};
        style.cursor = "pointer";
        style.margin = style.margin || "4px";

        if (this.props.className)
            arr.push(this.props.className);
        if (this.props.icon)
            arr.push(this.props.icon);

        const className = arr.join(" ");

        const disabled: boolean = this.props.disabled;
        if (disabled)
            style.cursor = "default";

        //-------------------------------------------------------------

        if (Is.func(this.props.downloadData))
            return <a
                style={style}
                href="javascript:void(0)"
                download={this.props.downloadName}
            ><span
                title={title}
                className={className}
                onClick={(e: Event) => {
                    e.preventDefault();

                    if (disabled) return;

                    const process = () => {
                        if (Is.func(this.props.onClick))
                            if (this.props.onClick(e) === false)
                                return;

                        let blob: Blob = null;

                        let data = this.props.downloadData();

                        if (data instanceof Blob)
                            blob = data;
                        else {
                            if (typeof data !== "string")
                                data = Utils.escape(data, null, "\t");
                            if (typeof data === "string")
                                blob = new Blob([data], {type: "text/plain;charset=utf-8"});
                        }
                        FileSaver.saveAs(blob, this.props.downloadName);
                    };

                    if (this.props.confirm)
                        Alert.confirm(this, this.props.confirm, () => process());
                    else
                        process();

                }}>{super.renderChildren()}</span>
            </a>;

        let link = this.props.link;


        return <a style={style} href={disabled ? null : link ? link : "javascript:void(0)"}>
            <span
                title={title}

                disabled={disabled}
                className={className}
                onClick={(e: MouseEvent) => {

                    if (link)
                        e.preventDefault();

                    if (disabled) return;
                    if (this.props.confirm && Is.func(this.props.onClick))
                        Alert.confirm(this, this.props.confirm, () => this.props.onClick(e));
                    else Is.func(this.props.onClick, f => f(e));

                    if (link instanceof Endpoint)
                        (link: Endpoint).navigate(null, e);

                    if (typeof link === "string")
                        Endpoint.navigate(link, e);

                }}
            >{super.renderChildren()}</span>
        </a>;

    }


}