import React from 'react';
import PropTypes from 'prop-types';

import CM from "./lib/codemirror.js";
import "./lib/codemirror.css";

import "./mode/apl/apl.js"
import "./mode/asciiarmor/asciiarmor.js"
import "./mode/asn.1/asn.1.js"
import "./mode/asterisk/asterisk.js"
import "./mode/brainfuck/brainfuck.js"
import "./mode/clike/clike.js"
import "./mode/clojure/clojure.js"
import "./mode/cmake/cmake.js"
import "./mode/cobol/cobol.js"
import "./mode/coffeescript/coffeescript.js"
import "./mode/commonlisp/commonlisp.js"
import "./mode/crystal/crystal.js"
import "./mode/css/css.js"
import "./mode/cypher/cypher.js"
import "./mode/d/d.js"
import "./mode/dart/dart.js"
import "./mode/diff/diff.js"
import "./mode/django/django.js"
import "./mode/dockerfile/dockerfile.js"
import "./mode/dtd/dtd.js"
import "./mode/dylan/dylan.js"
import "./mode/ebnf/ebnf.js"
import "./mode/ecl/ecl.js"
import "./mode/eiffel/eiffel.js"
import "./mode/elm/elm.js"
import "./mode/erlang/erlang.js"
import "./mode/factor/factor.js"
import "./mode/fcl/fcl.js"
import "./mode/forth/forth.js"
import "./mode/fortran/fortran.js"
import "./mode/gas/gas.js"
import "./mode/gfm/gfm.js"
import "./mode/gherkin/gherkin.js"
import "./mode/go/go.js"
import "./mode/groovy/groovy.js"
import "./mode/haml/haml.js"
import "./mode/handlebars/handlebars.js"
import "./mode/haskell/haskell.js"
import "./mode/haskell-literate/haskell-literate.js"
import "./mode/haxe/haxe.js"
import "./mode/htmlembedded/htmlembedded.js"
import "./mode/htmlmixed/htmlmixed.js"
import "./mode/http/http.js"
import "./mode/idl/idl.js"
import "./mode/javascript/javascript.js"
import "./mode/jinja2/jinja2.js"
import "./mode/jsx/jsx.js"
import "./mode/julia/julia.js"
import "./mode/livescript/livescript.js"
import "./mode/lua/lua.js"
import "./mode/markdown/markdown.js"
import "./mode/mathematica/mathematica.js"
import "./mode/mbox/mbox.js"
import "./mode/mirc/mirc.js"
import "./mode/mllike/mllike.js"
import "./mode/modelica/modelica.js"
import "./mode/mscgen/mscgen.js"
import "./mode/mumps/mumps.js"
import "./mode/nginx/nginx.js"
import "./mode/nsis/nsis.js"
import "./mode/ntriples/ntriples.js"
import "./mode/octave/octave.js"
import "./mode/oz/oz.js"
import "./mode/pascal/pascal.js"
import "./mode/pegjs/pegjs.js"
import "./mode/perl/perl.js"
import "./mode/php/php.js"
import "./mode/pig/pig.js"
import "./mode/powershell/powershell.js"
import "./mode/properties/properties.js"
import "./mode/protobuf/protobuf.js"
import "./mode/pug/pug.js"
import "./mode/puppet/puppet.js"
import "./mode/python/python.js"
import "./mode/q/q.js"
import "./mode/r/r.js"
import "./mode/rpm/rpm.js"
import "./mode/rst/rst.js"
import "./mode/ruby/ruby.js"
import "./mode/rust/rust.js"
import "./mode/sas/sas.js"
import "./mode/sass/sass.js"
import "./mode/scheme/scheme.js"
import "./mode/shell/shell.js"
import "./mode/sieve/sieve.js"
import "./mode/slim/slim.js"
import "./mode/smalltalk/smalltalk.js"
import "./mode/smarty/smarty.js"
import "./mode/solr/solr.js"
import "./mode/soy/soy.js"
import "./mode/sparql/sparql.js"
import "./mode/spreadsheet/spreadsheet.js"
import "./mode/sql/sql.js"
import "./mode/stex/stex.js"
import "./mode/stylus/stylus.js"
import "./mode/swift/swift.js"
import "./mode/tcl/tcl.js"
import "./mode/textile/textile.js"
import "./mode/tiddlywiki/tiddlywiki.js"
import "./mode/tiki/tiki.js"
import "./mode/toml/toml.js"
import "./mode/tornado/tornado.js"
import "./mode/troff/troff.js"
import "./mode/ttcn/ttcn.js"
import "./mode/ttcn-cfg/ttcn-cfg.js"
import "./mode/turtle/turtle.js"
import "./mode/twig/twig.js"
import "./mode/vb/vb.js"
import "./mode/vbscript/vbscript.js"
import "./mode/velocity/velocity.js"
import "./mode/verilog/verilog.js"
import "./mode/vhdl/vhdl.js"
import "./mode/vue/vue.js"
import "./mode/webidl/webidl.js"
import "./mode/xml/xml.js"
import "./mode/xquery/xquery.js"
import "./mode/yacas/yacas.js"
import "./mode/yaml/yaml.js"
import "./mode/yaml-frontmatter/yaml-frontmatter.js"
import "./mode/z80/z80.js"

