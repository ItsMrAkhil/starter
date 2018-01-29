import express from 'express';
import Loadable from 'react-loadable';
import ssrMiddleware from './ssrMiddleware';
import { success, error } from '../server/logger';
const app = express();
const PORT = (parseInt(process.env.PORT, 10) || 9300) + 1;

app.get('*', ssrMiddleware);

Loadable.preloadAll().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      error('Error while starting the SSR service');
    } else {
      success(`SSR service running on port ${PORT}`);
    }
  });
});
