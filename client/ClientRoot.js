import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { hot } from 'react-hot-loader';

import routes from './routes';
import store from './configureStore';

function ClientRoot() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>
  );
}

let ExportableComponent = ClientRoot; // eslint-disable-line import/no-mutable-exports

if (process.env.NODE_ENV !== 'production') {
  ExportableComponent = hot(module)(ClientRoot);
}

export default ExportableComponent;
