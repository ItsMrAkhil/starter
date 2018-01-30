// Not found component

import React from 'react';
import PropTypes from 'prop-types';

function NotFound({ staticContext = {} }) {
  // Add notFound true to staticContext
  // Note: staticContext object will be null in client side rendering.
  // staticContext is only available in server side rendering.
  // So we are initializing it to {}
  staticContext.notFound = true; // eslint-disable-line no-param-reassign
  return (<h1>Not Found Page</h1>);
}

NotFound.propTypes = {
  staticContext: PropTypes.object,
};

export default NotFound;
