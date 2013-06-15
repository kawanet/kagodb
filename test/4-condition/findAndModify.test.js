/*! update.test.js */

var assert = require('chai').assert;
var _KagoDB = require('../../index');
var async = require('async');

module.exports = function(KagoDB) {
  describe('FindAndModify:', function() {
    main_tests(KagoDB);
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports(_KagoDB);
}

function main_tests(KagoDB) {
  var collection;
  var opts = {
    storage: 'memory',
    primary_key: '_id'
  };

  collection = new KagoDB(opts);

  var SKIP = (collection.get('storage') != 'memory') ? ' [SKIP]' : '';

  describe('findAndModify()', function() {
    prepare(collection);
    set_tests(collection, 'via-object-', onlyset);
  });
}

function onlyset(set) {
  return {
    $set: set
  };
}

function prepare(collection) {
  var data = {
    foo: {
      string: "FOO",
      decimal: 123,
      numeric: 45.67,
      array: ['foofoo']
    },
    bar: {
      string: "BAR",
      decimal: 111,
      numeric: 45.67,
      array: ['barbar']
    },
    baz: {
      string: "BAZ",
      decimal: 999,
      numeric: 11.11,
      array: ['bazbaz']
    },
    qux: {
      string: "QUX",
      decimal: 123,
      numeric: 45.67,
      array: ['quxqux']
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

function set_tests(collection, prefix, updater) {
  it('findAndModify() descending sort', function(done) {
    var query = {
      numeric: 45.67
    };
    var sort = {
      decimal: 1 // 111-123-123
    };
    var set = {
      test: prefix + 5
    };
    collection.findAndModify(query, sort, updater(set), null, function(err) {
      assert(!err, 'findAndModify should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert.equal(count, 1, 'findAndModify should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert.equal(item.decimal, 111, 'findAndModify should update first item sorted');
          assert.equal(item.numeric, query.numeric, 'findAndModify should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert.equal(count, 3, 'findAndModify should not update others');
            done();
          });
        });
      });
    });
  });

  it('findAndModify() ascending sort', function(done) {
    var query = {
      numeric: 45.67
    };
    var sort = {
      string: -1 // QUX-FOO-BAR
    };
    var set = {
      test: prefix + 6
    };
    collection.findAndModify(query, sort, updater(set), null, function(err) {
      assert(!err, 'findAndModify should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert.equal(count, 1, 'findAndModify should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert.equal(item.string, 'QUX', 'findAndModify should update first item sorted');
          assert.equal(item.numeric, query.numeric, 'findAndModify should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert.equal(count, 3, 'findAndModify should not update others');
            done();
          });
        });
      });
    });
  });
}