/* eslint-disable no-console */

const chalk = require('chalk');

module.exports = {
  success: (message) => console.log(chalk.green(message)),
  error: (message) => console.log(chalk.red(message)),
  warning: (message) => console.log(chalk.yellow(message)),
  info: (message) => console.log(chalk.blue(message)),
};
