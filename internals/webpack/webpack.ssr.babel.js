require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

const serverLocation = 'server/middlewares/generated.ssrEntry.js';

module.exports = {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: [
    'babel-polyfill',
    path.join(process.cwd(), 'client/ssrEntry.js'),
  ],
  output: {
    path: path.join(process.cwd(), 'server', 'middlewares'),
    filename: 'generated.ssrEntry.js',
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            'react',
            'stage-0',
            ['env', { targets: { browsers: ['last 2 versions'] } }],
          ],
          plugins: [
            'react-loadable/babel',
          ]
        },
      }
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PORT: JSON.stringify(process.env.PORT),
      },
    }),
    new WebpackShellPlugin({
      onBuildEnd: [`nodemon --watch ${serverLocation} ${serverLocation}`],
      dev: true,
    }),
  ],
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  stats: 'errors-only',
};
