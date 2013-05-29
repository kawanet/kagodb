/*! yaml.test.js */

var assert = require('chai').assert;
var dbyaml = require('../index');

describe('yaml', function() {
  var collection;
  var opts = {
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

  beforeEach(function() {
    collection = new dbyaml(opts);
  });

  describe('#collection', function() {
    it('write success', function(done) {
      collection.write(id1, item, function(err) {
        assert(!err, 'write OK');
        done();
      });
    });

    it('read success', function(done) {
      collection.read(id1, function(err, res) {
        // assert(!err, 'read OK');
        assert.isString(res.string, 'read string type')
        assert.isNumber(res.decimal, 'read decimal type')
        assert.isNumber(res.numeric, 'read numeric type')
        assert.equal(res.string, item.string, 'read string content');
        assert.equal(res.decimal, item.decimal, 'read decimal content');
        assert.equal(res.numeric, item.numeric, 'read numeric content');
        done();
      });
    });

    it('read error', function(done) {
      collection.read('bar', function(err, res) {
        assert.ok(err, 'read error detected');
        done();
      });
    });

    it('exist success', function(done) {
      collection.exists(id1, function(err, res) {
        assert(!err, 'exist OK');
        assert.ok(res, 'exist foo');
        done();
      });
    });

    it('not-exist success', function(done) {
      collection.exists('bar', function(err, res) {
        assert(!err, 'not-exist OK');
        assert.ok(!res, 'not-exist bar');
        done();
      });
    });

    it('find success', function(done) {
      collection.find({}).toArray(function(err, res) {
        assert(!err, 'find OK');
        assert.ok(res, 'find foo');
        res = res || [];
        assert.ok(res.length, 'find foo length');
        done();
      });
    });

    it('remove success', function(done) {
      collection.remove(id1, function(err) {
        assert(!err, 'remove OK');
        done();
      });
    });

    it('remove error', function(done) {
      collection.remove('bar', function(err) {
        assert.ok(err, 'remove error detected');
        done();
      });
    });
  });
});