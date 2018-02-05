import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { StaticRouter } from 'react-router-dom';

import { UserPage } from '../index';

describe('<UserPage />', () => {
  test('renders', () => {
    const mockData = {
      match: {
        params: { user: 'Akhil' },
      },
      length: 5,
      onFetchName: () => ({}),
    };

    const tree = ReactTestRenderer.create(
      <StaticRouter context={{}} >
        <UserPage {...mockData} />
      </StaticRouter>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
