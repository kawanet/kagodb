/*! insert.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');
var async = require('async');

describe('Insert', function() {
  var opts1 = {
    storage: 'memory',
    primary_key: '_id'
  };

  var opts2 = {
    storage: 'memory',
    primary_key: 'string'
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

  describe('single item:', function() {
    var collection = new KagoDB(opts1);
    insertSingle(collection, data);
    tests(collection, '_id', 24);
  });

  describe('multiple items:', function() {
    var collection = new KagoDB(opts1);
    insertMultiple(collection, data);
    tests(collection, '_id', 24);
  });

  describe('multiple items with IDs:', function() {
    var collection = new KagoDB(opts2);
    insertMultiple(collection, data);
    tests(collection, 'string', 3);
  });
});

function insertSingle(collection, data) {
  it('insert', function(done) {
    var index = Object.keys(data);
    async.eachSeries(index, iterator, end);

    function iterator(id, next) {
      collection.insert(data[id], next);
    }

    function end(err) {
      assert(!err, err);
      done();
    }
  });
}

function insertMultiple(collection, data) {
  it('insert', function(done) {
    var array = [];
    for (var id in data) {
      array.push(data[id]);
    }

    collection.insert(array, end);

    function end(err) {
      assert(!err, 'insert should success: ' + err);
      done();
    }
  });
}

function tests(collection, pkey, len) {
  it('count', function(done) {
    collection.count(null, function(err, count) {
      assert(!err, 'count should success: ' + err);
      assert.equal(count, 4, 'insert should insert all items');
      done();
    });
  });

  it('ID length', function(done) {
    collection.find().each(function(err, item) {
      assert(!err, 'find().each() should success: ' + err);
      if (!item) return done(); // EOF
      var id = item[pkey] || '';
      id += ''; // stringify
      assert.equal(id.length, len, 'item should have a valid ID');
    });
  });
}