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
        }, 300);
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

    return <div style={{flex: "auto", textAlign: "right"}}>
    <span
        style={{
            display: "inline-block",
            border: "1px solid " + border,
            backgroundColor: background,
            opacity: "0.9",
            padding: "10px 20px",
            margin: "4px",
            textAlign: "left",
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            transition: "all 0.3s",
        }}
        ref={id => status._tag = id}
        onClick={(e) => status.hide()}
    >
                <span style={ {
                    fontSize: "26px",
                    width: "30px",
                    color: border,
                    verticalAlign: "baseline",
                    margin: "4px"
                } } className={icon}/>

        <span style={ {
            fontSize: "14px",
            verticalAlign: "baseline",
            fontWeight: "bold",
            margin: "4px",
            paddingLeft: "4px",
            color: "#333",
        } }
        >{Utils.toString(status.message)}</span>
    </span>
    </div>
}