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
        this.option('generateReadme');

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
            type: 'confirm',
            name: 'generateReadme',
            message: 'Is a project README required?',
            default: this.options.generateReadme
        }, {
            when: function (response) {
                return response.generateReadme;
            },
            type: 'input',
            name: 'projectDescription',
            message: 'What\'s does the project do?'
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
            when: function (response) {
                return response.generateReadme;
            },
            type: 'input',
            name: 'authorUrl',
            message: 'What\'s the author\'s website URL?'
        }, {
            when: function (response) {
                return response.generateReadme;
            },
            type: 'confirm',
            name: 'isGithubHosted',
            message: 'Is the project hosted on Github?',
            default: true
        }, {
            when: function (response) {
                return response.isGithubHosted;
            },
            type: 'input',
            name: 'githubAccount',
            message: 'What\'s the author\'s Github account?',
            default: this.githubAccount
        }];

        this.prompt(prompts, function (props) {

            this.projectName = props.projectName;
            this.projectDescription = props.projectDescription;
            this.authorName = props.authorName;
            this.authorEmail = props.authorEmail;
            this.isGithubHosted = props.isGithubHosted && !!props.githubAccount;
            this.githubAccount = props.githubAccount;
            this.options.installDependencies = !!this.options.installDependencies;
            this.options.generateReadme = props.generateReadme;

            done();
        }.bind(this));
    },

    configuring: function () {
    },

    default: function () {
        this.log('projectName: ' + this.projectName);
        this.log('projectDescription: ' + this.projectDescription);
        this.log('authorName: ' + this.authorName);
        this.log('authorEmail: ' + this.authorEmail);
        this.log('isGithubHosted: ' + this.isGithubHosted);

        if (this.isGithubHosted && !!this.githubAccount) {
            this.log('githubAccount: ' + this.githubAccount);
        }

        this.log('installDependencies: ' + this.options.installDependencies);
        this.log('generateReadme: ' + this.options.generateReadme);

        if (this.options.generateReadme) {
            var options = {};

            options.name = this.projectName;
            options.description = this.projectDescription;
            options.author = {
                name: this.authorName,
                email: this.authorEmail
            };

            if (!!this.authorUrl) {
                options.author.url = this.authorUrl;
            }

            if (this.isGithubHosted && !!this.githubAccount) {
                options.githubAccount = this.githubAccount;
            }
        }
    },

    writing: function () {
        try {
            this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), {
                project: {
                    name: this.projectName,
                    description: this.projectDescription
                },
                author: {
                    name: this.authorName,
                    email: this.authorEmail,
                    url: this.authorUrl
                }
            });
        } catch (e) {
            this.log(e);
        }
    },

    conflicts: function () {
    },

    install: function () {
    },

    end: function () {
    }

});
