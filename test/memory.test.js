/*! memory.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');

describe('Memory Storage', function() {
  var collection;
  var opts = {
    storage: 'memory'
  };
  var rand = Math.floor(Math.random() * 900000) + 100000;
  var id1 = 'foo-' + rand;
  var id2 = 'bar-' + rand;
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
        assert(!err, 'write OK');
        done();
      });
    });

    it('exist', function(done) {
      collection.exists(id1, function(err, res) {
        assert(!err, 'exist OK');
        assert.ok(res, 'exist foo');
        collection.exists(id2, function(err, res) {
          assert(!err, 'not-exist OK');
          assert.ok(!res, 'not-exist bar');
          done();
        });
      });
    });

    it('read', function(done) {
      collection.read(id1, function(err, res) {
        // assert(!err, 'read OK');
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

    it('find', function(done) {
      collection.find({}).toArray(function(err, res) {
        assert(!err, 'find OK');
        assert.ok(res, 'find foo');
        res = res || [];
        assert.ok(res.length, 'find foo length');
        done();
      });
    });

    it('remove', function(done) {
      collection.remove(id1, function(err) {
        assert(!err, 'remove OK');
        collection.exists(id1, function(err, res) {
          assert(!err, 'exist OK');
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