import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { fetchName } from './actions';

class UserPage extends React.Component {

  componentDidMount() {
    this.props.onFetchName('AKhil');
  }

  render() {
    const { user } = this.props.match.params;
    return (
      <React.Fragment>
        <Helmet>
          <title>Perfect User {user}</title>
        </Helmet>
        <Link to="/"> Welcome {user}!</Link>
      </React.Fragment>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onFetchName: (name) => dispatch(fetchName(name)),
});

export default connect(null, mapDispatchToProps)(UserPage);
