/*! http_jquery.test.js */

var KagoDB = require('../index');
var crud_tests = require('./lib/crud_tests');
var http_tests = require('./lib/http_tests');

describe('HTTP tests via request', function() {
  var endpoint = process.env.TEST_ENDPOINT;

  describe('$TEST_ENDPOINT', function() {
    var name = endpoint || 'e.g. TEST_ENDPOINT=http://localhost:3000/memory/ grunt';
    it(name, function(done) {
      done();
    });
  });

  if (!endpoint) return;

  var opts = {
    storage: 'http_request',
    endpoint: endpoint
  };

  describe('CRUD', function() {
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts);
    });
    crud_tests(kit);
  });

  describe('Events', function() {
    var kit = {};
    kit.collection = new KagoDB(opts);
    http_tests(kit);
  });
});