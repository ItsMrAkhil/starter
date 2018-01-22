import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet>
          <title> This is not home page </title>
        </Helmet>
        <h1>
          Home Page Component!
        </h1>
        <Link to="/Akhil">Link to user the page</Link>
      </div>
    );
  }
}
