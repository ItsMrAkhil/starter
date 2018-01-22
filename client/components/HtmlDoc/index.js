import React from 'react';
import PropTypes from 'prop-types';

export default function HtmlDoc({ helmet, htmlContent }) {
  return (
    <html lang="en">
      <head>
        ${helmet.title.toComponent()}
        ${helmet.meta.toComponent()}
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={htmlContent} />
      </body>
    </html>
  );
}

HtmlDoc.propTypes = {
  helmet: PropTypes.object.isRequired,
  htmlContent: PropTypes.string.isRequired,
};
