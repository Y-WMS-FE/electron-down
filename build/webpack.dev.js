const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConf = require('./webpack.base');
module.exports = Object.assign({}, baseConf, {
  mode: 'development',
  entry: {
    ...baseConf.entry,
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: '[name].js',
  },
  module: {
    rules: [
      ...baseConf.module.rules,
    ]
  },
  plugins: [
    ...baseConf.plugins,
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      cache: true,
      inject: true,
      hash: true
    })
  ],
  devServer: {
    host: 'localhost',
    port: '9899',
    hot: true,
    contentBase: path.join(__dirname, './'),
  },
});

