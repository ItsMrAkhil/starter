import { FETCH_NAME, FETCH_NAME_ERROR, FETCH_NAME_SUCCESS } from './constants';

export const fetchName = (name) => async (dispatch, getState, api) => {
  dispatch({ type: FETCH_NAME });
  try {
    const res = await api.get(`/${name}`);
    dispatch({
      type: FETCH_NAME_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({ type: FETCH_NAME_ERROR, payload: err.response.data });
  }
};
