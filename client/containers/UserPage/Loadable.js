import React from 'react'
import Loadable from 'react-loadable';
import { fetchName } from './actions';

const component = Loadable({
  loader: () => import('../UserPage/index.js'),
  loading: () => <div>Loading...</div>,
});

const loadData = (store, params) => (
  Promise.all([
    store.dispatch(fetchName(params.user)),
  ])
);

export default {
  loadData,
  component,
};
