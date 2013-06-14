/*! update.test.js */

var assert = require('chai').assert;
var _KagoDB = require('../../index');
var async = require('async');

module.exports = function(KagoDB) {
  describe('Update:', function() {
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

  describe('$set via function:' + SKIP, function() {
    if (SKIP) return;
    prepare(collection);
    set_tests(collection, 'via-function-', updater);
  });

  describe('$set via object:', function() {
    prepare(collection);
    set_tests(collection, 'via-object-', onlyset);
  });

  describe('more update operators', function() {
    prepare(collection);
    unset_tests(collection);
  });
}

function unset_tests(collection) {
  var options = {
    multi: true
  };

  it('update() $unset', function(done) {
    var query = {
      string: 'FOO'
    };
    var update = {
      $unset: {
        decimal: ""
      }
    };
    collection.update(query, update, options, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.findOne(query, function(err, item) {
        assert(!err, 'findOne should success: ' + err);
        assert(!item.decimal, '$unset should remove a field');
        done();
      });
    });
  });

  it('update() $rename', function(done) {
    var query = {
      string: 'BAR'
    };
    var update = {
      $rename: {
        numeric: 'number'
      }
    };
    collection.findOne(query, function(err, item) {
      var prev = item && item.numeric;
      assert(!err, 'findOne should success: ' + err);
      collection.update(query, update, options, function(err) {
        assert(!err, 'update should success: ' + err);
        collection.findOne(query, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert(!item.numeric, '$rename should rename a field from numeric');
          assert.equal(item.number, prev, '$rename should rename a field to number');
          done();
        });
      });
    });
  });

  it('update() $push', function(done) {
    var query = {
      string: 'BAZ'
    };
    var update = {
      $push: {
        array: 1234,
        empty: 3456,
        decimal: 5678
      }
    };
    collection.update(query, update, options, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.findOne(query, function(err, item) {
        assert(!err, 'findOne should success: ' + err);
        assert(item.array instanceof Array, '$push should manage an array');
        assert(item.empty instanceof Array, '$push should manage an empty array');
        assert(item.decimal instanceof Array, '$push should manage a not-array');
        assert.equal(item.array.length, 2, '$push should push a value to an array');
        assert.equal(item.empty.length, 1, '$push should push a value to an empty array');
        assert.equal(item.decimal.length, 2, '$push should push a value to an array upgraded');
        assert.equal(item.array[1], 1234, '$push should push a value at the end of an array');
        assert.equal(item.empty[0], 3456, '$push should push a value at the end of an empty array');
        assert.equal(item.decimal[1], 5678, '$push should push a value at the end of an array upgraded');
        done();
      });
    });
  });

  it('update() $pull', function(done) {
    var save = {
      _id: 'pull',
      foo: ['FOO'],
      bar: ['FOO', 'FOO', 'BAR', 'BAR', 'QUX', 'QUX'],
      qux: 'QUX'
    };
    var query = {
      _id: 'pull'
    };
    var update = {
      $pull: {
        foo: 'FOO',
        bar: 'BAR',
        qux: 'QUX',
        quz: 'QUZ'
      }
    };
    collection.save(save, function(err) {
      assert(!err, 'save should success: ' + err);
      collection.update(query, update, options, function(err) {
        assert(!err, 'update should success: ' + err);
        collection.findOne(query, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert(item.foo instanceof Array, '$pull should manage an array A');
          assert(item.bar instanceof Array, '$pull should manage an array B');
          assert(item.qux instanceof Array, '$pull should manage a value');
          assert(!item.quz, '$pull should manage an empty value');
          assert.equal(item.foo.length, 0, '$pull should pull a value from an array A');
          assert.equal(item.bar.length, 4, '$pull should pull a value from an array B');
          assert.equal(item.qux.length, 0, '$pull should pull a value from an array upgraded');
          assert.equal(item.bar.join('-'), 'FOO-FOO-QUX-QUX', '$pull should not change the order of an array items');
          done();
        });
      });
    });
  });

  it('update() $inc', function(done) {
    var query = {
      string: 'QUX'
    };
    var update = {
      $inc: {
        decimal: 1,
        empty: 1234
      }
    };
    collection.update(query, update, options, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.findOne(query, function(err, item) {
        assert(!err, 'findOne should success: ' + err);
        assert.equal(item.decimal, 123 + 1, '$inc should increment a field');
        assert.equal(item.empty, 1234, '$inc should increment an empty field');
        done();
      });
    });
  });
}

function onlyset(set) {
  return {
    $set: set
  };
}

function updater(set) {
  return function(item) {
    item.test = set.test;
    return item;
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
  it('update() single item', function(done) {
    var query = {
      string: 'FOO'
    };
    var set = {
      test: prefix + 1
    };
    collection.update(query, updater(set), null, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert.equal(count, 1, 'update should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert.equal(item.string, query.string, 'update should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert.equal(count, 1, 'update should not update others');
            done();
          });
        });
      });
    });
  });

  it('update() first item', function(done) {
    var query = {
      decimal: 123
    };
    var set = {
      test: prefix + 2
    };
    collection.update(query, updater(set), null, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert.equal(count, 1, 'update should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert.equal(item.decimal, query.decimal, 'update should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert.equal(count, 2, 'update should not update others');
            done();
          });
        });
      });
    });
  });

  it('update() multiple item', function(done) {
    var query = {
      numeric: 45.67
    };
    var set = {
      test: prefix + 3
    };
    var opts = {
      multi: true
    };
    collection.update(query, updater(set), opts, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert.equal(count, 3, 'update should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert.equal(item.numeric, query.numeric, 'update should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert.equal(count, 3, 'update should not update others');
            done();
          });
        });
      });
    });
  });

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