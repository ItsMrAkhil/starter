import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchName } from './actions';
import { selectLength } from './selectors';

class UserPage extends React.Component {
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
        <Link to="/"> Welcome {user}! </Link> <span>Length : {this.props.length} </span>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFetchName: (name) => dispatch(fetchName(name)),
});

const mapStateToProps = createStructuredSelector({
  length: selectLength(),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
