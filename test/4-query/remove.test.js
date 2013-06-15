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
  var single_true = {
    single: true
  };
  var single_false = {
    single: false
  };

  describe('single: {single: true}', function() {
    var collection = new KagoDB(opts);
    prepare(collection);
    remove_tests(collection, single_true);
  });

  describe('multiple: {single: false}', function() {
    var collection = new KagoDB(opts);
    prepare(collection);
    remove_tests(collection, single_false);
  });

  describe('multiple: null', function() {
    var collection = new KagoDB(opts);
    prepare(collection);
    remove_tests(collection);
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

function remove_tests(collection, ropts) {
  it('remove() on single match', function(done) {
    var query = {
      string: 'FOO'
    };
    collection.remove(query, ropts, function(err) {
      assert(!err, 'remove should success: ' + err);
      collection.count(query, function(err, count) {
        assert(!err, 'findOne should success: ' + err);
        assert(!count, 'remove should remove an item');
        done();
      });
    });
  });

  it('remove() on multiple matches', function(done) {
    var query = {
      numeric: 45.67
    };
    collection.remove(query, ropts, function(err) {
      assert(!err, 'remove should success: ' + err);
      collection.count(query, function(err, count) {
        assert(!err, 'findOne should success: ' + err);
        ropts = ropts || {};
        var expect = (ropts && ropts.single) ? 1 : 0;
        assert.equal(count, expect, 'remove should remove item(s)');
        done();
      });
    });
  });
}