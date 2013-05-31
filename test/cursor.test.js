/*! cursor.test.js */

var assert = require('chai').assert;
var dbyaml = require('../index');
var async = require('async');

describe('Cursor', function() {
  var collection;
  var opts = {
    storage: 'memory'
  };

  describe('Methods', function() {
    collection = new dbyaml(opts);

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

    var keys = Object.keys(data);

    it('write()', function(done) {
      async.eachSeries(keys, each, end);

      function each(id, next) {
        collection.write(id, data[id], next);
      }

      function end(err) {
        assert(!err, 'no error');
        done();
      }
    });

    it('find().count()', function(done) {
      collection.find().count(function(err, count) {
        assert(!err, 'no error');
        assert.equal(count, keys.length, 'count number');
        done();
      });
    });

    it('count()', function(done) {
      collection.count(null, function(err, count) {
        assert(!err, 'no error');
        assert.equal(count, keys.length, 'count number');
        done();
      });
    });

    it('find().toArray()', function(done) {
      collection.find().toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'find length');
        done();
      });
    });

    it('find().offset(2)', function(done) {
      collection.find().offset(2).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length - 2, 'offset 2 length');
        done();
      });
    });

    it('find().offset(1000)', function(done) {
      collection.find().offset(1000).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, 0, 'offset 1000 length');
        done();
      });
    });

    it('find().limit(2)', function(done) {
      collection.find().limit(2).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, 2, 'limit 2 length');
        done();
      });
    });

    it('find().limit(1000)', function(done) {
      collection.find().limit(1000).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'limit 1000 length');
        done();
      });
    });

    it('find().sort() string asc', function(done) {
      var sort = {
        string: 1
      };
      collection.find().sort(sort).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'find length');
        assert.equal(list[0].string, 'BAR', 'BAR/BAZ/FOO/QUX #0');
        assert.equal(list[3].string, 'QUX', 'BAR/BAZ/FOO/QUX #3');
        done();
      });
    });

    it('find().sort() string desc', function(done) {
      var sort = {
        string: -1
      };
      collection.find().sort(sort).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'find length');
        assert.equal(list[0].string, 'QUX', 'QUX/FOO/BAZ/BAR #0');
        assert.equal(list[3].string, 'BAR', 'QUX/FOO/BAZ/BAR #3');
        done();
      });
    });

    it('find().sort() decimal asc', function(done) {
      var sort = {
        decimal: 1
      };
      collection.find().sort(sort).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'find length');
        assert.equal(list[0].string, 'BAR', 'BAR/FOO/QUX/BAZ #0');
        assert.equal(list[3].string, 'BAZ', 'BAR/FOO/QUX/BAZ #3');
        done();
      });
    });

    it('find().sort() decimal desc', function(done) {
      var sort = {
        decimal: -1
      };
      collection.find().sort(sort).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'find length');
        assert.equal(list[0].string, 'BAZ', 'BAZ/QUX/FOO/BAR #0');
        assert.equal(list[3].string, 'BAR', 'BAZ/QUX/FOO/BAR #3');
        done();
      });
    });

    it('find().sort() numeric asc', function(done) {
      var sort = {
        numeric: 1
      };
      collection.find().sort(sort).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'find length');
        assert.equal(list[0].string, 'BAZ', 'BAZ/---/---/--- #0');
        done();
      });
    });

    it('find().sort() multiple asc', function(done) {
      var sort = {
        numeric: 1,
        decimal: 1,
        string: 1
      };
      collection.find().sort(sort).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'find length');
        assert.equal(list[0].string, 'BAZ', 'BAZ-BAR-FOO-QUX #0');
        assert.equal(list[1].string, 'BAR', 'BAZ-BAR-FOO-QUX #1');
        assert.equal(list[2].string, 'FOO', 'BAZ-BAR-FOO-QUX #2');
        assert.equal(list[3].string, 'QUX', 'BAZ-BAR-FOO-QUX #3');
        done();
      });
    });

    it('find().sort() multiple asc', function(done) {
      var sort = {
        numeric: -1,
        decimal: -1,
        string: -1
      };
      collection.find().sort(sort).toArray(function(err, list) {
        assert(!err, 'no error');
        assert.equal(list.length, keys.length, 'find length');
        assert.equal(list[0].string, 'QUX', 'QUX-FOO-BAR-BAZ #0');
        assert.equal(list[1].string, 'FOO', 'QUX-FOO-BAR-BAZ #1');
        assert.equal(list[2].string, 'BAR', 'QUX-FOO-BAR-BAZ #2');
        assert.equal(list[3].string, 'BAZ', 'QUX-FOO-BAR-BAZ #3');
        done();
      });
    });
  });
});