import {React} from "../../core";
import {Page, Table, FontAwesome, Panel} from "../../components";

export default class PFontAwesome extends Page {

    state: {
        search: string;
    };

    draw() {

        return <Panel fit noPadding>

            {super.renderTitle("FontAwesome")};

            <Panel>
                <span>
                <input
                    type="search"
                    placeholder="szukaj"
                    onChange={e => {
                        let val = e.target.value.trim();
                        this.setState({search: val});
                    }}/>
                </span>
            </Panel>
            <hr style={{width: "100%"}}/>

            <Panel vertical overflow="auto">
                <div>
                    {FontAwesome.ALL.map((ico: FontAwesome) => {

                        const name = ico.className.substring(6);

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
                    }} className={ico.className}></div>
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

