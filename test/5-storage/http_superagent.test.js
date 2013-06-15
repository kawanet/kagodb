/*! http_superagent.test.js */

var KagoDB = require('../../index');
var crud_tests = require('../testlib/crud_tests');
var http_tests = require('../testlib/http_tests');

describe('HTTP Storage: (superagent)', function() {
  var endpoint = process.env.TEST_ENDPOINT;

  describe('$TEST_ENDPOINT', function() {
    var name = endpoint || 'e.g. TEST_ENDPOINT=http://localhost:3000/memory/ grunt';
    it(name, function(done) {
      done();
    });
  });

  if (!endpoint) return;

  var opts = {
    storage: 'http_superagent',
    endpoint: endpoint
  };

  describe('CRUD', function() {
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts);
    });
    crud_tests(kit);
  });

  describe('Request', function() {
    var kit = {};
    kit.collection = new KagoDB(opts);
    http_tests(kit);
  });
});
