'use strict';

const Generator = require('yeoman-generator');
// const chalk = require('chalk');
// const yosay = require('yosay');

class MongoliaGenerator extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      required: true
    }, {
      type: 'input',
      name: 'projectVersion',
      message: 'What is the version number of your project?',
      default: '0.0.0'
    }];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(this.templatePath('api/_index.js'), this.destinationPath('api/index.js'), {
      projectName: this.props.projectName,
      projectVersion: this.props.projectVersion
    });
    this.fs.copyTpl(this.templatePath('api/_package.json'), this.destinationPath('api/package.json'), {
      projectName: this.props.projectName,
      projectVersion: this.props.projectVersion
    });
  }

  install() {
  }
}

module.exports = MongoliaGenerator;
