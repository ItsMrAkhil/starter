import Root from './containers/Root';
import NotFound from './components/NotFound';
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
        ...UserComponent,
        exact: true,
      },
      {
        component: NotFound,
      },
    ],
  },
];