import "./theme/3024-day.css"
import "./theme/3024-night.css"
import "./theme/abcdef.css"
import "./theme/ambiance-mobile.css"
import "./theme/ambiance.css"
import "./theme/base16-dark.css"
import "./theme/base16-light.css"
import "./theme/bespin.css"
import "./theme/blackboard.css"
import "./theme/cobalt.css"
import "./theme/colorforth.css"
import "./theme/dracula.css"
import "./theme/duotone-dark.css"
import "./theme/duotone-light.css"
import "./theme/eclipse.css"
import "./theme/elegant.css"
import "./theme/erlang-dark.css"
import "./theme/hopscotch.css"
import "./theme/icecoder.css"
import "./theme/isotope.css"
import "./theme/lesser-dark.css"
import "./theme/liquibyte.css"
import "./theme/material.css"
import "./theme/mbo.css"
import "./theme/mdn-like.css"
import "./theme/midnight.css"
import "./theme/monokai.css"
import "./theme/neat.css"
import "./theme/neo.css"
import "./theme/night.css"
import "./theme/panda-syntax.css"
import "./theme/paraiso-dark.css"
import "./theme/paraiso-light.css"
import "./theme/pastel-on-dark.css"
import "./theme/railscasts.css"
import "./theme/rubyblue.css"
import "./theme/seti.css"
import "./theme/solarized.css"
import "./theme/the-matrix.css"
import "./theme/tomorrow-night-bright.css"
import "./theme/tomorrow-night-eighties.css"
import "./theme/ttcn.css"
import "./theme/twilight.css"
import "./theme/vibrant-ink.css"
import "./theme/xq-dark.css"
import "./theme/xq-light.css"
import "./theme/yeti.css"
import "./theme/zenburn.css"


import "./addon/display/fullscreen.js";
import "./addon/display/fullscreen.css";

import "./util/formatting.js";

import Component from "..//Component";
import * as If from "../../utils/Is";
import Field from "../../repository/Field";

type Mode = "apl" | "asciiarmor" | "asn.1" | "asterisk" | "brainfuck" | "clike" | "clojure" | "cmake" | "cobol"
    | "coffeescript" | "commonlisp" | "crystal" | "css" | "cypher" | "d" | "dart" | "diff" | "django" | "dockerfile"
    | "dtd" | "dylan" | "ebnf" | "ecl" | "eiffel" | "elm" | "erlang" | "factor" | "fcl" | "forth" | "fortran" | "gas"
    | "gfm" | "gherkin" | "go" | "groovy" | "haml" | "handlebars" | "haskell" | "haskell-literate" | "haxe"
    | "htmlembedded" | "htmlmixed" | "http" | "idl" | "javascript" | "jinja2" | "jsx" | "julia"
    | "livescript" | "lua" | "markdown" | "mathematica" | "mbox" | "meta.js" | "mirc" | "mllike" | "modelica"
    | "mscgen" | "mumps" | "nginx" | "nsis" | "ntriples" | "octave" | "oz" | "pascal" | "pegjs" | "perl" | "php"
    | "pig" | "powershell" | "properties" | "protobuf" | "pug" | "puppet" | "python" | "q" | "r" | "rpm" | "rst"
    | "ruby" | "rust" | "sas" | "sass" | "scheme" | "shell" | "sieve" | "slim" | "smalltalk" | "smarty" | "solr"
    | "soy" | "sparql" | "spreadsheet" | "sql" | "stex" | "stylus" | "swift" | "tcl" | "textile" | "tiddlywiki"
    | "tiki" | "toml" | "tornado" | "troff" | "ttcn" | "ttcn-cfg" | "turtle" | "twig" | "vb" | "vbscript"
    | "velocity" | "verilog" | "vhdl" | "vue" | "webidl" | "xml" | "xquery" | "yacas" | "yaml" | "yaml-frontmatter"
    | "z80";

