/*! ajax_request.test.js */

var KagoDB = require('../../index');
var crud_tests = require('../testlib/crud_tests');
var http_tests = require('../testlib/http_tests');

describe('Ajax Storage via request:', function() {
  var endpoint = process.env.TEST_ENDPOINT;

  describe('$TEST_ENDPOINT', function() {
    var name = endpoint || 'e.g. TEST_ENDPOINT=http://localhost:3000/memory/ grunt';
    it(name, function(done) {
      done();
    });
  });

  if (!endpoint) return;

  var opts1 = {
    storage: 'ajax',
    // ajax: 'request', // auto-ajax
    endpoint: endpoint
  };

  var opts2 = {
    storage: 'ajax',
    ajax: 'request',
    endpoint: endpoint
  };

  describe('CRUD (auto)', function() {
    var MyKago = KagoDB.inherit(opts1);
    crud_tests(MyKago);
  });

  describe('CRUD (request)', function() {
    var MyKago = KagoDB.inherit(opts2);
    crud_tests(MyKago);
  });

  describe('Request', function() {
    var MyKago = KagoDB.inherit(opts1);
    http_tests(MyKago);
  });
});
