'use strict';

const _ = require('lodash');
const Generator = require('yeoman-generator');
// const chalk = require('chalk');
// const yosay = require('yosay');
const esprima = require('esprima');
const escodegen = require('escodegen');
const estraverse = require('estraverse');

class MongoliaGenerator extends Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      default: _.kebabCase(this.appname)
    }, {
      type: 'input',
      name: 'projectVersion',
      message: 'What is the version number of your project?',
      default: '0.0.0'
    }, {
      type: 'input',
      name: 'projectBasePort',
      message: 'What is the base port of your project?',
      default: 3000
    }];

    return this.prompt(prompts).then(props => {
      this.props = props;
      this.props.projectName = _.kebabCase(this.props.projectName);
      this.props.projectTitle = _.upperFirst(_.camelCase(this.props.projectName));
      this.props.projectBasePort = _.parseInt(this.props.projectBasePort);
    });
  }

  writing() {
    let generateApiFiles = (generator) => {
      generator.fs.copyTpl(generator.templatePath('api/_index.js'), generator.destinationPath('api/index.js'), {
        projectName: generator.props.projectName,
        projectVersion: generator.props.projectVersion
      });
      generator.fs.copyTpl(generator.templatePath('api/_package.json'), generator.destinationPath('api/package.json'), {
        projectName: generator.props.projectName,
        projectVersion: generator.props.projectVersion
      });
    };

    let generateApiConfig = (generator) => {
      let modifySourceTree = (sourceTree) => {
        return sourceTree;
      };

      let targetFile = generator.destinationPath('api-config/index.js');
      let sourceFile = generator.fs.exists(targetFile) ? targetFile : generator.templatePath('api-config/_index.js');
      let sourceCode = generator.fs.read(sourceFile);

      let fillSourceCode = _.template(sourceCode);

      sourceCode = fillSourceCode({
        projectTitle: this.props.projectTitle,
        projectBasePort: this.props.projectBasePort
      });

      let sourceTree = esprima.parseModule(sourceCode, {});

      sourceTree = modifySourceTree(sourceTree);
      sourceCode = escodegen.generate(sourceTree);

      generator.fs.write(targetFile, sourceCode);
    };

    generateApiFiles(this);
    generateApiConfig(this);
  }
}

module.exports = MongoliaGenerator;
