/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import { uniqueId } from 'lodash';


const normalizeAssets = (assets) => (
  Array.isArray(assets) ? assets : [assets]
);

export default function HtmlDoc({
  helmet, content, bundleScripts, store, assets,
}) {
  return (
    <html lang="en">
      <head>
        <base href="/" />
        <meta charSet="UTF-8" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {
          normalizeAssets(assets.main)
            .filter((file) => file.endsWith('.css'))
            .map((file) => <link key={uniqueId()} rel="stylesheet" href={file} />)
        }
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        {
          normalizeAssets(assets.main)
            .filter((file) => file.endsWith('.js'))
            .map((file) => <script key={uniqueId()} src={file} />)
        }
        <div
          dangerouslySetInnerHTML={{
            __html: `
            <script>
              window.main();
              window.__INITIAL_STATE__=${serialize(store.getState())}
            </script>
            ${bundleScripts}
            `,
          }}
        />
      </body>
    </html>
  );
}

HtmlDoc.propTypes = {
  helmet: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  bundleScripts: PropTypes.string.isRequired,
  store: PropTypes.object.isRequired,
  assets: PropTypes.object.isRequired,
};
