/*! insert.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');
var async = require('async');

describe('Save:', function() {
  var opts1 = {
    storage: 'memory',
    primary_key: '_id'
  };
  var opts2 = {
    storage: 'memory',
    primary_key: 'string'
  };
  var opts3 = {
    storage: 'memory',
    primary_key: 'decimal'
  };

  var data = {
    foo: {
      string: "FOO",
      decimal: 123,
      numeric: 45.67
    },
    bar: {
      string: "BAR",
      decimal: 111,
      numeric: 45.67
    },
    baz: {
      string: "BAZ",
      decimal: 999,
      numeric: 11.11
    },
    qux: {
      string: "QUX",
      decimal: 123,
      numeric: 45.67
    }
  };

  describe('save with empty ID', function() {
    var collection = new KagoDB(opts1);
    save_tests(collection, data, 4);
  });

  describe('save with unique ID', function() {
    var collection = new KagoDB(opts2);
    save_tests(collection, data, 4);
  });

  describe('save with duplicated ID', function() {
    var collection = new KagoDB(opts3);
    save_tests(collection, data, 3);
  });
});

function save_tests(collection, data, len) {
  var index = Object.keys(data);
  it('insert ' + index.length, function(done) {
    async.eachSeries(index, iterator, end);

    function iterator(id, next) {
      collection.save(data[id], next);
    }

    function end(err) {
      assert(!err, 'save should success: ' + err);
      done();
    }
  });

  it('count ' + len, function(done) {
    collection.count(null, function(err, count) {
      assert(!err, 'count should success: ' + err);
      assert.equal(count, len, 'save should save items correctly');
      done();
    });
  });
}