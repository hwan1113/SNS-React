const { join } = require('path');
const webpack = require('webpack');
const config = require('config');
//cleans out bundle files whenever running webpack again.
const HtmlWebpackPlugin = require('html-webpack-plugin');

const GLOBALS = {
    'process.env': {
        NODE_ENV: JSON.stringify(config.get('NODE_ENV')),
        ENDPOINT: JSON.stringify(config.get('ENDPOINT')),
        RIA_SENTRY_APP: JSON.stringify(config.get('RIA_SENTRY_APP')),
        GOOGLE_API_KEY: JSON.stringify(config.get('GOOGLE_API_KEY')),
        FIREBASE_AUTH_DOMAIN: JSON.stringify(config.get('FIREBASE_AUTH_DOMAIN')),
        MAPBOX_API_TOKEN: JSON.stringify(config.get('MAPBOX_API_TOKEN'))
    }
};

module.exports = {
    devServer: {
        hot: true,
        // content not from webpack path.
        contentBase: join(__dirname, "../src"),
        open: true,
        //This means that a script will be inserted in your bundle to take care of live reloading, and build messages will appear in the browser console.
        inline: true,
        //serve index.html instead of any 404 response.
        historyApiFallback: true,
        //use gzip on contents
        compress: true,
        port: 3000,
        //Shows a full-screen overlay in the browser when there are compiler errors or warnings.
        overlay: { 
            warnings: true,
            errors: true
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        }
    },
    //when error occurs, it will point to exactly where it occured through mapping. 
    devtool: 'source-map',
    entry: ['./src/index'],
    cache: true,
    output: {
        path: join(__dirname, '..', 'static'),
        publicPath: 'http://localhost:3000/static/',
        filename: 'bundle.js'
    },
    plugins: [
        //create global constants which can be configured at compile time.
        new webpack.DefinePlugin(GLOBALS),
        new webpack.HotModuleReplacementPlugin(),
        //When the erorr occurs, do not refresh page
        new webpack.NoEmitOnErrorsPlugin(),
        // new HtmlWebpackPlugin({
        //     // Create HTML file that includes references to bundled CSS and JS.
        //     template: 'src/index.ejs',
        //     minify: {
        //         removeComments: true,
        //         collapseWhitespace: true,
        //         removeRedundantAttributes: true,
        //         useShortDoctype: true,
        //         removeEmptyAttributes: true,
        //         removeStyleLinkTypeAttributes: true,
        //         keepClosingSlash: true,
        //         minifyJS: true,
        //         minifyCSS: true,
        //         minifyURLs: true
        //     },
        //     inject: true
        // })
    ],
    module: {
        rules: [
            {
                test: /\.(eot|svg|woff|woff2|otf|ttf)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            },
            {
                test: /\.js$/,
                include: join(__dirname, '../', 'src'),
                loader: 'babel-loader'
            },
            { test: /\.(jpe?g|png|gif)$/i, loaders: ['file-loader'] },
            { test: /\.ico$/, loader: 'file-loader?name=[name].[ext]' },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /(\.css|\.scss)$/,
                loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
            }
        ]
    }
};
