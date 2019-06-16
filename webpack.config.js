const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    plugins: [
        new CompressionPlugin(),
        new HtmlWebpackPlugin({
            title: 'OUUUT',
            filename: 'index.html',
            template: 'src/index.html',
            inlineSource: '.(js|css)$', // embed all javascript and css inline
        }),
        new HtmlWebpackInlineSourcePlugin()
    ],
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dis'),
        filename: 'main.js'
    }
};


