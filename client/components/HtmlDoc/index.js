import React from 'react';
import PropTypes from 'prop-types';

export default function HtmlDoc({ helmet, htmlContent, bundleScripts }) {
  return (
    <html lang="en">
      <head>
        <base href="/" />
        <meta charSet="UTF-8" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={htmlContent} />
        {bundleScripts}
      </body>
    </html>
  );
}

HtmlDoc.propTypes = {
  helmet: PropTypes.object.isRequired,
  htmlContent: PropTypes.string.isRequired,
  bundleScripts: PropTypes.string.isRequired,
};
