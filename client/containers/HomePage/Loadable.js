import React from 'react'
import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('../HomePage/index.js'),
  loading: () => null,
});
