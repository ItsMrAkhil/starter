const containerExists = require('../../utils/containerExists');

module.exports = {
  description: 'A container with redux connection',
  prompts: [{
    type: 'list',
    name: 'type',
    message: 'Choose one component type',
    default: 'Stateless',
    choices: () => ['PureComponent', 'Component'],
  }, {
    type: 'input',
    name: 'name',
    message: 'Name of the component?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return containerExists(value) ? 'The component already exists' : true;
      }
      return 'Name is Required';
    },
  }, {
    type: 'confirm',
    name: 'loadable',
    default: true,
    message: 'Do you want to load component asynchronously?',
  }, {
    type: 'confirm',
    name: 'loadData',
    default: true,
    message: 'Do you want some data to load on Server Side?',
  }],

  actions: (data) => {
    const actions = [{
      type: 'add',
      path: '../../client/containers/{{ properCase name }}/index.js',
      templateFile: './container/index.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../client/containers/{{ properCase name }}/selectors.js',
      templateFile: './container/selectors.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../client/containers/{{ properCase name }}/reducer.js',
      templateFile: './container/reducer.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../client/containers/{{ properCase name }}/actions.js',
      templateFile: './container/actions.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../client/containers/{{ properCase name }}/constants.js',
      templateFile: './container/constants.js.hbs',
      abortOnFail: true,
    }];

    if (data.loadable) {
      actions.push({
        type: 'add',
        path: '../../client/containers/{{ properCase name }}/Loadable.js',
        templateFile: './container/Loadable.js.hbs',
        abortOnFail: true,
      });
    }
    return actions;
  },
};
