// Create a different store for ssr with axios instance
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

import reducers from './reducers';

export default () => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    // Include other headers if you want.
  };
  const axiosInstance = axios.create({
    // Change baseUrl for axios request from server side.
    baseURL: 'http://localhost:9300/api',
    headers,
  });

  const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk.withExtraArgument(axiosInstance)),
  );
  return store;
};
