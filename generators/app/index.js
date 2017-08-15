'use strict';

const Generator = require('yeoman-generator');
// const chalk = require('chalk');
// const yosay = require('yosay');

class MongoliaGenerator extends Generator {
  prompting() {
    const prompts = [{
      type: 'confirm',
      name: 'generateDummyFile',
      message: 'Would you like to generator the dummy file?',
      default: false
    }, {
      type: 'confirm',
      name: 'installDependencies',
      message: 'Would you like to install dependencies?',
      default: false
    }];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    if (this.props.generateDummyFile) {
      this.fs.copyTpl(this.templatePath('dummyfile.txt'), this.destinationPath('dummyfile.txt'), {
        names: [
        ]
      });
    }
  }

  install() {
    if (this.props.installDependencies) {
      this.installDependencies();
    }
  }
}

module.exports = MongoliaGenerator;
