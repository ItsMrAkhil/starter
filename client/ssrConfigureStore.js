import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

import reducers from './reducers';

export default (req) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (req.cookies) {
    headers.Authorization = `Token token=${req.cookies.token};client_key=client_key;device_id=${req.cookies.device_id}`;
  }
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:9302/api',
    headers,
  });

  const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk.withExtraArgument(axiosInstance)),
  );
  return store;
};
