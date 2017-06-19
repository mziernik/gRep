import {React, PropTypes, If} from "../core"
import {Component} from "../components"

class Element {

    type: string;
    parent: Element;
    children: Element[] = [];
    content: string = null;

    constructor(type: string) {
        this.type = type;
    }

    add(type: string) {
        const element = new Element(type);
        element.parent = this;
        this.children.push(element);
        return element;
    }

    render() {


        return <div style={{padding: "4px 30px"}}>
            <div>{this.content !== null ? "<" + this.type + "> " + this.content : null}</div>
            {this.children.map(e => e.render())}
        </div>
    }
}

export default class Form extends Component {

    static propTypes = {

        record: PropTypes.any,

    };

    constructor() {
        super(...arguments);
        If.isFunction(this.props.instance, f => f(this));
    }

    render() {

        let obj = {
            tekst: "abc",
            liczba: 12,
        };

        const json = JSON.stringify(obj);

        let quoted: boolean = false;


        let current: Element = null;
        let root: Element = null;

        const open = (type: string): Element => current = current ? current.add(type) : root = new Element(type);
        const close = (): Element => current = current.parent;


        for (let i = 0; i < json.length; i++) {
            const c = json[i];


            if (c === '"') {
                quoted = !quoted;
                if (quoted)
                    open("string");
                else
                    close();
                continue;
            }

            if (c === " " && !quoted)
                continue;

            if (c === "{") {
                open("object");
                continue;
            }

            if (c === "[") {
                open("array");
                continue;
            }

            if (c === ":") {
                open("value");
                continue;
            }

            if (c === "," || c === "}" || c === "]") {

                if ((current.type === "string" || current.type === "value")
                    && (current.parent && current.parent.type === "object" || current.parent && current.parent.type === "array"))
                    close();
                
                close();
                continue;
            }

            current.content = (current.content || "") + c;
        }

        return <div>
            <div>{json}</div>
            <hr/>
            {root.render()}
        </div>
    };

}