import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

export default ({ match }) => {
  const { user } = match.params;
  return (
    <React.Fragment>
      <Helmet>
        <title>Perfect User {user}</title>
      </Helmet>
      <Link to="/"> Welcome {match.params.user}!</Link>
    </React.Fragment>
  );
};
