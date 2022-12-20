const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseConf = require('./webpack.base');

module.exports = Object.assign({}, baseConf, {
  entry: {
    ...baseConf.entry,
  },
  output: {
    path: path.join(__dirname, '../', 'assets'),
    filename: '[name][hash].js',
    publicPath: './',
  },
  target: "electron-renderer",
  module: {
    rules: [
      ...baseConf.module.rules,
    ]
  },
  plugins: [
    ...baseConf.plugins,
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify('production')
        }
      }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      filename: './index.html',
      inject: true,
      hash: true,
    })
  ],
  mode: 'production',
});

