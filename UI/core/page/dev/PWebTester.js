import {React, Trigger, Field, FieldConfig, Type} from "../../core";
import {Page} from "../../components";
import CodeMirror from "../../component/CodeMirror/CodeMirror";

//ToDo: Dodać tryb konwersji danych - panele: wejściowy, skryptu, wyjściowy)

//https://github.com/tomkp/react-split-pane

export default class PWebTester extends Page {

    fra: HTMLIFrameElement;
    console: HTMLDivElement;

    js: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "js";
        fc.name = " JavaScript";
        fc.defaultValue = JS;
        // fc.store = "WebTester_JS";
    });

    css: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "css";
        fc.name = " CSS";
        fc.defaultValue = CSS;
        // fc.store = "WebTester_CSS";
    });

    HTML: Field = new Field((fc: FieldConfig) => {
        fc.type = Type.STRING;
        fc.key = "html";
        fc.name = " HTML";
        fc.defaultValue = JS;
        // fc.store = "WebTester_HTML";
    });

    changed = new Trigger(() => this._reload(), 500);

    constructor() {
        super(...arguments);
        this.js.onChange.listen(this, () => this.changed.run());
        this.css.onChange.listen(this, () => this.changed.run());
        this.html.onChange.listen(this, () => this.changed.run());
    }

    _reload() {
        const wnd = this.fra.contentWindow;
        const doc = wnd.document;
        doc.open();
        doc.write(this.html.get());

        wnd.console.log = (data) => {
            const div = doc.createElement("div");
            div.style.color = "yellow";
            div.innerText = data;
            this.console.appendChild(div);
        };

        wnd.onerror = (error, file, line, col) => {
            const div = doc.createElement("div");
            div.style.color = "#d33",
                div.innerText = `PLik: ${file}, linia: ${line}, błąd: "${error}"`;
            this.console.appendChild(div);
        };

        this.console.innerHTML = "";

        let css = doc.createElement("style");
        css.innerHTML = "\n" + this.css.value + "\n";
        doc.head.appendChild(css);

        let js = doc.createElement("script");
        js.innerHTML = `//# sourceURL=skrypcik\n (function(document, window){\n${this.js.value}\n})(document, window)`;
        doc.head.appendChild(js);

        doc.close();
    }

    componentWillUnmount() {
        this.changed.cancel();
        super.componentWillUnmount();
    }

    _textAreaKeyDown(e: Event) {
        if (e.keyCode !== 9)
            return;
        return;
        const ta = e.target;
        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        ta.value = ta.value.substring(0, start)
            + "\t"
            + ta.value.substring(end);
        ta.selectionStart = ta.selectionEnd = start + 1;
        e.preventDefault();
    };

    render() {

        this.changed.run();

        const cmStyle = {
            flex: "100",
            color: "#bbb",
            border: "1px solid #666",
            resize: "none",
            margin: "2px"
        };

        return <div style={ {
            display: "flex",
            height: "100%",
            flexDirection: "column"
        } }>

            <div style={{
                padding: "8px",
                height: "40px"
            }}>
                <button>Zapisz</button>
                <button>Uruchom</button>
            </div>


            <div style={{
                flex: "auto",
                display: "flex",
            }}>

                <div style={{
                    flex: "50%",
                    display: "flex",
                    flexDirection: "column"
                }}>

                    <CodeMirror style={cmStyle} field={this.html} mode="html"/>

                    <CodeMirror style={cmStyle} field={this.js} mode="javascript"/>

                    <CodeMirror style={cmStyle} field={this.css} mode="css"/>


                </div>

                <div style={{
                    flex: "50%",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <iframe ref={(e) => this.fra = e}
                            style={{
                                backgroundColor: "#fff",
                                width: "100%",
                                flex: "auto",
                                border: "none",
                                margin: "2px"
                            }}/>

                    <div ref={(e) => this.console = e}
                         style={{
                             backgroundColor: "#222",
                             margin: "2px",
                             color: "#ddd",
                             font: "10pt Consolas",
                             padding: "8px",
                             border: "1px solid #aaa",
                             width: "100%",
                             height: "40%",
                             overflow: "auto"
                         }}
                    />

                </div>
            </div>
        </div>
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