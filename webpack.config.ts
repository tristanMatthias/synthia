import {Configuration} from 'webpack';
import HTMLWebpack from 'html-webpack-plugin';
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
      {test: /\.html/, loader: 'html-loader'},
      {test: /\.svg/, loader: 'url-loader'}
    ]
  },

  plugins: [
    new HTMLWebpack({
      template: './src/index.html'
    }),
    CSS
  ],

}

export default config;
