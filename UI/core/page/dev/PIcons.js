import {React, Trigger, Utils} from "../../core";
import {Page, Icon, Panel} from "../../components";

export default class PIcons extends Page {

    state: {
        search: string;
    };

    search: Trigger = new Trigger((val) => this.setState({search: val}), 300);

    render() {

        const icons = Utils.forEach(Icon.ALL, (ico: Icon) => {
            const name = ico.name;
            if (this.state && this.state.search && !name.contains(this.state.search))
                return undefined;

            return <div
                className="_ico"
                key={ico.className}
            >
                <div className={ico.className}/>
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
            </div>
        });


        return <Panel fit noPadding>
            <Panel>
                <div>
                    <input
                        type="search"
                        placeholder="szukaj"
                        onChange={e => this.search.run(e.target.value.trim())}/>
                    <span>Ilość: {icons.length}</span>
                </div>
            </Panel>
            <hr style={{margin: 0}}/>

            <Panel vertical scrollable>
                <div>
                    {icons}
                </div>
            </Panel>
        </Panel>
    }


}

