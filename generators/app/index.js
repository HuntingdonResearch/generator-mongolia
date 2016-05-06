'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.Base.extend({

    constructor: function () {
        yeoman.Base.apply(this, arguments);

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
    },

    default: function () {
        this.composeWith('node', {}, {
            local: require.resolve('generator-node/generators/readme')
        });
    },

    writing: function () {
        let self = this;

    },

    install: function () {
        if (!this.options['skip-install']) {
            this.installDependencies();
        }
    }
});
