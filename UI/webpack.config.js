const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
let _private;

debugger;

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

const EXCLUDE = /node_modules/;

const environment = _private.environment;


const config = {
    devtool: 'source-map',
    entry: __dirname + "/Index.js",
    output: {
        path: __dirname + "/" + (_private.outPath || "public"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: EXCLUDE,
                loader: 'babel-loader',
                query: {presets: ['es2016', 'react', 'stage-2', 'flow']}
            },
            {
                test: /\.tsx?$/,
                exclude: EXCLUDE,
                loader: 'ts-loader'
            },
            // {
            //     test: /\.css$/,
            //     loader: "style-loader!css-loader"
            // },
            {
                test: /\.css$/,
                exclude: EXCLUDE,
                use: 'raw-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: EXCLUDE,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new ExtractTextPlugin({filename: 'style.css', allChunks: true})
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


/*
 * If bundling for production, optimize output
 */
/*
 if (process.env.NODE_ENV === 'production') {
 config.devtool = false;
 config.plugins = [
 new webpack.optimize.OccurenceOrderPlugin(),
 new webpack.optimize.UglifyJsPlugin({comments: false}),
 new webpack.DefinePlugin({
 'process.env': {NODE_ENV: JSON.stringify('production')}
 })
 ];
 }

 */
module.exports = config;


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

