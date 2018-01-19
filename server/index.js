require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const ip = require('ip');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../internals/webpack/webpack.dev.babel');

const compiler = webpack(webpackConfig);
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 9300;

function createWebpackMiddleware(compiler, publicPath) {
  return webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath,
    silent: true,
    stats: 'errors-only',
  });
}

app.use(createWebpackMiddleware(compiler, webpackConfig.output.publicPath));
app.use(webpackHotMiddleware(compiler));
app.use(express.static('public'));

const SSR_PROXY_URL = `${ip.address()}:${PORT + 1}`;
app.get('*', proxy(SSR_PROXY_URL));

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server started at ${PORT}`);
  }
});
