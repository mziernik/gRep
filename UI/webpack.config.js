"use strict";
const ENV = process.env.NODE_ENV;
const DEV = ENV === 'development';
const TEST = ENV === 'test';
const PROD = ENV === 'production';

const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "3000";

const environment = {};
environment.BUILD_VERSION = require("./package.json").version;
environment.BUILD_DATE = new Date().getTime();
environment.NODE_ENV = ENV;
for (let name in environment)
    environment[name] = JSON.stringify(environment[name]);


module.exports = {
    entry: [
        'react-hot-loader/patch',
        './Index.js'
    ],
    //devtool: false,
    devtool: 'source-map',
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {loaders: []},
    devServer: {
        contentBase: "./public",
        // noInfo: true,        // do not print bundle build stats
        hot: true,        // enable HMR
        inline: true,         // embed the webpack-dev-server runtime into the bundle
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: {  // wymagane przez router
            rewrites: [
                {
                    from: /^\/dev\/.*$/,
                    to: () => 'index.html'
                }
            ]
        },
        port: PORT,
        host: HOST
    },

};

module.exports.plugins = [
    new OpenBrowserPlugin({url: `http://${HOST}:${PORT}`}),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({'process.env': environment}),
    new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true
    }),
    // do sprawdzenia czy potrzebny
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        "window.$": "jquery"
    }),
    new HtmlWebpackPlugin({
        template: './core/application/index.html',
        files: {
            title: 'gRep',
            //  filename: 'assets/admin.html',
            // css: ['style.css'],
            js: ["bundle.js"],
        }
    }),
];
/*
if (!DEV) {

    module.exports.plugins.push(
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
        new UglifyJSPlugin({
           // sourceMap: true,
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

*/
//=============================== LOADERY =================================================
module.exports.module.loaders = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|public\/)/,
        loader: "babel-loader",
        query: {
            presets: [
                'es2016', // builduje się znacznie szybciej niż 2015, nie działa w połączeniu z uglify
                'react', 'stage-2', 'flow'
            ],
            plugins: [ // tylko w trybie produkcyjnym
              //  "transform-react-constant-elements",
                "transform-react-inline-elements"
            ]
        }
    },
    {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?importLoaders=1'],
    },
    {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
    },
    {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader"
    },
    {
        test: /\.(woff|woff2)$/,
        loader: "url-loader?prefix=font/&limit=5000"
    },
    {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream"
    },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml"
    },
    {
        test: /\.gif/,
        loader: "url-loader?limit=10000&mimetype=image/gif"
    },
    {
        test: /\.jpg/,
        loader: "url-loader?limit=10000&mimetype=image/jpg"
    },
    {
        test: /\.png/,
        loader: "url-loader?limit=10000&mimetype=image/png"
    }
];

