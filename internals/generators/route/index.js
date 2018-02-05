/**
 * Route generator
 */

const fs = require('fs');
const path = require('path');
const containerExist = require('../../utils/containerExists');

const loadableExists = (value) => {
  const filePath = path.resolve(process.cwd(), 'client', 'containers', value, 'Loadable.js');
  return fs.existsSync(filePath);
};

function trimTemplateFile(template) {
  return fs.readFileSync(path.join(__dirname, `./${template}`), 'utf8');
}

module.exports = {
  description: 'Add a route',
  prompts: [{
    type: 'input',
    name: 'container',
    message: 'Which container should the route show?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return containerExist(value) ? true : `"${value}" Container does not exists.`;
      }

      return 'Container is required.';
    },
  }, {
    type: 'input',
    name: 'path',
    message: 'What is the path of the route? (Do not use relative path.)',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return true;
      }

      return 'Container is required.';
    },
  }],

  actions: (data) => {
    const actions = [{
      type: 'modify',
      path: path.resolve(process.cwd(), 'client', 'routes.js'),
      pattern: /\{\s*(component: NotFound,\n\s*\},)/g,
      template: trimTemplateFile('route.hbs'),
    }];

    const routeImport = {
      type: 'modify',
      path: path.resolve(process.cwd(), 'client', 'routes.js'),
      pattern: /\nexport default \[/g,
    };

    if (loadableExists(data.container)) {
      routeImport.template = trimTemplateFile('routeImportLoadable.hbs');
    } else {
      routeImport.template = trimTemplateFile('routeImport.hbs');
    }

    actions.push(routeImport);

    return actions;
  },
};
