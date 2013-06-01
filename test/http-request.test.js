/*! http-jquery.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');

describe('Proxy Request', function() {
  var endpoint = process.env.TEST_ENDPOINT;

  describe('$TEST_ENDPOINT', function() {
    var name = endpoint || 'i.g. TEST_ENDPOINT=http://localhost:3000/memory/';
    it(name, function(done) {
      done();
    });
  });

  if (!endpoint) return;

  var collection;
  var opts = {
    storage: 'http-request',
    endpoint: endpoint
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
        assert(!err, 'write failed ' + err);
        done();
      });
    });

    it('exist', function(done) {
      collection.exist(id1, function(err, res) {
        assert(!err, 'exist failed' + err);
        assert.ok(res, 'exist foo');
        collection.exist(id2, function(err, res) {
          assert(!err, 'not-exist failed' + err);
          assert.ok(!res, 'not-exist bar');
          done();
        });
      });
    });

    it('read', function(done) {
      collection.read(id1, function(err, res) {
        assert(!err, 'read failed' + err);
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

    it('index & find', function(done) {
      collection.index(function(err, list) {
        assert(!err, 'index failed' + err);
        assert.ok(list, 'index response');
        list = list || [];
        assert.ok(list.length, 'index length');
        collection.find().toArray(function(err, res) {
          assert(!err, 'find failed' + err);
          assert.ok(res, 'find response');
          res = res || [];
          assert.equal(res.length, list.length, 'find length');
          done();
        });
      });
    });

    it('erase', function(done) {
      collection.erase(id1, function(err) {
        assert(!err, 'erase failed' + err);
        collection.exist(id1, function(err, res) {
          assert(!err, 'exist failed' + err);
          assert.ok(!res, 'not-exist foo');
          collection.erase(id2, function(err) {
            assert.ok(err, 'erase error detected');
            done();
          });
        });
      });
    });
  });
});
