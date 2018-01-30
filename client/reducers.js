// Add all your reducers here for combining into one reducer

import { combineReducers } from 'redux';
import userPage from './containers/UserPage/reducer';

export default combineReducers({
  userPage,
});
