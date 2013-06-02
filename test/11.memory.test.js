/*! memory.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');
var crud_tests = require('./lib/crud_tests');

describe('Memory Storage', function() {

  describe('CRUD without namespace', function() {
    var opts = {
      storage: 'memory'
    };
    var kit = {};
    kit.collection = new KagoDB(opts);
    crud_tests(kit);
  });

  describe('CRUD with namespace', function() {
    var opts = {
      storage: 'memory',
      namespace: 'foobar'
    };
    var kit = {};
    beforeEach(function() {
      kit.collection = new KagoDB(opts);
    });
    crud_tests(kit);
  });

  describe('Inter-namespace', function() {
    var opts1 = {
      storage: 'memory',
      namespace: 'foo'
    };
    var opts2 = {
      storage: 'memory',
      namespace: 'bar'
    };
    var col1 = new KagoDB(opts1);
    var col2 = new KagoDB(opts2);
    var date = (new Date()).toJSON().replace(/\.\d+|\D/g, '');
    var id1 = 'foo-' + date;
    var id2 = 'bar-' + date;
    var item = {
      string: "FOO",
      decimal: 123,
      numeric: 45.67
    };

    it('write on A and read on B', function(done) {
      col1.write(id1, item, function(err) {
        assert(!err, 'namespace 1 write success');
        col2.read(id1, function(err, item) {
          assert(err, 'namespace 2 read sould fail');
          done();
        });
      });
    });

    it('write on B and read on A', function(done) {
      col2.write(id2, item, function(err) {
        assert(!err, 'namespace 2 write success');
        col1.read(id2, function(err, item) {
          assert(err, 'namespace 1 read sould fail');
          done();
        });
      });
    });
  });
});