/* global module __dirname */

import path from 'path';
import webpack from 'webpack';
import process from 'process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const isProdBuild = process.argv.indexOf('-p') > -1;
const devtool = isProdBuild ? 'source-map' : 'cheap-module-eval-source-map';
const filename = isProdBuild ? '[name].bundle-[chunkhash:8].js' : '[name].bundle.js';

// eslint-disable-next-line no-console
console.log(`Running webpack with devtool \x1b[32m${devtool}\x1b[0m and output.filename \x1b[32m${filename}\x1b[0m`);

const config = {
  entry: './src/index.js',
  output: {
    filename,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'bower_components'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {loader: 'babel-loader'},
          {loader: 'polymer-webpack-loader'},
        ],
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: 'css-loader',
      },
    ],
  },
  devtool,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9010,
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.ejs'),
      inject: false,
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'bower_components/webcomponentsjs/*.js'),
        to: 'bower_components/webcomponentsjs/[name].[ext]',
      },
      {
        from: path.resolve(__dirname, 'src/styling.css'),
        to: 'styling.css',
      },
    ]),
  ],
};

module.exports = config;
