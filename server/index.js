require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const ip = require('ip');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const morgan = require('morgan');
const URL = require('url');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const crypto = require('crypto');

const webpackConfig = require('../internals/webpack/webpack.dev.babel');

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

app.use(createWebpackMiddleware(compiler, webpackConfig.output.publicPath));
app.use(webpackHotMiddleware(compiler));
app.use(express.static('public'));

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

app.use((req, res, next) => {
  if (req.cookies) {
    req.headers.Authorization = `Token token=${req.cookies.token};client_key=client_key;device_id=${req.cookies.device_id}`;
  }
  const assets = res.locals.webpackStats ? res.locals.webpackStats.toJson().assetsByChunkName : { main: [] };
  req.headers.assets = JSON.stringify(assets);
  next();
});

app.use('/api', proxy('https://api.zaggle.in/', {
  proxyReqPathResolver: (req) => `/api/v1${URL.parse(req.url).path}`,
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

dummyApp.use(bodyParser.urlencoded({ extended: false }));
dummyApp.use(bodyParser.json());
dummyApp.use(morgan('dev'));

const users = [
  {
    uid: '#1462#',
    user: 'akhil',
    pwd: 'password1',
  },
  {
    uid: '#2593#',
    user: 'nandini',
    pwd: 'password2',
  },
];

dummyApp.post('/login', (req, res) => {
  const foundUser = _.find(users, req.body);
  if (foundUser) {
    return res.json({ success: true, token: foundUser.uid });
  }
  return res.json({ success: false });
});

dummyApp.post('/is-token', (req, res) => {
  let success = false;
  const foundUser = _.find(users, { uid: req.body.token });
  if (foundUser) {
    success = true;
  }
  res.send({ success });
});

dummyApp.get('/:name', (req, res) => {
  const { name } = req.params;
  res.json({ name, length: name.length });
});

dummyApp.listen(3001);
