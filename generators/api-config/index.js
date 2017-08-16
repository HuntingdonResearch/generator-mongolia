'use strict';

const _ = require('lodash');
const Generator = require('yeoman-generator');

const esprima = require('esprima');
const estemplate = require('estemplate');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

class MongoliaApiConfigGenerator extends  Generator {
  prompting() {
    const prompts = [{
      type: 'input',
      name: 'sectionName',
      message: 'What is the section name? Use / to create sub-sections.'
    }, {
      type: 'list',
      name: 'sectionType',
      message: 'What is the section type?',
      choices: [
        'String',
        'Number',
        'Boolean',
        'Array',
        'Object'
      ]
    }];

    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }

  writing() {
    let makeObjectContext = (sections) => {
      let objectContext = {};

      for(let i = sections.length - 1; i > 0; i--) {
        let newObjectContext = {};

        newObjectContext[sections[i]] = objectContext;

        objectContext = newObjectContext;
      }

      return objectContext;
    };

    let makeObjectSections = (a, n) => _.reverse(_.slice(_.reverse(a), n));

    let sections = this.props.sectionName.split('/');

    for(let i = 0; i < sections.length; i++) {
      let section = sections[i];

      let requireContext = {
        section: section
      };

      let objectContext = makeObjectContext(makeObjectSections(sections, i + 1));

      const requireFunc = _.template('let <%= section %> = require(\'./<%= section %>\');');
      const requireCode = requireFunc(requireContext);

      const objectFunc = _.template('<%= section %>: <%= section %>(<%= JSON.stringify(data) %>)');
      const objectCode = objectFunc(_.merge(requireContext, {
        data: objectContext
      }));

      this.log(requireCode);
      this.log(objectCode);
    }
  }
}

module.exports = MongoliaApiConfigGenerator;
