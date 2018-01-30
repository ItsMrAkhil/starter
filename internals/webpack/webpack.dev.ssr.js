require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

// Path for generated ssrEntry file involves express server
const serverLocation = 'dev-build/generated.ssrEntry.js';

module.exports = {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: [
    'babel-polyfill',
    path.join(process.cwd(), 'client/ssrEntry.js'),
  ],
  output: {
    path: path.join(process.cwd(), 'dev-build'),
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
            'env',
          ],
          plugins: [
            'react-loadable/babel',
            [
              'babel-plugin-transform-require-ignore',
              {
                // Skip css files to include in ssr dev build
                extensions: ['.less', '.sass', '.css', 'scss'],
              },
            ],
          ],
        },
      },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader?emitFile=false&name=images/[name]-[hash].[ext]' },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(true),

    // Limit entire build to one chunk.
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        PORT: JSON.stringify(process.env.PORT),
      },
    }),

    // Start the proxy server at PORT+1 on build complete which keeps restarting on client code change.
    new WebpackShellPlugin({
      onBuildEnd: [`nodemon -q --watch ${serverLocation} ${serverLocation}`],
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
    ignored: /node_modules/,
  },
  stats: 'errors-only',
};
