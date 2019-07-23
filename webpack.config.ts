import {Configuration} from 'webpack';
import HTMLWebpack from 'html-webpack-plugin';
import Copy from 'copy-webpack-plugin';
const Favicon = require('favicons-webpack-plugin');
import ExtractText from 'extract-text-webpack-plugin';

const CSS = new ExtractText('app.css');

const config: Configuration = {
  entry: ['./src/typescript/index.ts', './src/styles/base.scss'],

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {test: /\.ts/, loader: 'ts-loader'},
      {test: /\.scss/, loader: CSS.extract(['css-loader', 'sass-loader'])},
      {test: /\.html/, use: {
        loader: 'html-loader',
        options: {
          // attrs: ['meta:content']
        }
      }},
      {test: /\.svg/, loader: 'url-loader'}
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
      { from: './src/googled8112ee85b009eda.html', to: 'googled8112ee85b009eda.html'}
    ])
  ],

}

export default config;
