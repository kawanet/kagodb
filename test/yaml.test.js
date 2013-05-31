/*! yaml.test.js */

var assert = require('chai').assert;
var fs = require('fs');
var KagoDB = require('../index');

describe('YAML Storage', function() {
  var collection;
  var opts = {
    storage: 'yaml',
    path: './data'
  };
  var rand = Math.floor(Math.random() * 900000) + 100000;
  var id1 = 'foo-' + rand;
  var id2 = 'bar-' + rand;
  var item = {
    string: "FOO",
    decimal: 123,
    numeric: 45.67
  };

  var path1 = opts.path + '/' + id1 + '.' + opts.storage;
  var path2 = opts.path + '/' + id2 + '.' + opts.storage;

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

          fs.stat(path1, function(err, stat) {
            assert(!err, 'file 1 exists');
            fs.stat(path2, function(err, stat) {
              assert(err, 'file 2 not exists');
              done();
            });
          });
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

            fs.stat(path1, function(err, stat) {
              assert(err, 'file 1 exists');
              fs.stat(path2, function(err, stat) {
                assert(err, 'file 2 not exists');
                done();
              });
            });
          });
        });
      });
    });
  });
});