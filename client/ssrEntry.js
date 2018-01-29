import React from 'react';
import express from 'express';
import { StaticRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { matchRoutes, renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { minify } from 'html-minifier';
import { Provider } from 'react-redux';

import HtmlDoc from './components/HtmlDoc';
import stats from '../public/react-loadable.json';
import routes from './routes';
import store from './ssrConfigureStore';

const app = express();
const PORT = (parseInt(process.env.PORT, 10) || 9300) + 1;

const ssrMiddleware = (req, res) => {
  const customStore = store(req);
  const loadBranchData = () => {
    const promises = [];
    matchRoutes(routes, req.path).forEach(({ route, match }) => {
      if (route.loadData) {
        promises.push(route.loadData(customStore, match.params));
      }
    });
    return promises.map((promise) => (
      new Promise((resolve) => {
        promise.then(resolve).catch(resolve);
      })
    ));
  };

  const render = () => {
    const context = {};
    const modules = [];
    const content = ReactDOMServer.renderToString(
      <Provider store={customStore} >
        <Loadable.Capture report={(moduleName) => modules.push(moduleName)}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Loadable.Capture>
      </Provider>);
    const helmet = Helmet.renderStatic();
    const bundles = getBundles(stats, modules);
    const bundleScripts = bundles.map((bundle) => `<script src="${bundle.file}"></script>`).join('\n');
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      <HtmlDoc
        helmet={helmet}
        content={content}
        assets={JSON.parse(req.headers.assets)}
        bundleScripts={bundleScripts}
        store={customStore}
      />
    );
    const minifiedHtmlContent = minify(htmlContent, {
      collapseWhitespace: true,
      trimCustomFragments: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      html5: true,
    });
    res.send(`<!doctype html>${minifiedHtmlContent}`);
  };

  Promise.all(loadBranchData()).then(render).catch(render);
};

app.get('*', ssrMiddleware);

Loadable.preloadAll().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      console.log('Error while starting the SSR service');
    } else {
      console.log(`SSR service running on port ${PORT}`);
    }
  });
});
