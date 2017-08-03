import {React, Utils, Application, AppStatus} from "../../core";
import {Component, Icon} from "../../components";

export default class StatusHint extends Component {

    statuses: AppStatus[] = [];

    constructor() {
        super(...arguments);
        AppStatus.onChange.listen(this, data => {
            this.statuses.push(data.status);
            data.status.hide = () => this.hide(data.status);
            this.forceUpdate();
        });

    }

    hide(status: AppStatus) {
        if (status._tag) {
            status._tag.style.marginRight = "-100%";
            status._tag.style.opacity = "0.3";
        }
        setTimeout(() => {
            this.statuses.remove(status);
            this.forceUpdate();
        }, 500);
    }

    render() {
        return <div style={{display: "flex", flexDirection: "column", paddingTop: "40px"}}>
            {this.statuses.map((status: AppStatus) => <Bar key={status.id} status={status}/>)}
        </div>
    }
}

function Bar(props) {
    let info = null;

    const status: AppStatus = props.status;

    let key = 0;
    const message = status.message ? Utils.toString(status.message).split("\n").map(s => <div
        key={++key}>{s}</div>) : null;
    const details = status.details ? Utils.toString(status.details).split("\n").map(s => <div
        key={++key}>{s}</div>) : null;

    let icon: Icon;
    let background: string;
    let border: string;
    switch (status.type) {
        case "debug":
            icon = Icon.BUG;
            border = "#555";
            background = "#ccc";
            break;
        case "info":
            icon = Icon.INFO;
            border = "#459";
            background = "#ade";
            break;
        case "success":
            icon = Icon.CHECK;
            border = "#595";
            background = "#aea";
            break;
        case "warning" :
            icon = Icon.EXCLAMATION_TRIANGLE;
            border = "#963";
            background = "#eda";
            break;
        case "error":
            icon = Icon.TIMES;
            border = "#b55";
            background = "#eaa";
            break;
    }

    return <div className="c-status-hint">
        <table
            style={{
                display: "inline-table",
                border: "1px solid " + border,
                backgroundColor: background,
                opacity: "0.9",
                zIndex: Component.zIndex
            }}
            ref={id => status._tag = id}
            onClick={(e) => status.hide()}
        >
            <tbody>
            <tr>
                <td className="c-status-hint-icon"
                    style={{color: border}}>
                    <span className={icon}/>
                </td>

                <td className="c-status-hint-content"
                    style={{
                        display: "inline-block",
                        verticalAlign: "top",
                        margin: "8px 4px 4px 4px",
                        padding: "10px 20px",
                        paddingLeft: "4px",
                    }}
                >
                    <div
                        className="c-status-hint-message">{message}</div>
                    <div
                        className="c-status-hint-details">{details}</div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
}