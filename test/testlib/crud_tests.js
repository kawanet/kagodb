/*! crud_tests.js */

var assert = require('chai').assert;

module.exports = crud_tests;

function crud_tests(KagoDB) {
  var collection = new KagoDB();

  var date = (new Date()).toJSON().replace(/\.\d+|\D/g, '');
  var id1 = 'foo-' + date;
  var id2 = 'bar-' + date;
  var item = {
    string: "FOO",
    decimal: 123,
    numeric: 45.67
  };

  it('write', function(done) {
    collection.write(id1, item, function(err) {
      assert(!err, 'write failed: ' + err);
      done();
    });
  });

  it('exist', function(done) {
    collection.exist(id1, function(err, res) {
      assert(!err, 'exist failed: ' + err);
      assert(res, 'exist foo');
      collection.exist(id2, function(err, res) {
        assert(!err, 'not-exist failed');
        assert(!res, 'not-exist bar');
        done();
      });
    });
  });

  it('read', function(done) {
    collection.read(id1, function(err, res) {
      assert(!err, 'read failed: ' + err);
      assert.isString(res.string, 'read string type');
      assert.isNumber(res.decimal, 'read decimal type');
      assert.isNumber(res.numeric, 'read numeric type');
      assert.equal(res.string, item.string, 'read string content');
      assert.equal(res.decimal, item.decimal, 'read decimal content');
      assert.equal(res.numeric, item.numeric, 'read numeric content');
      collection.read(id2, function(err, res) {
        assert(err, 'read error should be detected');
        done();
      });
    });
  });

  it('index & find', function(done) {
    collection.index(function(err, list) {
      assert(!err, 'index failed: ' + err);
      assert(list, 'index response');
      list = list || [];
      assert(list.length, 'index should return some');

      collection.find().toArray(function(err, res) {
        assert(!err, 'find failed');
        assert(res, 'find response');
        res = res || [];
        assert(res.length, 'find should return some');
        assert.equal(list.length, res.length, 'index & find should return same number of items');
        done();
      });
    });
  });

  it('erase', function(done) {
    collection.erase(id1, function(err) {
      assert(!err, 'erase failed: ' + err);
      collection.exist(id1, function(err, res) {
        assert(!err, 'exist failed');
        assert(!res, 'not-exist foo');
        collection.erase(id2, function(err) {
          assert(err, 'erase error should be detected');
          done();
        });
      });
    });
  });
}