import React from 'react'
import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('../UserPage/index.js'),
  loading: () => <div>Loading...</div>,
});
