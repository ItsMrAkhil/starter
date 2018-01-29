import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import image from '../../assets/images/photo.jpg';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet>
          <title> This is the home page </title>
        </Helmet>
        <h1>
          Home Page Component!
        </h1>
        <img src={image} alt="" height="300" />
        <br />
        <br />
        <Link to="/any-user">Link to user the page</Link>
      </div>
    );
  }
}
