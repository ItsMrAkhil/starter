// Middleware for rendering pre-html stuff inside server (SSR Middleware)
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { matchRoutes, renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { minify } from 'html-minifier';
import { Provider } from 'react-redux';

import HtmlDoc from './components/HtmlDoc';
import stats from '../build/react-loadable.json';
import routes from './routes';
import store from './ssrConfigureStore';

const ssrMiddleware = (req, res) => {
  const customStore = store(req);
  const loadBranchData = () => {
    const promises = [];
    // Extract all promises to execute before rendering the app
    matchRoutes(routes, req.path).forEach(({ route, match }) => {
      if (route.loadData) {
        promises.push(route.loadData(customStore, match.params));
      }
    });

    // Return promises of promises array to escape the failed condition
    // If a promise failed other promises will also failed.
    // So, we are wrapping every promise inside a promise.
    // Whenever inner promise failed, we can still resolve outer promise
    // And we can proceed further for the other promises.
    // Note: If it fails we cannot render the actual html which should be rendered from react
    return promises.map((promise) => (
      new Promise((resolve) => {
        promise.then(resolve).catch(resolve);
      })
    ));
  };

  const render = () => {
    // Context for getting statuses from the client app like 404.
    const context = {};
    const modules = [];
    const content = ReactDOMServer.renderToString(
      <Provider store={customStore} >
        <Loadable.Capture report={(moduleName) => modules.push(moduleName)}>
          {/** Get all loadable chunk files list for particular route */}
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Loadable.Capture>
      </Provider>);
    if (context.notFound) {
      // If the context is having the notFound tag true then send 404 status.
      res.status(404);
    }

    // Get all helmet stuff like title, meta tags
    const helmet = Helmet.renderStatic();
    const bundles = getBundles(stats, modules);

    // Create bundle scripts fro loadable-components
    const bundleScripts = bundles.map((bundle) => `<script src="${bundle.file}"></script>`).join('\n');

    // Send required stuff to HtmlDoc Component and render it to get final doc.
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      <HtmlDoc
        helmet={helmet}
        content={content}
        assets={JSON.parse(req.headers.assets || '{"main":["main.js","styles.css"]}')}
        bundleScripts={bundleScripts}
        store={customStore}
      />
    );

    // Minify the generated html content
    const minifiedHtmlContent = minify(htmlContent, {
      collapseWhitespace: true,
      trimCustomFragments: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      html5: true,
    });

    // Send the minified content to user
    res.send(`<!doctype html>${minifiedHtmlContent}`);
  };

  // Resolve all promises before calling the render method.
  // Call render method even some promises rejected.
  Promise.all(loadBranchData()).then(render).catch(render);
};

export default ssrMiddleware;
