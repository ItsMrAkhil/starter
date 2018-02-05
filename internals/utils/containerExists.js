/**
 * Container exists util for generators
 */

const fs = require('fs');
const path = require('path');

module.exports = (value) => {
  const filePath = path.resolve(process.cwd(), 'client', 'containers', value);
  return fs.existsSync(filePath);
};
