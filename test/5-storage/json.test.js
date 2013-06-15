/*! json.test.js */

var assert = require('chai').assert;
var fs = require('fs');
var KagoDB = require('../../index');
var crud_tests = require('../testlib/crud_tests');

describe('JSON Storage:', function() {
  var opts = {
    storage: 'json',
    path: './data',
    json_spaces: ' '
  };

  describe('CRUD', function() {
    var MyKago = KagoDB.inherit(opts);
    crud_tests(MyKago);
  });

  describe('File existance', function() {
    var date = (new Date()).toJSON().replace(/\.\d+|\D/g, '');
    var idA = 'foo-' + date;
    var idB = 'bar ' + date;
    var pathA = opts.path + '/' + encodeURIComponent(idA) + '.' + opts.storage;
    var pathB = opts.path + '/' + encodeURIComponent(idB) + '.' + opts.storage;

    var collection = new KagoDB(opts);
    write_to_erase(collection, idA, pathA);
    write_to_erase(collection, idB, pathB);
  });
});

function write_to_erase(collection, id, path) {
  var item = {
    string: "FOO",
    decimal: 123,
    numeric: 45.67
  };
  it(path, function(done) {
    collection.write(id, item, function(err) {
      assert(!err, 'write failed');
      check_exists(path, function(err, exist) {
        assert(exist, 'item should exist');
        collection.index(function(err, list) {
          assert(!err, 'index failed');
          var contain = list.filter(function(key) {
            return key == id;
          }).length;
          assert.ok(contain, 'index should contain item: ' + id);
          collection.erase(id, function(err) {
            assert(!err, 'erase failed');
            check_exists(path, function(err, exist) {
              assert(!exist, 'item shoud not exist');
              done();
            });
          });
        });
      });
    });
  });
}

function check_exists(path, callback) {
  fs.stat(path, callback);
}
