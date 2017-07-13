import {React} from "../../core";
import {Page, Icon, Panel} from "../../components";

export default class PIcons extends Page {

    state: {
        search: string;
    };

    render() {

        return <Panel fit noPadding>

            {this.renderTitle("Ikony")}

            <Panel>
                <div>
                    <input
                        type="search"
                        placeholder="szukaj"
                        onChange={e => {
                            let val = e.target.value.trim();
                            this.setState({search: val});
                        }}/>
                    <span>Ilość: {Icon.ALL.length}</span>
                </div>
            </Panel>
            <hr style={{margin: 0}}/>

            <Panel vertical scrollable>
                <div>
                    {Icon.ALL.map((ico: Fontello) => {

                        const name = ico.name;

                        if (this.state && this.state.search && !name.contains(this.state.search))
                            return null;

                        return <span
                            key={ico.className}
                            style={ {
                                display: "inline-block",
                                width: "100px",
                                margin: "16px 4px",
                                textAlign: "center"
                            }}>
                    <div style={{
                        fontSize: "40px"
                    }} className={ico.className}/>
                    <div
                        style={{
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginTop: "4px"
                        }}
                        title={name}
                    >{name}</div>
                </span>
                    })}
                </div>
            </Panel>

        </Panel>
    }


}

