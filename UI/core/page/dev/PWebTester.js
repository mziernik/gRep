import {React, Trigger, Field, Column, Type} from "../../core";
import {Page, Panel} from "../../components";
import CodeMirror from "../../component/CodeMirror/CodeMirror";
import {SplitPanel, Splitter} from "../../component/Splitter";
//https://jsfiddle.net/

//ToDo: Dodać tryb konwersji danych - panele: wejściowy, skryptu, wyjściowy)

//https://github.com/tomkp/react-split-pane

export default class PWebTester extends Page {

    fra: HTMLIFrameElement;
    console: HTMLDivElement;

    JS: Field = new Field((fc: Column) => {
        fc.type = Type.STRING;
        fc.key = "js";
        fc.name = " JavaScript";
        fc.defaultValue = JS;
        // fc.store = "WebTester_JS";
    });

    CSS: Field = new Field((fc: Column) => {
        fc.type = Type.STRING;
        fc.key = "css";
        fc.name = " CSS";
        fc.defaultValue = CSS;
        // fc.store = "WebTester_CSS";
    });

    HTML: Field = new Field((fc: Column) => {
        fc.type = Type.STRING;
        fc.key = "html";
        fc.name = " HTML";
        fc.defaultValue = HTML;
        // fc.store = "WebTester_HTML";
    });

    changed = new Trigger(() => this._reload(), 1500);

    constructor() {
        super(...arguments);
        this.JS.onChange.listen(this, () => this.changed.run());
        this.CSS.onChange.listen(this, () => this.changed.run());
        this.HTML.onChange.listen(this, () => this.changed.run());
    }

    _reload() {
        const wnd = this.fra.contentWindow;
        const doc = wnd.document;
        doc.open();
        doc.write(this.HTML.value);

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
        css.innerHTML = "\n" + this.CSS.value + "\n";
        doc.head.appendChild(css);

        let js = doc.createElement("script");
        js.innerHTML = `//# sourceURL=skrypcik\n (function(document, window){\n${this.JS.value}\n})(document, window)`;
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

        super.renderTitle("WEB Tester");

        this.changed.run();

        const cmStyle = {
            width: '100%',
            height: '100%',
            color: "#bbb",
            resize: "none",
        };

        return <Panel fit noPadding>

            <Splitter>

                <Splitter horizontal>
                    <CodeMirror style={cmStyle} field={this.HTML} mode="html"/>
                    <CodeMirror style={cmStyle} field={this.JS} mode="javascript"/>
                    <CodeMirror style={cmStyle} field={this.CSS} mode="css"/>
                </Splitter>

                <Splitter horizontal>
                    <iframe ref={(e) => this.fra = e}
                            style={{
                                border: "none",
                                backgroundColor: "#fff",
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}/>

                    <div ref={(e) => this.console = e}
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

                </Splitter>
            </Splitter>
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