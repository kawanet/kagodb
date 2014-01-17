/*! find.test.js */

var assert = require('chai').assert;
var _KagoDB = require('../../index');
var async = require('async');

module.exports = function(KagoDB) {
  describe('Find:', function() {
    main_tests(KagoDB);
  });
};

var MPE = module.parent && module.parent.exports || {};
if (!MPE.DONT_RUN_TESTS_ON_REQUIRE) {
  module.exports(_KagoDB);
}

function main_tests(KagoDB) {
  var opts = {
    storage: 'memory'
  };
  var collection = new KagoDB(opts);

  var SKIP = (collection.get('storage') != 'memory') ? ' [SKIP]' : '';

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

  var index = Object.keys(data);

  describe('find/findOne/count:', function() {

    it('write()', function(done) {
      async.eachSeries(index, each, end);

      function each(id, next) {
        collection.write(id, data[id], next);
      }

      function end(err) {
        assert(!err, err);
        done();
      }
    });

    it('count()', function(done) {
      collection.count(null, function(err, count) {
        assert(!err, 'count() should success: ' + err);
        assert.equal(count, index.length, 'count number');
        done();
      });
    });

    it('find().count()', function(done) {
      collection.find().count(function(err, count) {
        assert(!err, 'find().count() should success: ' + err);
        assert.equal(count, index.length, 'count should return correct number');
        done();
      });
    });

    it('find().toArray()', function(done) {
      var cursor = collection.find();
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        done();
      });
    });

    it('find({})', function(done) {
      var cond = {};
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'found');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().offset(2)', function(done) {
      var cursor = collection.find().offset(2);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 2, 'offset 2 length');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().offset(1000)', function(done) {
      var cursor = collection.find().offset(1000);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 0, 'offset 1000 length');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().limit(2)', function(done) {
      var cursor = collection.find().limit(2);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 2, 'limit 2 length');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().limit(1000)', function(done) {
      var cursor = collection.find().limit(1000);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'limit 1000 length');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find(null, {string:1})', function(done) {
      var cond = null;
      var proj = {
        string: 1
      };
      collection.find(cond, proj).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'found');
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          assert(item.string, 'string should exist');
          assert(!item.decimal, 'decimal should not exist');
          assert(!item.numeric, 'numeric should not exist');
        }
        done();
      });
    });

    it('find(null, {decimal:1, numeric:1})', function(done) {
      var cond = null;
      var proj = {
        decimal: 1,
        numeric: 1
      };
      collection.find(cond, proj).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'found');
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          assert(!item.string, 'string should not exist');
          assert(item.decimal, 'decimal should exist');
          assert(item.numeric, 'numeric should exist');
        }
        done();
      });
    });

    it('findOne(null)', function(done) {
      var cond = null;
      collection.findOne(cond, function(err, item) {
        assert(!err, 'findOne() should success: ' + err);
        assert(item, 'found');
        done();
      });
    });

    it('findOne({})', function(done) {
      var cond = {};
      collection.findOne(cond, function(err, item) {
        assert(!err, 'findOne() should success: ' + err);
        assert(item, 'found');
        done();
      });
    });
  });

  describe('sort:', function() {
    it('find().sort() string asc', function(done) {
      var sort = {
        string: 1
      };
      var cursor = collection.find().sort(sort);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'BAR', 'BAR/BAZ/FOO/QUX #0');
        assert.equal(list[3].string, 'QUX', 'BAR/BAZ/FOO/QUX #3');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().sort() string desc', function(done) {
      var sort = {
        string: -1
      };
      var cursor = collection.find().sort(sort);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'QUX', 'QUX/FOO/BAZ/BAR #0');
        assert.equal(list[3].string, 'BAR', 'QUX/FOO/BAZ/BAR #3');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().sort() decimal asc', function(done) {
      var sort = {
        decimal: 1
      };
      var cursor = collection.find().sort(sort);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'BAR', 'BAR/FOO/QUX/BAZ #0');
        assert.equal(list[3].string, 'BAZ', 'BAR/FOO/QUX/BAZ #3');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().sort() decimal desc', function(done) {
      var sort = {
        decimal: -1
      };
      var cursor = collection.find().sort(sort);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'BAZ', 'BAZ/QUX/FOO/BAR #0');
        assert.equal(list[3].string, 'BAR', 'BAZ/QUX/FOO/BAR #3');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().sort() numeric asc', function(done) {
      var sort = {
        numeric: 1
      };
      var cursor = collection.find().sort(sort);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'BAZ', 'BAZ/---/---/--- #0');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().sort() multiple asc', function(done) {
      var sort = {
        numeric: 1,
        decimal: 1,
        string: 1
      };
      var cursor = collection.find().sort(sort);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'BAZ', 'BAZ-BAR-FOO-QUX #0');
        assert.equal(list[1].string, 'BAR', 'BAZ-BAR-FOO-QUX #1');
        assert.equal(list[2].string, 'FOO', 'BAZ-BAR-FOO-QUX #2');
        assert.equal(list[3].string, 'QUX', 'BAZ-BAR-FOO-QUX #3');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().sort() multiple desc', function(done) {
      var sort = {
        numeric: -1,
        decimal: -1,
        string: -1
      };
      var cursor = collection.find().sort(sort);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'QUX', 'QUX-FOO-BAR-BAZ #0');
        assert.equal(list[1].string, 'FOO', 'QUX-FOO-BAR-BAZ #1');
        assert.equal(list[2].string, 'BAR', 'QUX-FOO-BAR-BAZ #2');
        assert.equal(list[3].string, 'BAZ', 'QUX-FOO-BAR-BAZ #3');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().sort(Function) decimal' + SKIP, function(done) {
      if (SKIP) return done();
      var order = function(a, b) {
        return a.decimal - b.decimal;
      };
      var cursor = collection.find().sort(order);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'BAR', 'BAR/FOO/QUX/BAZ #0');
        assert.equal(list[3].string, 'BAZ', 'BAR/FOO/QUX/BAZ #3');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find().sort(Function) numeric' + SKIP, function(done) {
      if (SKIP) return done();
      var order = function(a, b) {
        return a.numeric - b.numeric;
      };
      var cursor = collection.find().sort(order);
      cursor.toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, index.length, 'find length');
        assert.equal(list[0].string, 'BAZ', 'BAZ/---/---/--- #0');

        cursor.count(function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });
  });

  describe('condition:', function() {
    it('find({string: "FOO"})', function(done) {
      var cond = {
        string: "FOO"
      };
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'findOne() should success: ' + err);
        assert.equal(list.length, 1, 'FOO count');
        assert.equal(list[0].string, 'FOO', 'FOO string');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');

          collection.findOne(cond, function(err, item) {
            assert(!err, 'findOne() should success: ' + err);
            assert(item, 'found');
            assert.equal(item.string, 'FOO', 'FOO string findOne');
            done();
          });
        });
      });
    });

    it('find({decimal: 123})', function(done) {
      var cond = {
        decimal: 123
      };
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 2, '123 count');
        assert.equal(list[0].decimal, 123, '123 decimal 0');
        assert.equal(list[1].decimal, 123, '123 decimal 1');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');

          collection.findOne(cond, function(err, item) {
            assert(!err, 'findOne() should success: ' + err);
            assert(item, 'found');
            assert.equal(item.decimal, 123, '123 decimal findOne');
            done();
          });
        });
      });
    });

    it('find({decimal: {$gte: 999}})', function(done) {
      var cond = {
        decimal: {$gte: 999}
      };
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 1, '999 count');
        assert.equal(list[0].decimal, 999, '999 decimal 0');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');

          collection.findOne(cond, function(err, item) {
            assert(!err, 'findOne() should success: ' + err);
            assert(item, 'found');
            assert.equal(item.decimal, 999, '999 decimal findOne');
            done();
          });
        });
      });
    });

    it('find({numeric: 45.67})', function(done) {
      var cond = {
        numeric: 45.67
      };
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 3, '45.67 count');
        assert.equal(list[0].numeric, 45.67, '45.67 numeric 0');
        assert.equal(list[1].numeric, 45.67, '45.67 numeric 1');
        assert.equal(list[2].numeric, 45.67, '45.67 numeric 2');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');

          collection.findOne(cond, function(err, item) {
            assert(!err, 'findOne() should success: ' + err);
            assert(item, 'found');
            assert.equal(item.numeric, 45.67, '45.67 numeric findOne');
            done();
          });
        });
      });
    });

    it('find({numeric: {$lte: 11.11}})', function(done) {
      var cond = {
        numeric: {$lte: 11.11}
      };
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 1, '11.11 count');
        assert.equal(list[0].numeric, 11.11, '11.11 numeric 0');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');

          collection.findOne(cond, function(err, item) {
            assert(!err, 'findOne() should success: ' + err);
            assert(item, 'found');
            assert.equal(item.numeric, 11.11, '11.11 numeric findOne');
            done();
          });
        });
      });
    });

    it('find(double)', function(done) {
      var cond = {
        decimal: 123,
        numeric: 45.67
      };
      var sort = {
        string: 1
      };
      collection.find(cond).sort(sort).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 2, 'count');
        assert.equal(list[0].string, 'FOO', 'string FOO-QUX');
        assert.equal(list[1].string, 'QUX', 'string FOO-QUX');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find(triple)', function(done) {
      var cond = {
        string: "BAZ",
        decimal: 999,
        numeric: 11.11
      };
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 1, 'count');
        assert.equal(list[0].string, 'BAZ', 'string');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find({$or: [...]})', function(done) {
      var cond = {
        $or: [
          { string: "BAZ" },
          { decimal: 999 },
          { numeric: 11.11 }
        ]
      };
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 1, 'count');
        assert.equal(list[0].string, 'BAZ', 'string');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');
          done();
        });
      });
    });

    it('find(Function)' + SKIP, function(done) {
      if (SKIP) return done();
      var cond = function(item) {
        return (item.string == 'FOO');
      };
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 1, 'FOO count');
        assert.equal(list[0].string, 'FOO', 'FOO string');

        collection.count(cond, function(err, count) {
          assert(!err, 'count() should success: ' + err);
          assert.equal(count, list.length, 'count() should return the same number');

          collection.findOne(cond, function(err, item) {
            assert(!err, 'findOne() should success: ' + err);
            assert(item, 'found');
            assert.equal(item.string, 'FOO', 'FOO string findOne');
            done();
          });
        });
      });
    });
  });

  describe('options:', function() {
    it('find(null, null, options)', function(done) {
      var options = {
        sort: {
          string: 1 // BAR-BAZ-FOO-QUX
        },
        skip: 2, // FOO
        limit: 1,
        fields: {
          string: 1, // FOO
          numeric: 1 // 45.67
        }
      };

      collection.find(null, null, options).toArray(function(err, list) {
        assert(!err, 'toArray() should success: ' + err);
        assert.equal(list.length, 1, 'found');
        var item = list[0];
        assert.equal(item.string, 'FOO', 'string should correct');
        assert(!item.decimal, 'decimal should not exist');
        assert.equal(item.numeric, 45.67, 'numeric should correct');
        done();
      });
    });

    it('findOne(null, options)', function(done) {
      var options = {
        sort: {
          numeric: -1, // 45.67 -> 11.11
          decimal: 1, // 111 -> 123
          string: 1 // BAR-FOO-QUX-BAZ
        },
        skip: 1, // FOO
        fields: {
          string: 1, // FOO
          decimal: 1 // 123
        }
      };
      collection.findOne(null, options, function(err, item) {
        assert(!err, 'findOne() should success: ' + err);
        assert.equal(item.string, 'FOO', 'string should correct');
        assert.equal(item.decimal, 123, 'decimal should correct');
        assert(!item.numeric, 'numeric should not exist');
        done();
      });
    });

    it('count(null, {skip:3})', function(done) {
      var options = {
        skip: 3
      };
      collection.count(null, options, function(err, count) {
        assert(!err, 'count() should success: ' + err);
        assert.equal(count, 1, 'count should be 1');
        done();
      });
    });

    it('count(null, {limit:1})', function(done) {
      var options = {
        limit: 1
      };
      collection.count(null, options, function(err, count) {
        assert(!err, 'count() should success: ' + err);
        assert.equal(count, 1, 'count should be 1');
        done();
      });
    });
  });
}