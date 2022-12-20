const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    index: './src/Entry.tsx',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ],
  },
  plugins: [
  ],
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
  },
  externals: {
    electron: 'window.$electron',
  }
};

