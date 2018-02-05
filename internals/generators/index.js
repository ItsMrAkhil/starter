/**
 * Generators for better and fast development
 */
const componentGenerator = require('./component/');
const containerGenerator = require('./container/');
const routeGenerator = require('./route/');

module.exports = (plop) => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('container', containerGenerator);
  plop.setGenerator('route', routeGenerator);
};
