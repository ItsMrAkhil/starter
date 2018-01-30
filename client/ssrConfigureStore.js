// Create a different store for ssr with axios instance
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

import reducers from './reducers';

export default (req) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (req.cookies) {
    // Extract cookies from req object to create Authorization header for ssr
    headers.Authorization = `Token token=${req.cookies.token};client_key=client_key;device_id=${req.cookies.device_id}`;
  }
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
