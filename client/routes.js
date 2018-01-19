import React from 'react';
import Root from './containers/Root';
import HomeComponent from './containers/HomePage/Loadable';
import UserComponent from './containers/UserPage/Loadable';

export default [
  {
    component: Root,
    routes: [
      {
        path: '/',
        component: HomeComponent,
        exact: true,
      },
      {
        path: '/:user',
        component: UserComponent,
        exact: true,
      },
      {
        component: ({ staticContext = {} }) => {
          staticContext.notFound = true;
          return (<h1>Not Found Page</h1>);
        }
      }
    ]
  },
]
