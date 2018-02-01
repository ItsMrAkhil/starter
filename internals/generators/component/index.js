const componentExists = require('../../utils/componentExists');

module.exports = {
  description: 'A component without redux connection',
  prompts: [{
    type: 'list',
    name: 'type',
    message: 'Choose one component type',
    default: 'Stateless',
    choices: () => ['Stateless', 'PureComponent', 'Component'],
  }, {
    type: 'input',
    name: 'name',
    message: 'Name of the component?',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'The component already exists' : true;
      }
      return 'Name is Required';
    },
  }, {
    type: 'confirm',
    name: 'loadable',
    default: false,
    message: 'Do you want to load component asynchronously?',
  }],

  actions: (data) => {
    let componentTemplate;
    switch (data.type) {
      case 'Stateless':
        componentTemplate = './component/stateless.js.hbs';
        break;
      default:
        componentTemplate = './component/class.js.hbs';
    }

    const actions = [{
      type: 'add',
      path: '../../client/components/{{ properCase name }}/index.js',
      templateFile: componentTemplate,
      abortOnFail: true,
    }];

    if (data.loadable) {
      actions.push({
        type: 'add',
        path: '../../client/components/{{ properCase name }}/Loadable.js',
        templateFile: './component/loadable.js.hbs',
        abortOnFail: true,
      });
    }
    return actions;
  },
};