type Theme = "3024-day" | "3024-night" | "abcdef" | "ambiance-mobile" | "ambiance" | "base16-dark" | "base16-light"
    | "bespin" | "blackboard" | "cobalt" | "colorforth" | "dracula" | "duotone-dark" | "duotone-light" | "eclipse"
    | "elegant" | "erlang-dark" | "hopscotch" | "icecoder" | "isotope" | "lesser-dark" | "liquibyte" | "material"
    | "mbo" | "mdn-like" | "midnight" | "monokai" | "neat" | "neo" | "night" | "panda-syntax" | "paraiso-dark"
    | "paraiso-light" | "pastel-on-dark" | "railscasts" | "rubyblue" | "seti" | "solarized" | "the-matrix"
    | "tomorrow-night-bright" | "tomorrow-night-eighties" | "ttcn" | "twilight" | "vibrant-ink" | "xq-dark"
    | "xq-light" | "yeti" | "zenburn"

export default class CodeMirror extends Component {


    field: Field;

    static propTypes = {
        ignore: PropTypes.bool, // warunek wykluczający rysowanie
        value: PropTypes.string,
        mode: PropTypes.string.isRequired,
        theme: PropTypes.string,
        field: PropTypes.any,
        onChange: PropTypes.func,
        style: PropTypes.object,
        editorRef: PropTypes.func,
        onExecute: PropTypes.func, // funkcja zwrotna dla Ctrl+Enter
    };

    static defaultProps = {
        theme: "eclipse",
        value: "",
        style: {}
    };

    constructor() {
        super(...arguments);
        this.field = this.props.field;
    }

    /*      function getSelectedRange() {
     return { from: editor.getCursor(true), to: editor.getCursor(false) };
     }

     function autoFormatSelection() {

     }

     function commentSelection(isComment) {
     var range = getSelectedRange();
     editor.commentRange(isComment, range.from, range.to);
     }
     */

    render() {

        const keys = {
            "Ctrl-J": "toMatchingTag",
            "Ctrl-S": (cm) => {
                cm.saveCode(cm); //function called when 'ctrl+s' is used when instance is in focus
            },
            "Shift-Alt-F": (cm) => {
                const from = cm.getCursor(true);
                const to = cm.getCursor(false);
                CM.commands["selectAll"](cm);
                cm.autoFormatRange(cm.getCursor(true), cm.getCursor(false));
                cm.doc.setSelection(from, to);
            },
            "Esc": (cm) => {
                cm.toggleFullscreen(cm, false); //function to escape full screen mode
            }
        }

        if (this.props.onExecute)
            keys["Ctrl-Enter"] = cm => this.props.onExecute(cm);


        return <div
            ref={tag => {

                if (!tag)
                    return;

                const cm = this.editor = new CM(tag, {
                    value: (this.field ? this.field.value : this.props.value) || "",
                    lineNumbers: true,
                    mode: this.props.mode,
                    theme: this.props.theme,
                    readOnly: false,
                    autofocus: false,
                    extraKeys: keys
                });

                cm.on("change", (cm, change) => {
                    if (this.field)
                        this.field.value = cm.getValue();
                    if (If.func(this.props.onChange))
                        this.props.onChange(cm, change);
                });

                If.func(this.props.editorRef, f => f(cm));

            }}

            style={this.props.style}
        />
    }
};

/*
 Modyfikacje w pliku codemirror.js, linia 450 - wrapper bazuje na bieżącym tagu (w oryginale tworzony był nowy div)

 */