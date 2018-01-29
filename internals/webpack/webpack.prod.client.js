const path = require('path');
const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

module.exports = {
  entry: [
    path.join(process.cwd(), 'client/app.js'),
  ],
  output: {
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash]-chunk.js',
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
            'transform-react-remove-prop-types',
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
    new ReactLoadablePlugin({
      filename: path.resolve(process.cwd(), 'build/react-loadable.json'),
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: Infinity,
      async: true,
    }),
    new ExtractTextPlugin('styles-[hash].css'),
    new OfflinePlugin({
      responseStrategy: 'network-first',
      caches: 'all',
      safeToUseOptionalCaches: true,
      autoUpdate: 1000 * 60 * 48,
      AppCache: false,
    }),
    new UglifyJSPlugin(),
    new StatsWriterPlugin(),
  ],
  resolve: {
    modules: ['client', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
    ],
  },
};
