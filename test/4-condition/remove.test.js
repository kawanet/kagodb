/*! remove.test.js */

var assert = require('chai').assert;
var _KagoDB = require('../../index');
var async = require('async');

module.exports = function(KagoDB) {
  describe('Remove:', function() {
    main_tests(KagoDB);
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports(_KagoDB);
}

function main_tests(KagoDB) {
  var opts = {
    storage: 'memory',
    primary_key: '_id'
  };

  describe('justOne:', function() {
    var collection = new KagoDB(opts);
    prepare(collection);
    remove_tests(collection, true);
  });

  describe('multiple:', function() {
    var collection = new KagoDB(opts);
    prepare(collection);
    remove_tests(collection, false);
  });
}

function prepare(collection) {
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

  it('prepare', function(done) {
    var index = Object.keys(data);
    async.eachSeries(index, iterator, end);

    function iterator(id, next) {
      collection.write(id, data[id], next);
    }

    function end(err) {
      assert(!err, err);
      done();
    }
  });
}

function remove_tests(collection, justOne) {
  it('remove() single match', function(done) {
    var query = {
      string: 'FOO'
    };
    collection.remove(query, justOne, function(err) {
      assert(!err, 'remove should success: ' + err);
      collection.count(query, function(err, count) {
        assert(!err, 'findOne should success: ' + err);
        assert(!count, 'remove should remove an item');
        done();
      });
    });
  });

  it('remove() multiple matches', function(done) {
    var query = {
      numeric: 45.67
    };
    collection.remove(query, justOne, function(err) {
      assert(!err, 'remove should success: ' + err);
      collection.count(query, function(err, count) {
        assert(!err, 'findOne should success: ' + err);
        assert.equal(count, (justOne ? 1 : 0), 'remove should remove item(s)');
        done();
      });
    });
  });
}