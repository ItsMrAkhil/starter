import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

import reducers from './reducers';

export default (req) => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      cookie: req.get('cookie') || '',
    },
  });

  const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk.withExtraArgument(axiosInstance)),
  );
  return store;
};
