'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.processDirectory = function (source, destination, iteratee) {
      var self = this;
      var root = path.isAbsolute(source) ? source : path.join(self.sourceRoot(), source);
      var files = expandFiles('**', {dot: true, cwd: root});
      var dest, src;

      files.forEach(function (f) {
        var filteredFile = filterFile(f);
        if (self.basename) {
          filteredFile.name = filteredFile.name.replace('basename', self.basename);
        }
        if (self.name) {
          filteredFile.name = filteredFile.name.replace('name', self.name);
        }
        var name = filteredFile.name;
        var copy = false, stripped;

        src = path.join(root, f);
        dest = path.join(destination, name);

        dest = iteratee(dest);

        if (path.basename(dest).indexOf('_') === 0) {
          stripped = path.basename(dest).replace(/^_/, '');
          dest = path.join(path.dirname(dest), stripped);
        }

        if (path.basename(dest).indexOf('!') === 0) {
          stripped = path.basename(dest).replace(/^!/, '');
          dest = path.join(path.dirname(dest), stripped);
          copy = true;
        }

        if (templateIsUsable(self, filteredFile)) {
          if (copy) {
            self.fs.copy(src, dest);
          } else {
            self.filePath = dest;
            self.fs.copyTpl(src, dest, self);
            delete self.filePath;
          }
        }
      });
    };

    this.argument('name', {
      desc: 'Provide a name for the project',
      type: String,
      required: true
    });

    this.argument('nameSuffix', {
      desc: 'Allow a custom suffix to be added to the module name',
      type: String,
      defaults: 'API',
      required: false
    });

    this.option('skip-install', {
      desc: 'Do not install dependencies',
      type: Boolean,
      defaults: false
    });

    this.name = _.upperFirst(_.camelCase(this.name));
    this.nameSuffix = _.upperCase(this.nameSuffix);
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay('Welcome to the kickass ' + chalk.red('generator-mongolia') + ' generator!'));

    var prompts = [{
      type: 'list',
      name: 'stackName',
      message: 'Which stack would you like to use to create your REST API project?',
      choices: ['json-api', 'Restify', 'Express'],
      filter: val => {
        return {
          'json-api': 'json-api',
          'Restify': 'restify',
          'Express': 'express'
        }[val];
      }
    }, {
      type: 'confirm',
      name: 'shouldAddAuth',
      message: 'Would you like to add authentication?',
      // when: answers => answers.odms && answers.odms.length !== 0
    }];

    this.prompt(prompts, function (props) {
      this.props = props;

      done();
    }.bind(this));
  }

  ,

  writing: function () {
    let self = this;

    this.sourceRoot(path.join(__dirname, './templates'));
    this
    this.processDirectory('.', '.', function (dest) {
      return dest;
    });
  }
  ,

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
});
