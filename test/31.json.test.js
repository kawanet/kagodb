/*! json.test.js */

var assert = require('chai').assert;
var fs = require('fs');
var KagoDB = require('../index');
var crud_tests = require('./lib/crud_tests');

describe('JSON Storage', function() {
  var opts = {
    storage: 'json',
    path: './data',
    'json-spaces': ' '
  };

  describe('CRUD', function() {
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts);
    });
    crud_tests(kit);
  });

  describe('File existance', function() {
    var date = (new Date()).toJSON().replace(/\.\d+|\D/g, '');
    var id1 = 'foo-' + date;
    var path1 = opts.path + '/' + id1 + '.' + opts.storage;
    var item = {
      string: "FOO",
      decimal: 123,
      numeric: 45.67
    };
    var collection = new KagoDB(opts);

    it(path1, function(done) {
      collection.write(id1, item, function(err) {
        assert(!err, 'write failed');
        fs.stat(path1, function(err, stat) {
          assert(!err, 'file should exist');
          collection.erase(id1, function(err) {
            assert(!err, 'erase failed');
            fs.stat(path1, function(err, stat) {
              assert(err, 'file shoud not exist');
              done();
            });
          });
        });
      });
    });
  });
});