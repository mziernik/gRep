// https://webpack.js.org/loaders/

const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
let _private;

// lista katalogów w node_modules, które będą obsługiwane
const nodeModulesWhiteList = [
    "react-grid-layout/css",
    "react-resizable/css",
    "react-widgets/dist",
    "react-table"
];


// ------------ konfiguracja prywatna (dla danego dewelopera) ----------------
try {
    _private = require('./.private.js');
} catch (e) {
    // jeśli plik nie istnieje, ignorujemy to i zwracamy domyślną strukturę
    console.error(e);
    _private = {
        devServer: {},
        environment: {}
    }
}

const environment = _private.environment;


function filter(loader, file, ext) {

    switch (loader) {

        case "babel":
            return ext === "js" || ext === "jsx";

        case "ts":
            return ext === "ts" || ext === "tsx";

        case "plain": // plain text
            return false;

        case "imports":
            const result = file.indexOf("syncfusion/common") >= 0 || file.indexOf("syncfusion/scripts") >= 0;
            if (result)
                console.log("-------------- imports: " + file);
            return result;

        case "url":
            return ["jpg", "png", "gif", "svg", "cur", "ttf", "eot", "woff", "woff2"].indexOf(ext) >= 0;

        case "css":
            return ext === "css";
            return false;
    }


    return null;
}

const acceptedFiles = [];
const rejectedFiles = [];
const allFiles = [];

let displayTimeout;


const config = {
    devtool: 'source-map',
    entry: __dirname + "/Index.js",
    output: {
        path: __dirname + "/" + (_private.outPath || "public"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: file => _filter("babel", file),
                loader: StringReplacePlugin.replace({
                    replacements: [
                        {
                            pattern: /$/,
                            replacement: function (match, p1, offset, string) {
                                debugger;
                                var fileName = null;
                                if (this && this.resourcePath)
                                    fileName = this.resourcePath.substring(__dirname.length + 1).split("\\").join("/");
                                return "\n\n(window._modules = (window._modules || [])).push([module, " + JSON.stringify(fileName) + "]);"
                            }
                        }
                    ]
                })
            },
            {
                test: file => _filter("babel", file),
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'es2016', 'react', 'stage-2', 'flow']
                }
            },
            {
                test: file => _filter("ts", file),
                loader: 'ts-loader'
            },
            {
                test: file => _filter("css", file),
                loader: "style-loader!css-loader"
            },
            {
                // test: file => _filter("imports", file),
                test: /component\/syncfusion\/.+\.js$/,
                loader: 'imports?jQuery=jquery,$=jquery,this=>window'
            },
            {
                test: file => _filter("plain", file),
                use: 'raw-loader'

            },
            {
                test: file => _filter("url", file),
                loader: "file-loader?name=/assets/[hash].[ext]"
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"]
    },
    plugins: [
        new StringReplacePlugin(),
        new ExtractTextPlugin({filename: 'style.css', allChunks: true}),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "window.$": "jquery"
        })
    ],
    devServer: {
        contentBase: "public",
        host: _private.devServer.host || "localhost",
        port: _private.devServer.port || 8080,
        historyApiFallback: true, // wymagane przez router
        inline: true,
        quiet: false,
    }
};


config.plugins.push(new OpenBrowserPlugin({url: 'http://' + config.devServer.host + ":" + config.devServer.port}));

const _env = {};
for (let name in environment)
    _env[name] = JSON.stringify(environment[name]);

config.plugins.push(new webpack.DefinePlugin({'process.env': _env}));


if (process.env.NODE_ENV === 'production') {
    config.devtool = false;
    config.plugins = [
     //   new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            comments: false
        })
    ];
}


module.exports = config;

function _filter(loader, file) {
    if (!file || file.indexOf(__dirname) !== 0) {
        debugger;
        console.error(`Nieprawidłowa ścieżka: "${file}"`);
        return;
    }


    file = file.substring(__dirname.length + 1).split("\\").join("/");
    const ext = file.indexOf(".") > 0 ? file.substring(file.lastIndexOf(".") + 1) : null;

    // wykluczenia
    if (file.indexOf("node_modules/") === 0
        && !nodeModulesWhiteList.find(str => file.startsWith("node_modules/" + str)))
        return false;

    if (allFiles.indexOf(file) === -1)
        allFiles.push(file);

    const acceptedIdx = acceptedFiles.indexOf(file);
    const rejectedIdx = rejectedFiles.indexOf(file);


    const result = filter(loader, file, ext);

    if (result === null)
        throw new Error("Nieznany loader: " + loader);


    if (acceptedIdx === -1) {

        if (result) {
            acceptedFiles.push(file);
            if (rejectedIdx !== -1)
                rejectedFiles.splice(rejectedIdx, 1);

        } else if (rejectedIdx === -1)
            rejectedFiles.push(file);

    }

    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {

        //   allFiles.sort();
        //    console.log("Pliki:\n\t" + allFiles.join("\n\t"))

        if (rejectedFiles.length > 0)
            console.warn("Nieużywane pliki:\n\t" + rejectedFiles.join("\n\t"))
    }, 1000);

    return result;
}


// -------------------- poniżej przykład pliku
const _module_exports = {

    outPath: "/../CKTechnik/CKTechnik/wwwroot", // katalog docelowy pliku bundle.js

    devServer: {
        host: "localhost",
        port: 8080
    },

    // zmienne środowiskowe przekazywane do aplikacji
    environment: {
        NODE_ENV: "development",
        WEB_API_URL: "http://localhost:52676/hubs/MainHub"
    }
};

