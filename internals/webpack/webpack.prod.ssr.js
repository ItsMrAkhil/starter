require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: [
    'babel-polyfill',
    path.join(process.cwd(), 'client/ssrMiddleware.js'),
  ],
  output: {
    path: path.join(process.cwd(), 'server/middleware'),
    filename: 'generated.ssrMiddleware.js',
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
            [
              'babel-plugin-transform-require-ignore',
              {
                extensions: ['.less', '.sass', '.css'],
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
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  stats: 'errors-only',
};
