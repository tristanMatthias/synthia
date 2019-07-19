import {Configuration} from 'webpack';
import HTMLWebpack from 'html-webpack-plugin';

const config: Configuration = {
  entry: './src/index.ts',

  plugins: [
    new HTMLWebpack()
  ]
}

export default config;
