'use strict';

const _ = require('lodash');
const Generator = require('yeoman-generator');

const test = (fileName) => {
  let readFile = () => require('fs').readFileSync(fileName, 'utf-8');
  let parseModule = require('esprima').parseModule;
  let parseScript = require('esprima').parseScript;
  let parseQuery = require('esquery').parse;
  let matchQuery = require('esquery').match;
  let generateCode = require('escodegen').generate;
  let formatTree = (sourceTree) => JSON.stringify(sourceTree, undefined, "  ");
  let printLog = (message) => console.log(message);

  let makeLiteral = (value) => {
    return {
      type: 'Literal',
      value: value
    };
  };

  let sourceCode = readFile();
  let sourceTree = parseModule(sourceCode);
  let sourceQuery = parseQuery('[id.name="config"]');
  let sourceMatches = matchQuery(sourceTree, sourceQuery);

  if (sourceMatches.length !== 1) {
    printLog("Too few or too many config declarations found");

    return;
  }

  let sourceMatch = sourceMatches[0];

  let initObjectExpression = sourceMatch['init'];
  let initObjectProperties = initObjectExpression['properties'];

  for (let i = 0; i < initObjectProperties.length; i++) {
    let initObjectProperty = initObjectProperties[i];

    let sectionName = initObjectProperty['key']['name'];
    let sectionValue = initObjectProperty['value'];
    let sectionInitializer;

    switch(sectionValue.type) {
      case 'CallExpression':
      {
        sectionInitializer = initObjectProperty['value']['arguments'];

        if (sectionInitializer.length === 1) {
          sectionInitializer = sectionInitializer[0];
        } else if (sectionInitializer.length === 0) {
          sectionInitializer = undefined;
        } else {
          printLog('Too few or too many section initializers for ' + sectionName);
        }
      }
        break;
    }

    if (!_.isNil(sectionInitializer)) {
      printLog(generateCode(sectionInitializer));
    }

    printLog(generateCode(sectionValue));

    // printLog(sectionInitializer ? escodegen.generate(sectionInitializer) : "");
  }
};

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
