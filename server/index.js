require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const ip = require('ip');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const URL = require('url');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const logger = require('./logger');
const webpackConfig = require('../internals/webpack/webpack.dev.client');

const isDev = process.env.NODE_ENV !== 'production';

const compiler = webpack(webpackConfig);
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = parseInt(process.env.PORT, 10) || 9300;

function createWebpackMiddleware(complr, publicPath) {
  return webpackDevMiddleware(complr, {
    noInfo: true,
    publicPath,
    silent: true,
    stats: 'errors-only',
    serverSideRender: true,
  });
}

if (isDev) {
  app.use(createWebpackMiddleware(compiler, webpackConfig.output.publicPath));
  app.use(webpackHotMiddleware(compiler));
}
app.use(express.static('public'));
app.use(express.static('build'));

const SSR_PROXY_URL = `${ip.address()}:${PORT + 1}`;
// const ROOT_URL = 'http://localhost:9301';

app.post('/login', (req, res) => {
  const device_id = crypto.randomBytes(6).toString('hex');
  const body = Object.assign(req.body, { device_id, client_name: 'WebBrowser', client_version: 'WebBrowser' });
  axios.post('https://api.zaggle.in/api/v1/auth/basic', body).then((response) => {
    res.cookie('token', response.data.token, { maxAge: 900000, httpOnly: true });
    res.cookie('device_id', device_id, { maxAge: 900000, httpOnly: true });
    res.json(response.data);
  }).catch((error) => {
    res.json(error.response.data || { success: false });
  });
});

app.use('/api/:name', (req, res) => {
  res.json({ name: req.params.name, length: req.params.name.length });
});

app.use('/api', proxy('https://api.zaggle.in/', {
  proxyReqPathResolver: (req) => `/api/v1${URL.parse(req.url).path}`,
}));

app.use((req, res, next) => {
  if (req.cookies) {
    req.headers.Authorization = `Token token=${req.cookies.token};client_key=client_key;device_id=${req.cookies.device_id}`;
  }
  let assets = '{main:[]}';
  if (isDev) {
    assets = res.locals.webpackStats ? res.locals.webpackStats.toJson().assetsByChunkName : { main: [] };
  } else {
    const webpackStats = path.resolve(process.cwd(), 'build', 'stats.json');
    if (fs.existsSync(webpackStats)) {
      const stats = require('../build/stats.json'); // eslint-disable-line global-require
      assets = stats.assetsByChunkName;
    }
  }
  req.headers.assets = JSON.stringify(assets);
  next();
});

if (isDev) {
  app.get('*', proxy(SSR_PROXY_URL));
} else {
  const pathToSsrMiddleware = path.resolve(process.cwd(), 'server', 'middleware', 'generated.ssrMiddleware.js');
  if (fs.existsSync(pathToSsrMiddleware)) {
    const ssrMiddleware = require(pathToSsrMiddleware).default; // eslint-disable-line global-require
    app.get('*', ssrMiddleware);
  }
}

app.listen(PORT, (err) => {
  if (err) {
    logger.error(err);
  } else {
    logger.success(`Server started at ${PORT}`);
  }
});
