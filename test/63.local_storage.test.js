/*! local_storage.test.js */

var assert = require('chai').assert;
var fs = require('fs');
var KagoDB = require('../index');
var crud_tests = require('./lib/crud_tests');

var localStorage;

describe('Local Storage (emulation)', function() {

  var opts1 = {
    storage: 'local_storage'
  };
  var opts2 = {
    storage: 'local_storage',
    namespace: 'test'
  };

  describe('CRUD without namespace', function() {
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts1);
    });
    crud_tests(kit);
  });

  describe('CRUD with namespace', function() {
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts2);
    });
    crud_tests(kit);
  });

  describe('Key existance', function() {
    var date = (new Date()).toJSON().replace(/\.\d+|\D/g, '');
    var idA = 'foo-' + date;
    var idB = 'bar ' + date;
    var path1A = encodeURIComponent(idA);
    var path1B = encodeURIComponent(idB);
    var path2A = opts2.namespace + ':' + encodeURIComponent(idA);
    var path2B = opts2.namespace + ':' + encodeURIComponent(idB);

    var collection1 = new KagoDB(opts1);
    collection1.find();
    localStorage = collection1.memory_store();
    write_to_erase(collection1, idA, path1A);
    write_to_erase(collection1, idB, path1B);

    var collection2 = new KagoDB(opts2);
    collection2.find();
    localStorage = collection2.memory_store();
    write_to_erase(collection2, idA, path2A);
    write_to_erase(collection2, idB, path2B);
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
  callback(null, !! localStorage[path]);
}