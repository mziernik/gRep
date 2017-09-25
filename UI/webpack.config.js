// https://webpack.js.org/loaders/

const ENV = process.env.NODE_ENV;
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");
const WebpackAutoInject = require('webpack-auto-inject-version');

// lista katalogów w node_modules, które będą przetwarzane
const nodeModulesWhiteList = [
    "react-grid-layout/css",
    "react-resizable/css",
    "react-widgets/dist",
    "react-table"
];


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
        path: __dirname + "/" + "public",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: file => _filter("babel", file),
                loader: StringReplacePlugin.replace({
                    replacements: [
                        {
                            pattern: /^/,
                            replacement: _moduleMarker
                        },
                        {
                            pattern: /$/,
                            replacement: _moduleMarker
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
        host: "localhost",
        port: 8080,

        historyApiFallback: {  // wymagane przez router
            rewrites: [
                {
                    from: /^\/dev\/.*$/,
                    to: () => 'index.html'
                }
            ]
        },
        inline: true,
        quiet: false,
    }
};


config.plugins.push(new OpenBrowserPlugin({url: 'http://' + config.devServer.host + ":" + config.devServer.port}));

const environment = {};
environment.BUILD_VERSION = require("./package.json").version;
environment.BUILD_DATE = new Date().getTime();
environment.NODE_ENV = ENV;


for (let name in environment)
    environment[name] = JSON.stringify(environment[name]);

config.plugins.push(new webpack.DefinePlugin({'process.env': environment}));

if (ENV === 'production' || ENV === 'test') {

    if (ENV === 'production')
        config.devtool = false;

    config.plugins.push(
        new WebpackAutoInject({
            PACKAGE_JSON_PATH: './package.json',
            components: {
                AutoIncreaseVersion: true,
                InjectAsComment: false
            },
            componentsOptions: {
                AutoIncreaseVersion: {
                    runInWatchMode: false
                },
            }
        }),
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}), // Minimum number of characters
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                keep_fnames: true
            },
            mangle: {
                warnings: false,
                keep_fnames: true
            }
        })
    )

}


module.exports = config;

function _moduleMarker(match, pos, offset) {
    // nie można dodawać nowych linii bo są problemy z debugowaniem
    var fileName = null;
    if (this && this.resourcePath)
        fileName = this.resourcePath.substring(__dirname.length + 1).split("\\").join("/");
    return "  (window._registerModule && window._registerModule(" + JSON.stringify(fileName) + ", module, " + pos + "));  ";
}

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

