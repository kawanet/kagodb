/*! http-jquery.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');
var jQuery = require('jquery');

describe('Proxy jQuery', function() {
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
    storage: 'http-jquery',
    endpoint: endpoint,
    jquery: jQuery
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
      collection.exists(id1, function(err, res) {
        assert(!err, 'exist failed' + err);
        assert.ok(res, 'exist foo');
        collection.exists(id2, function(err, res) {
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

    it('keys & find', function(done) {
      collection.keys(function(err, list) {
        assert(!err, 'keys failed' + err);
        assert.ok(list, 'keys response');
        list = list || [];
        assert.ok(list.length, 'keys length');
        collection.find().toArray(function(err, res) {
          assert(!err, 'find failed' + err);
          assert.ok(res, 'find response');
          res = res || [];
          assert.equal(res.length, list.length, 'find length');
          done();
        });
      });
    });

    it('remove', function(done) {
      collection.remove(id1, function(err) {
        assert(!err, 'remove failed' + err);
        collection.exists(id1, function(err, res) {
          assert(!err, 'exist failed' + err);
          assert.ok(!res, 'not-exist foo');
          collection.remove(id2, function(err) {
            assert.ok(err, 'remove error detected');
            done();
          });
        });
      });
    });
  });
});