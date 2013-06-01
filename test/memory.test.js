/*! memory.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');

describe('Memory Storage', function() {
  var collection;
  var opts = {
    storage: 'memory'
  };
  var date = (new Date()).toJSON().replace(/\.\d+|\D/g, '');
  var id1 = 'foo-' + date;
  var id2 = 'bar-' + date;
  var item = {
    string: "FOO",
    decimal: 123,
    numeric: 45.67
  };

  beforeEach(function() {
    collection = new KagoDB(opts);
  });

  describe('CRUD', function() {
    it('write', function(done) {
      collection.write(id1, item, function(err) {
        assert(!err, 'write failed');
        done();
      });
    });

    it('exist', function(done) {
      collection.exists(id1, function(err, res) {
        assert(!err, 'exist failed');
        assert.ok(res, 'exist foo');
        collection.exists(id2, function(err, res) {
          assert(!err, 'not-exist failed');
          assert.ok(!res, 'not-exist bar');
          done();
        });
      });
    });

    it('read', function(done) {
      collection.read(id1, function(err, res) {
        assert(!err, 'read failed');
        assert.isString(res.string, 'read string type');
        assert.isNumber(res.decimal, 'read decimal type');
        assert.isNumber(res.numeric, 'read numeric type');
        assert.equal(res.string, item.string, 'read string content');
        assert.equal(res.decimal, item.decimal, 'read decimal content');
        assert.equal(res.numeric, item.numeric, 'read numeric content');
        collection.read(id2, function(err, res) {
          assert.ok(err, 'read error detected');
          done();
        });
      });
    });

    it('keys & find', function(done) {
      collection.keys(function(err, list) {
        assert(!err, 'keys failed');
        assert.ok(list, 'keys response');
        list = list || [];
        assert.ok(list.length, 'keys length');

        collection.find().toArray(function(err, res) {
          assert(!err, 'find failed');
          assert.ok(res, 'find response');
          res = res || [];
          assert.equal(res.length, list.length, 'find length');
          done();
        });
      });
    });

    it('remove', function(done) {
      collection.remove(id1, function(err) {
        assert(!err, 'remove failed');
        collection.exists(id1, function(err, res) {
          assert(!err, 'exist failed');
          assert.ok(!res, 'not-exist foo');
          collection.remove(id2, function(err) {
            assert.ok(err, 'remove error detected');
            done();
          });
        });
      });
    });
  });

  describe('Namespace', function() {
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

    it('write A and read B', function(done) {
      col1.write(id1, item, function(err) {
        assert(!err, 'namespace 1 write success');
        col2.read(id1, function(err, item) {
          assert(err, 'namespace 2 read sould fail');
          done();
        });
      });
    });

    it('write B and read A', function(done) {
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