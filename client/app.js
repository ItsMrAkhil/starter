import 'babel-polyfill';
import React from 'react';
import Loadable from 'react-loadable';
import ReactDOM from 'react-dom';

import ClientRoot from './ClientRoot';

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
window.main = () => {
  Loadable.preloadReady().then(() => {
    renderMethod((
      <ClientRoot />
    ), document.getElementById('root'));
  });
}
