'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var gitConfig = require('git-config');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('projectName', {
      type: String,
      required: false
    });

    this.option('installDependencies');

  },

  initializing: {
    author: function () {
      var gc = gitConfig.sync();

      gc.user = gc.user || {};

      this.authorName = gc.user.name;
      this.authorEmail = gc.user.email;
    }
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What\'s the project\'s name?',
      default: this.projectName
    }, {
      type: 'input',
      name: 'authorName',
      message: 'What\'s the author\'s name?',
      default: this.authorName
    }, {
      type: 'input',
      name: 'authorEmail',
      message: 'What\'s the author\'s email?',
      default: this.authorEmail
    }, {
      type: 'confirm',
      name: 'isGithubHosted',
      message: 'Is the project hosted on Github?',
      default: true
    }, {
      when: function (response) {
        return response.isGithubHosted;
      },
      type: 'input',
      name: 'githubUsername',
      message: 'What\'s the author\'s Github username?',
      default: this.githubUsername
    }];

    this.prompt(prompts, function (props) {

      this.projectName = props.projectName;
      this.authorName = props.authorName;
      this.authorEmail = props.authorEmail;
      this.isGithubHosted = props.isGithubHosted && !!props.githubUsername;
      this.githubUsername = props.githubUsername;
      this.options.installDependencies = !!this.options.installDependencies;

      done();
    }.bind(this));
  },

  configuring: function () {
  },

  default: function () {
    this.log('projectName: ' + this.projectName);
    this.log('authorName: ' + this.authorName);
    this.log('authorEmail: ' + this.authorEmail);
    this.log('isGithubHosted: ' + this.isGithubHosted);

    if (this.isGithubHosted && !!this.githubUsername) {
      this.log('githubUsername: ' + this.githubUsername);
    }

    this.log("installDependencies: " + this.options.installDependencies);
  },

  writing: function () {
  },

  conflicts: function () {
  },

  install: function () {
  },

  end: function () {
  }

});
