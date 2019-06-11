const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
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
        path: path.resolve(__dirname, 'docs'),
        filename: 'main.js'
    }
};


