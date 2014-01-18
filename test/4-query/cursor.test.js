/*! cursor.test.js */

var assert = require('chai').assert;
var _KagoDB = require('../../index');
var async = require('async');

module.exports = function(KagoDB) {
  describe('Cursor:', function() {
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

  it('write sample recoreds', function(done) {
    var id = "foo";
    var item = { bar: "BAZ" };
    collection.write(id, item, done);
  });

  it('invalid condition parameter', function(done) {
    var cond = { $or: [], $and: [] }; // invalid query
    var cursor = collection.find(cond);
    cursor.count(function(err) {
      assert(err, "count should return an error");
      cursor.toArray(function(err) {
        assert(err, "toArray should return an error");
        done();
      });
    });
  });

  it('invalid sort paramter', function(done) {
    var sort = [ true ]; // invalid parameter
    collection.find().sort(sort).toArray(function(err) {
      assert(err, "toArray should return an error");
      done();
    });
  });

  it('invalid view paramter', function(done) {
    var view = true; // invalid parameter
    collection.find(null, view).toArray(function(err) {
      assert(err, "toArray should return an error");
      done();
    });
  });
}