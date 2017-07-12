import {React, Utils, Application, AppStatus} from "../../core";
import {Component, FontAwesome} from "../../components";


export default class StatusHint extends Component {

    statuses: AppStatus[] = [];

    constructor() {
        super(...arguments);
        AppStatus.onChange.listen(this, (status: AppStatus) => {
            this.statuses.push(status);
            status.hide = () => this.hide(status);
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

    let icon: FontAwesome;
    let background: string;
    let border: string;
    switch (status.type) {
        case "debug":
            icon = FontAwesome.BUG;
            border = "#555";
            background = "#ccc";
            break;
        case "info":
            icon = FontAwesome.INFO;
            border = "#459";
            background = "#ade";
            break;
        case "success":
            icon = FontAwesome.CHECK;
            border = "#595";
            background = "#aea";
            break;
        case "warning" :
            icon = FontAwesome.EXCLAMATION_TRIANGLE;
            border = "#963";
            background = "#eda";
            break;
        case "error":
            icon = FontAwesome.TIMES;
            border = "#b55";
            background = "#eaa";
            break;
    }

    //ToDo: Przemek
    return <div className="c-status-hint" style={{flex: "auto", textAlign: "right"}}>
        <table
            style={{
                display: "inline-table",
                border: "1px solid " + border,
                backgroundColor: background,
                opacity: "0.9",

                margin: "4px",
                textAlign: "left",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                transition: "all 0.3s",
                maxWidth: "60vw",
                minWidth: "250px"
            }}
            ref={id => status._tag = id}
            onClick={(e) => status.hide()}
        >
            <tbody>
            <tr>
                <td className="c-status-hint-icon"
                    style={ {
                        padding: "10px",
                        paddingLeft: "20px",
                        fontSize: "30px",
                        width: "30px",
                        color: border,
                        verticalAlign: "top",
                    } }>
                    <span className={icon}/>
                </td>

                <td className="c-status-content"
                    style={ {
                        display: "inline-block",
                        verticalAlign: "top",
                        margin: "8px 4px 4px 4px",
                        padding: "10px 20px",
                        paddingLeft: "4px",
                    } }
                >
                    <div
                        className="c-status-hint-message"
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#333",
                        }}>{message}</div>
                    <div
                        className="c-status-hint-details"
                        style={{
                            fontSize: "13px",
                            color: "#444",
                            paddingTop: "10px"
                        }}>{details}</div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
}