import React from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';

export default class Root extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        {renderRoutes(this.props.route.routes)} {/** Child routes won't render without this. */}
      </React.Fragment>
    );
  }
}

Root.propTypes = {
  route: PropTypes.object.isRequired,
};
