import React from 'react';
import PropTypes from 'prop-types';

function NotFound({ staticContext = {} }) {
  staticContext.notFound = true; // eslint-disable-line no-param-reassign
  return (<h1>Not Found Page</h1>);
}

NotFound.propTypes = {
  staticContext: PropTypes.object,
};

export default NotFound;
