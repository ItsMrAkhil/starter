// Root file for both client and server
import React from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import 'normalize.css';

export default class Root extends React.PureComponent {
  render() {
    return (
      <React.Fragment> {/** Use fragment which will not create an extra wrapper around the app. */}
        {renderRoutes(this.props.route.routes)} {/** Child routes won't render without this. */}
      </React.Fragment>
    );
  }
}

Root.propTypes = {
  route: PropTypes.object.isRequired,
};
