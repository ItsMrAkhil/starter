import { createSelector } from 'reselect';

const selectUserPage = (state) => state.userPage;

export const selectLength = () => createSelector(
  selectUserPage,
  (userPage) => userPage.get('length'),
);
