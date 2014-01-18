/*! crud_tests.js */

var assert = require('chai').assert;

module.exports = crud_tests;

function Model() {
  // dummy model class
}

function crud_tests(KagoDB) {
  var pkey = "_id";
  var opts = {
    model: Model,
    primary_key: pkey
  };
  KagoDB = KagoDB.inherit(opts);

  // a wrap filter which defines a property for testing
  var seq = 0;
  var super_wrap = KagoDB.prototype.wrap;
  KagoDB.prototype.wrap = function(item) {
    if (super_wrap) {
      item = super_wrap.apply(this, arguments);
    }
    item.wrap = ++seq;
    return item;
  };

  // an unwrap which copies a property for testing
  var super_unwrap = KagoDB.prototype.unwrap;
  KagoDB.prototype.unwrap = function(item) {
    if (super_unwrap) {
      item = super_unwrap.apply(this, arguments);
    }
    item.unwrap = item.wrap || ++seq;
    return item;
  };

  var collection = new KagoDB();

  var date = (new Date()).toJSON().replace(/\.\d+|\D/g, '');
  var id1 = 'foo-' + date;
  var id2 = 'bar-' + date;
  var item = {
    string: "FOO",
    decimal: 123,
    numeric: 45.67
  };
  var cond = {
    _id: id1
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

  // read() should work with model property
  it('model', function(done) {
    collection.read(id1, function(err, item) {
      assert(!err, 'read success: ' + err);
      assert(item instanceof Model, 'read should return a Model instance');
      var cond = {};
      cond[pkey] = id1;
      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'findOne success: ' + err);
        assert(list instanceof Array, 'find should return an array');
        assert.equal(list.length, 1, 'find should return one item');
        assert(list[0] instanceof Model, 'find should return a Model instance');
        collection.findOne(cond, function(err, item) {
          assert(!err, 'findOne success: ' + err);
          assert(item instanceof Model, 'findOne should return a Model instance');
          done();
        });
      });
    });
  });

  it('wrap & unwrap', function(done) {
    collection.read(id1, function(err, item) {
      assert(!err, 'read should success');
      assert(item, 'read should return an item');
      assert(item.wrap, 'wrap should be applied (read)');
      assert(item.unwrap, 'unwrap should be applied (read)');
      assert.equal(item.wrap, item.unwrap, 'unwrap should be copied since wrap (read)');

      collection.find(cond).toArray(function(err, list) {
        assert(!err, 'find should success');
        assert(list instanceof Array, 'find should return an array');
        assert(list.length, 'find should return item(s)');
        var item = list[0];
        assert(item, 'find should return an item');
        assert(item.wrap, 'wrap should be applied (find)');
        assert(item.unwrap, 'unwrap should be applied (find)');
        assert.equal(item.wrap, item.unwrap, 'unwrap should be copied since wrap (find)');
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
