const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  target: 'web',

  // Add source maps for better development
  devtool: 'eval-source-map',
  entry: [
    'eventsource-polyfill', // Necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true',
    path.join(process.cwd(), 'client/app.js'), // Start with js/app.js
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
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

            // Make HMR to work well by using react-hot-loader module
            'react-hot-loader/babel',
          ],
        },
      },
      {
        test: /.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'file-loader?name=images/[name]-[hash].[ext]' },
    ],
  },
  plugins: [

    // Enable HMR in dev mode
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: 2,
      async: true,
    }),

    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),

    // React loadable plugin for including js files of loadable chunks in ssr
    // It generates a json file, which includes details of chunk files,
    // which chunk is belongs to which loadable component
    new ReactLoadablePlugin({
      filename: path.resolve(process.cwd(), 'build/react-loadable.json'),
    }),

    // Extract all the css and make one styles.css file.
    new ExtractTextPlugin('styles.css'),
  ],
  resolve: {
    modules: ['client', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
    ],
  },
};
