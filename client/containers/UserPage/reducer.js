import { fromJS } from 'immutable';
import { FETCH_NAME_SUCCESS } from './constants';

const initialState = fromJS({
  name: '',
  length: 0,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NAME_SUCCESS:
      return state
        .set('length', action.payload.length)
        .set('name', action.payload.name);
    default:
      return state;
  }
}
