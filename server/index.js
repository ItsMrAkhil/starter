require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const ip = require('ip');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const morgan = require('morgan');
const URL = require('url');

const webpackConfig = require('../internals/webpack/webpack.dev.babel');

const compiler = webpack(webpackConfig);
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 9300;

function createWebpackMiddleware(complr, publicPath) {
  return webpackDevMiddleware(complr, {
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
// const ROOT_URL = 'http://localhost:9301';

app.use('/api', proxy('localhost:3001', {
  proxyReqPathResolver: (req) => URL.parse(req.url).path,
}));

app.get('*', proxy(SSR_PROXY_URL));

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server started at ${PORT}`);
  }
});

const dummyApp = express();

dummyApp.use(morgan('dev'));

dummyApp.get('/:name', (req, res) => {
  const { name } = req.params;
  res.json({ name, length: name.length });
});

dummyApp.listen(3001);
