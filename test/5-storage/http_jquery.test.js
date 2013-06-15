/*! http_jquery.test.js */

var KagoDB = require('../../index');
var crud_tests = require('../testlib/crud_tests');
var http_tests = require('../testlib/http_tests');

describe('HTTP Storage: (jQuery)', function() {
  var endpoint = process.env.TEST_ENDPOINT;

  describe('$TEST_ENDPOINT', function() {
    var name = endpoint || 'e.g. TEST_ENDPOINT=http://localhost:3000/memory/ grunt';
    it(name, function(done) {
      done();
    });
  });

  if (!endpoint) return;

  var opts = {
    storage: 'ajax',
    ajax: 'jquery',
    endpoint: endpoint
  };

  describe('CRUD', function() {
    var MyKago = KagoDB.inherit(opts);
    crud_tests(MyKago);
  });

  describe('Request', function() {
    var MyKago = KagoDB.inherit(opts);
    http_tests(MyKago);
  });
});
