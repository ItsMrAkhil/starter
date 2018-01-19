import React from 'react';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { matchRoutes, renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet'
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { minify } from 'html-minifier';

import stats from '../public/react-loadable.json';
import routes from './routes';

const app = express();
const PORT = (parseInt(process.env.PORT, 10) || 9300) + 1;

const ssrMiddleware = (req, res) => {
  const branch = matchRoutes(routes, req.path).map((match) => {
    return match;
  });
  const context = {};
  const modules = [];
  const content = ReactDOMServer.renderToString(
    <Loadable.Capture report={(moduleName) => modules.push(moduleName)}>
      <StaticRouter location={req.url} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Loadable.Capture>
  );
  const helmet = Helmet.renderStatic();
  const bundles = getBundles(stats, modules);
  const bundleScripts = bundles.map((bundle) => `<script src="${bundle.file}"></script>`).join('\n');
  const htmlContent = `
    <!doctype html>
    <html>
      <head>
        <base href="/" />
        <meta charset="UTF-8" />
        ${helmet.title.toString()}
      </head>
      <body>
        <div id="root">
        ${content}
        <script src="main.js"></script>
        ${bundleScripts}
        <script>window.main();</script></div>
      </body>
    </html>
  `;
  res.send(minify(htmlContent, {
    collapseWhitespace: true,
    trimCustomFragments: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    html5: true,
  }));
}

app.get('*', ssrMiddleware);

Loadable.preloadAll().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      console.log('Error while starting the SSR service');
    } else {
      console.log(`SSR service running on port ${PORT}`);
    }
  });
})
