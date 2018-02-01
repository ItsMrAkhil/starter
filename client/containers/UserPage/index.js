import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import { fetchName } from './actions';
import { selectLength } from './selectors';
import './styles.css';

export class UserPage extends React.Component {
  componentDidMount() {
    this.props.onFetchName(this.props.match.params.user);
  }

  render() {
    const { user } = this.props.match.params;
    return (
      <React.Fragment>
        <Helmet>
          <title>Perfect User {user}</title>
        </Helmet>
        <h2>Welcome {user}</h2>
        <code>Below Name Length Comes from server</code><br /><br />
        <span>Length : {this.props.length} </span> <br /><br />
        <Link to="/"><button> Back to Home</button></Link>
      </React.Fragment>
    );
  }
}

UserPage.propTypes = {
  onFetchName: PropTypes.func.isRequired,
  length: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onFetchName: (name) => dispatch(fetchName(name)),
});

const mapStateToProps = createStructuredSelector({
  length: selectLength(),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
