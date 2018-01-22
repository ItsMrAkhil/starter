import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import reducers from './reducers';

const axiosInstance = axios.create({
  baseURL: '/api',
});

const isBrowser = typeof window === 'object';

const composeEnhancers =
  isBrowser && process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk.withExtraArgument(axiosInstance)),
);

const store = createStore(
  reducers,
  window.__INITIAL_STATE__ || {},
  enhancer,
);

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
