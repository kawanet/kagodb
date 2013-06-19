/*! memory.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');
var crud_tests = require('../testlib/crud_tests');

describe('Memory Storage:', function() {

  describe('CRUD without namespace', function() {
    var opts = {
      storage: 'memory'
    };
    var MyKago = KagoDB.inherit(opts);
    crud_tests(MyKago);
  });

  describe('CRUD with namespace', function() {
    var opts = {
      storage: 'memory',
      namespace: 'foobar'
    };
    var MyKago = KagoDB.inherit(opts);
    crud_tests(MyKago);
  });

  describe('Serializer', function() {
    var opts = {
      storage: 'memory'
    };
    var MyKago = KagoDB.inherit(opts);
    crud_tests(MyKago);

    var collection = new MyKago();
    var date = (new Date()).toJSON().replace(/\.\d+|\D/g, '');
    var id = 'foo-' + date;
    var item = {
      string: "FOO",
      decimal: 123,
      numeric: 45.67
    };

    it('value preservation', function(done) {
      collection.write(id, item, function(err) {
        assert(!err, 'write should success');
        item.string = 'BAR';
        collection.read(id, function(err, item1) {
          assert(!err, 'read should success');
          assert.equal(item1.string, 'FOO', 'serialized value should be not changed');
          item1.string = 'BUZ';
          assert.equal(item.string, 'BAR', 'original value should be not changed');
          collection.read(id, function(err, item2) {
            assert(!err, 'read should success');
            assert.equal(item2.string, 'FOO', 'serialized value should be not changed still');
            assert.equal(item1.string, 'BUZ', 'previous value should be not changed still');
            assert.equal(item.string, 'BAR', 'original value should be not changed still');
            done();
          });
        });
      });
    });
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
