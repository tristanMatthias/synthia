import 'webpack-dev-server';

import Copy from 'copy-webpack-plugin';
import ExtractText from 'extract-text-webpack-plugin';
import HTMLWebpack from 'html-webpack-plugin';
import { Configuration } from 'webpack';

const Favicon = require('favicons-webpack-plugin');
const ReplacePlugin = require('webpack-plugin-replace');


const CSS = new ExtractText('app.css');

const isProd = process.env.NODE_ENV != 'development';


const config: Configuration = {
  entry: ['./src/typescript/index.ts', './src/styles/base.scss'],

  resolve: {
    extensions: ['.ts', '.js']
  },

  output: {
    publicPath: '/'
  },

  devServer: {
    historyApiFallback: true
  },

  module: {
    rules: [
      {test: /\.ts/, loader: 'ts-loader'},
      {test: /\.scss/, loader: CSS.extract(['css-loader', 'sass-loader'])},
      {test: /\.html/, loader: 'html-loader'},
      {test: /\.svg/, loader: 'url-loader'},
      {test: /font\/.*\.(svg|eot|ttf|woff|woff2)/, loader: 'url-loader', options: {
        limit: false,
        outputPath: 'fonts'
      }},
      {test: /\.(wav|mp3)/, loader: 'url-loader', options: {
        limit: false,
        outputPath: 'sounds'
      }},
      {test: /\.gql/, loader: 'raw-loader'}
    ]
  },

  plugins: [
    new HTMLWebpack({
      template: './src/index.html'
    }),
    CSS,
    new Favicon('./src/images/favicon.png'),
    new Copy([
      {from: './src/images/social', to: 'social'},
      {from: './src/images/', to: 'images'},
      {from: './_redirects'}
    ]),
    new ReplacePlugin({
      values: {
        '{{API_URL}}': isProd ? 'https://api.synthia.app' : 'http://localhost:4000',
        '{{IS_PROD}}': isProd
      }
    })
  ],

}

export default config;
