import {React, PropTypes, If} from "../core"
import {Component} from "../components"
import * as Utils from "../utils/Utils";

export default class JsonViewer extends Component {

    static propTypes = {
        object: PropTypes.any,
        instance: PropTypes.func
    };

    object: any;

    constructor() {
        super(...arguments);
        If.isFunction(this.props.instance, f => f(this))
        this.object = this.props.object;
    }

    update(object: any) {
        this.object = object;
        this.forceUpdate();
    }

    render() {

        const keyId = new Utils.AtomicNumber();

        function Opr(props) {
            return <span key={keyId.next} style={{
                paddingRight: props.char === ":" || props.char === "," ? "8px" : null,
                ...padding(props.level)
            }}>{props.char}</span>
        }

        function Br() {
            return <br/>;
        }

        function map(item, singleLine, callback) {
            const result = [];
            Utils.forEach(item, (value, name) => {
                let x = callback(value, name);
                if (!x) return;
                if (result.length) {
                    result.push(<Opr key={keyId.next} char=","/>);
                    if (!singleLine)
                        result.push(<Br key={keyId.next}/>);
                }
                result.push(x);
            });
            return result;
        }


        function Block(props) {
            return <span>
                <Opr char={props.opr[0]} level={ props.intent ? props.level : 0}/>
                {props.singleLine ? null : <Br/>}
                {props.children}
                {props.singleLine ? null : <Br/>}
                <Opr char={props.opr[1]} level={props.singleLine ? 0 : props.level}/>
            </span>;
        }

        function padding(level) {
            return {paddingLeft: (level * 30) + "px"}
        }

        function draw(item: any, parent: {} | [], intent, level) {

            const type = typeof item;
            let color = "#000";

            switch (type) {
                case "string":
                    color = "green";
                    item = Utils.escape(item);
                    break;
                case "number":
                    color = "blue";
                    break;
                case "boolean":
                    item = item ? "true" : "false";
                    color = "blue";
                    break;
            }

            if (item === null) {
                item = "null";
                color = "#aaa";
            }


            if (item instanceof Array) {
                let singleLine = true;
                item.forEach(elm => {
                    if (elm instanceof Array) {
                        if (elm.length)
                            singleLine = false;
                        return;
                    }

                    if (elm instanceof Object) {
                        if (!Object.keys(elm).length)
                            singleLine = true;
                        return;
                    }

                    if (elm !== null && ["string", "number", "boolean"].indexOf(typeof elm) < 0)
                        singleLine = false;
                });

                return <Block key={keyId.next} parent={item} intent={intent} level={level} opr="[]"
                              singleLine={singleLine}>
                    {map(item, singleLine, e => draw(e, item, true, singleLine ? 0 : level + 1))}
                </Block>;
            }

            if (item instanceof Object) {

                let singleLine = false;
                if (!Object.keys(item).length)
                    singleLine = true;

                return <Block key={keyId.next} parent={item} intent={intent} level={level} opr="{}"
                              singleLine={singleLine}>
                    {map(item, false, (value, name) =>
                        <span key={keyId.next} style={padding(level + 1)}>
                            <span style={{color: "#880042"}}>{name}</span>
                            <Opr char=":" level={0}/>
                            {draw(value, item, false, level + 1)}
                        </span>)
                    }
                </Block>;
            }
            const zz = intent ? padding(level) : {};

            return <span key={keyId.next} style={{color: color, ...zz}}>{item}</span>
        }


        return <div>
            <div style={{
                fontFamily: "consolas",
                fontSize: "10pt",
            }}>
                {draw(this.object, null, false, 0)}
            </div>
        </div>
    }

}