/*! local_storage.test.js */

var assert = require('chai').assert;
var fs = require('fs');
var KagoDB = require('../index');
var crud_tests = require('./lib/crud_tests');

describe('Local Storage (emulation)', function() {

  describe('CRUD without namespace', function() {
    var opts = {
      storage: 'local_storage',
      local_storage: []
    };
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts);
    });
    crud_tests(kit);
  });

  describe('CRUD with namespace', function() {
    var opts = {
      storage: 'local_storage',
      namespace: 'test',
      local_storage: []
    };
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts);
    });
    crud_tests(kit);
  });
});
