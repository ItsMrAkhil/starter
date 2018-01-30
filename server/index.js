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
  // Use webpack dev and hot middleware in dev mode for HMR and Hot Reloading
  app.use(createWebpackMiddleware(compiler, webpackConfig.output.publicPath));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static('public'));
app.use(express.static('build'));

// Create proxy url based on the process.env.PORT
const SSR_PROXY_URL = `${ip.address()}:${PORT + 1}`;
// const ROOT_URL = 'http://localhost:9301';

app.post('/login', (req, res) => {
  // Create a random device_id for every new device
  const device_id = crypto.randomBytes(6).toString('hex');

  // Add the device_id and and other details to the body.
  const body = Object.assign(req.body, { device_id, client_name: 'WebBrowser', client_version: 'WebBrowser' });

  // Hit the login API of the main portal
  axios.post('https://api.zaggle.in/api/v1/auth/basic', body).then((response) => {

    // Attach cookies to the res object
    res.cookie('token', response.data.token, { maxAge: 900000, httpOnly: true });
    res.cookie('device_id', device_id, { maxAge: 900000, httpOnly: true });

    // Send data with the cookies
    res.json(response.data);
  }).catch((error) => {
    res.json(error.response.data || { success: false });
  });
});

app.use('/api/:name', (req, res) => {
  res.json({ name: req.params.name, length: req.params.name.length });
});

// Create proxy for api hits
app.use('/api', proxy('https://api.zaggle.in/', {
  proxyReqPathResolver: (req) => `/api/v1${URL.parse(req.url).path}`,
}));

app.use((req, res, next) => {
  if (req.cookies) {
    // Get cookies from the client and attach them to create a Authorization header
    req.headers.Authorization = `Token token=${req.cookies.token};client_key=client_key;device_id=${req.cookies.device_id}`;
  }
  let assets = '{main:[]}';
  if (isDev) {
    // Use locals object to get webpackStats in dev
    assets = res.locals.webpackStats ? res.locals.webpackStats.toJson().assetsByChunkName : { main: [] };
  } else {
    // Use stats.json to get webpackStats in prod
    const webpackStats = path.resolve(process.cwd(), 'build', 'stats.json');
    if (fs.existsSync(webpackStats)) {
      const stats = require('../build/stats.json'); // eslint-disable-line global-require
      assets = stats.assetsByChunkName;
    }
  }
  // Send webpack status files to the proxy server to include js and css files in the first html.
  req.headers.assets = JSON.stringify(assets);
  next();
});

if (isDev) {
  // Use proxy server in dev mode for ssr
  app.get('*', proxy(SSR_PROXY_URL));
} else {
  const pathToSsrMiddleware = path.resolve(process.cwd(), 'server', 'middleware', 'generated.ssrMiddleware.js');
  if (fs.existsSync(pathToSsrMiddleware)) {
    const ssrMiddleware = require(pathToSsrMiddleware).default; // eslint-disable-line global-require
    // Use generated ssrMiddleware in prod mode
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
