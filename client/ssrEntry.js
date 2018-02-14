// Proxy ssr server to work in dev mode.
import express from 'express';
import Loadable from 'react-loadable';
import morgan from 'morgan';
import ssrMiddleware from './ssrMiddleware';
import { success, error } from '../server/logger';
const app = express();
// Run ssr proxy server in port process.env.PORT+1
const PORT = (parseInt(process.env.PORT, 10) || 9300) + 1;

app.use(morgan('dev'));
app.get('*', ssrMiddleware);

// Load all loadable components before rendering in SSR
Loadable.preloadAll().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      error('Error while starting the SSR service');
    } else {
      success(`SSR service running on port ${PORT}`);
    }
  });
});
