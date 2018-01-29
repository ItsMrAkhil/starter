import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import image from '../../assets/images/photo.jpg';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Akhil',
    };
    this.handleUserChange = this.handleUserChange.bind(this);
  }

  handleUserChange(evt) {
    this.setState({
      user: evt.target.value,
    });
  }

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
        <strong>Type username and change user</strong> <br /><br />
        <input value={this.state.user} onChange={this.handleUserChange} placeholder="user" /> <br /><br />
        <Link to={`/${this.state.user}`}>Link to user the page</Link>
      </div>
    );
  }
}
