/*! http_jquery.test.js */

var assert = require('chai').assert;
var KagoDB = require('../bundle/browser');
var jQuery = require('jquery');
var crud_tests = require('./lib/crud_tests');

describe('Proxy jQuery', function() {
  var endpoint = process.env.TEST_ENDPOINT;

  describe('$TEST_ENDPOINT', function() {
    var name = endpoint || 'e.g. TEST_ENDPOINT=http://localhost:3000/memory/ grunt';
    it(name, function(done) {
      done();
    });
  });

  if (!endpoint) return;

  var opts = {
    storage: 'http_jquery',
    endpoint: endpoint,
    jquery: jQuery
  };

  describe('CRUD', function() {
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts);
    });
    crud_tests(kit);
  });
});