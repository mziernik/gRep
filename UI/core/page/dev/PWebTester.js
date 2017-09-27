import {React, Trigger, Field, Column, Type} from "../../core";
import {Page, Panel} from "../../components";
import CodeMirror from "../../component/CodeMirror/CodeMirror";
import {SplitPanel, Splitter} from "../../component/panel/Splitter";
import FCtrl from "../../component/form/FCtrl";
import * as Utils from "../../utils/Utils";
//https://jsfiddle.net/
//https://codepen.io/

//ToDo: Dodać tryb konwersji danych - panele: wejściowy, skryptu, wyjściowy)

//https://github.com/tomkp/react-split-pane


class Format {
    key: string;
    name: string;
    content: Field;
    state: Field;
    mode: string;

    constructor(page: PWebTester, key: string, mode: string, name: string, active: boolean, value: any) {
        this.key = key;
        this.mode = mode;
        this.name = name;
        this.content = Field.create(Type.MEMO, "v" + key, name, value);
        this.state = Field.create(Type.BOOLEAN, "c" + key, name, active);
        this.state.onChange.listen(this, () => page.forceUpdate());
        page.formats.push(this);
    }
}

export default class PWebTester extends Page {

    fra: HTMLIFrameElement;
    console: HTMLDivElement;

    formats: Format[] = [];

    TXT: Format = new Format(this, "txt", "textile", "Tekst", true, "1 linia\n2 linia");
    JS: Format = new Format(this, "js", "javascript", "JavaScript", true, JS);
    CSS: Format = new Format(this, "css", "css", "CSS", false, CSS);
    HTML: Format = new Format(this, "html", "html", "HTML", false, HTML);

    constructor() {
        super(...arguments);
    }

    _reload() {
        const wnd = this.fra.contentWindow;
        const doc = wnd.document;
        doc.open();
        doc.write(this.HTML.content.value);

        wnd.console.log = (data) => {
            const div = doc.createElement("div");
            div.style.color = "yellow";
            div.innerText = data;
            this.console.appendChild(div);
        };

        wnd.onerror = (error, file, line, col) => {
            const div = doc.createElement("div");
            div.style.color = "#d33";
            div.innerText = `PLik: ${file}, linia: ${line}, błąd: "${error}"`;
            this.console.appendChild(div);
        };

        this.console.innerHTML = "";

        let css = doc.createElement("style");
        css.innerHTML = "\n" + this.CSS.content.value + "\n";
        doc.head.appendChild(css);

        let js = doc.createElement("script");
        js.innerHTML = `(function(document, window){\n${this.JS.content.value}\n})(document, window)`;
        doc.head.appendChild(js);

        doc.close();
    }


    render() {
        this.title.set("WEB Tester");


        return <Panel fit noPadding>

            <div>
                <button
                    style={{padding: "2px 8px"}}
                    onClick={e => this._reload(e)}
                >run
                </button>
                {this.formats.map((f: Format) => <FCtrl
                    key={f.key}
                    style={{padding: "2px 8px"}}
                    value={1}
                    name={2}
                    field={f.state}
                />)}
            </div>

            <Panel fit split noPadding>

                {
                    Utils.forEach(this.formats, (f: Format) => f.state.value ? <CodeMirror
                        key={Utils.randomId()}
                        style={{
                            width: '100%',
                            height: '100%',
                            color: "#bbb",
                            resize: "none",
                            border: "1px solid #888"
                        }}
                        mode={f.mode}
                        field={f.content}
                        onExecute={c => this._reload()}
                    /> : undefined)}

                <Panel fit split vertical>
                    <iframe ref={(e) => this.fra = e}
                            style={{
                                border: "none",
                                backgroundColor: "#fff",
                                width: "100%",
                                height: "100%",
                            }}/>
                    <pre contentEditable
                         readOnly
                         ref={(e) => this.console = e}
                         style={{
                             backgroundColor: "#222",
                             color: "#ddd",
                             font: "10pt Consolas",
                             padding: "8px",
                             width: "100%",
                             height: "100%",
                             overflow: "auto"
                         }}
                    />
                </Panel>
            </Panel>
        </Panel>
    }
}

const HTML = `<html>
    <head>
    </head>
    <body>
        <div>Hello</div>        
    </body>
</html>`;

const JS = `(function(document, window){
    let tag = document.createElement("div");
    tag.textContent = "JavaScript";
    document.body.appendChild(tag);
})(document, window);
    console.log("hello");
`;

const CSS = `body {
    color: #ccc;
    background-color: #333;
}`;