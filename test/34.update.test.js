/*! update.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');
var async = require('async');

KagoDB = KagoDB.inherit();
KagoDB.mixin(require('../mixin/update'));

describe('Update', function() {
  var collection;
  var opts = {
    storage: 'memory',
    primary_key: '_id'
  };

  collection = new KagoDB(opts);

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

  it('write()', function(done) {
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

  it('update() single item', function(done) {
    var query = {
      string: 'FOO'
    };
    var set = {
      test: 1
    };
    collection.update(query, updater(set), null, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert(count, 1, 'update should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert(item.string, query.string, 'update should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert(count, 1, 'update should not update others');
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
      test: 2
    };
    collection.update(query, updater(set), null, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert(count, 1, 'update should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert(item.decimal, query.decimal, 'update should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert(count, 2, 'update should not update others');
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
      test: 3
    };
    var opts = {
      multiple: true
    };
    collection.update(query, updater(set), opts, function(err) {
      assert(!err, 'update should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert(count, 1, 'update should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert(item.numeric, query.numeric, 'update should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert(count, 3, 'update should not update others');
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
      test: 5
    };
    collection.findAndModify(query, sort, updater(set), null, function(err) {
      assert(!err, 'findAndModify should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert(count, 1, 'findAndModify should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert(item.decimal, 111, 'findAndModify should update first item sorted');
          assert(item.numeric, query.numeric, 'findAndModify should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert(count, 3, 'findAndModify should not update others');
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
      test: 5
    };
    collection.findAndModify(query, sort, updater(set), null, function(err) {
      assert(!err, 'findAndModify should success: ' + err);
      collection.count(set, function(err, count) {
        assert(!err, 'count should success: ' + err);
        assert(count, 1, 'findAndModify should update one item');
        collection.findOne(set, function(err, item) {
          assert(!err, 'findOne should success: ' + err);
          assert(item.string, 'QUX', 'findAndModify should update first item sorted');
          assert(item.numeric, query.numeric, 'findAndModify should update correctly');
          collection.count(query, function(err, count) {
            assert(!err, 'count should success: ' + err);
            assert(count, 3, 'findAndModify should not update others');
            done();
          });
        });
      });
    });
  });

  function updater(set) {
    return function(item) {
      item.test = set.test;
      return item;
    }
  }
});