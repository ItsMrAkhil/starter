require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  name: 'server',
  target: 'node',

  // Use externals for skipping node_modules to include in build
  externals: [nodeExternals()],
  entry: [
    'babel-polyfill',

    // Build only the middleware and make it available to the only one port in production.
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
            'env',
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
      // Images will not get emit by the file-loader
      { test: /\.(jpe?g|png|gif|svg|eot|svg|otf|ttf|woff|woff2)$/i, loader: 'file-loader?emitFile=false&name=images/[name]-[hash].[ext]' },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(true),

    // Limit the chunks to only one file in ssr production mode
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),

    // Make NODE_ENV available for SSR
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
