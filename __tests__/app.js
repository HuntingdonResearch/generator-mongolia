'use strict';

let path = require('path');
let assert = require('yeoman-assert');
let helpers = require('yeoman-test');

describe('generator-mongolia:app', () => {
  beforeAll(() => {
  });

  it('creates files', () => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        generateDummyFile: true,
        installDependencies: true
      }).then(() => {
        assert.file([
          'dummyfile.txt'
        ]);
      });
  });

  it('does not create files', () => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        generateDummyFile: false,
        installDependencies: true
      }).then(() => {
        assert.noFile([
          'dummyfile.txt'
        ]);
      });
  });
});
