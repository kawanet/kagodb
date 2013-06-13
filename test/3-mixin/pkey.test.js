/*! pkey.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');
var async = require('async');
var pkey = KagoDB.bundle.pkey;

var Kago0 = KagoDB.inherit();
var Kago1 = KagoDB.inherit();
var Kago2 = KagoDB.inherit();
Kago2.mixin(pkey('_id2'));

describe('Primary Key Mixin:', function() {
  var collection;
  var opts = {
    storage: 'memory',
    namespace: 'shared',
    memory_serialize: true
  };

  var kago0 = new Kago0(opts);
  var kago1 = new Kago1(opts);
  var kago2 = new Kago2(opts);
  kago1.set('primary_key', '_id1');

  describe('set primary key via', function() {
    it('pkey()', function(done) {
      var kago = new KagoDB();
      kago.pkey('foo');
      assert.equal(kago.pkey(), 'foo', 'pkey() getter should have a primary key');
      assert.equal(kago.get('primary_key'), 'foo', 'get("primary_key") should have a primary key');
      done();
    });

    it('set()', function(done) {
      var kago = new KagoDB();
      kago.set('primary_key', 'bar');
      assert.equal(kago.pkey(), 'bar', 'pkey() getter should have a primary key');
      assert.equal(kago.get('primary_key'), 'bar', 'get("primary_key") should have a primary key');
      done();
    });
  });

  describe('get primary key of', function() {
    it('kago0', function(done) {
      assert(!kago0.pkey(), 'kago0 should not have a primary key');
      done();
    });

    it('kago1', function(done) {
      assert.equal(kago1.pkey(), '_id1', 'kago1 should have a primary key');
      done();
    });

    it('kago2', function(done) {
      assert.equal(kago2.pkey(), '_id2', 'kago2 should have a primary key');
      done();
    });
  });

  describe('write and read:', function() {
    it('kago0.write()', function(done) {
      var id = 'garply';
      var item = {
        foo: "bar0"
      };
      kago0.write(id, item, function(err) {
        assert(!err, 'kago0.write() shoud success');
        kago1.read(id, function(err, item) {
          var str = JSON.stringify(item);
          assert(!err, 'kago1.read() should success');
          assert.equal(item._id1, id, 'kago1 should have _id1 property: ' + str);
          kago2.read(id, function(err, item) {
            var str = JSON.stringify(item);
            assert(!err, 'kago2.read() should success');
            assert.equal(item._id2, id, 'kago2 should have _id2 property: ' + str);
            kago0.read(id, function(err, item) {
              var str = JSON.stringify(item);
              assert(!err, 'kago0.read() should success');
              assert(!item._id1, 'kago0 should not have _id1 property: ' + str);
              assert(!item._id2, 'kago0 should not have _id2 property: ' + str);
              done();
            });
          });
        });
      });
    });

    it('kago1.write()', function(done) {
      var id = 'waldo';
      var item = {
        foo: "bar1"
      };
      kago1.write(id, item, function(err) {
        assert(!err, 'kago1.write() shoud success');
        kago2.read(id, function(err, item) {
          var str = JSON.stringify(item);
          assert(!err, 'kago2.read() should success');
          assert.equal(item._id2, id, 'kago2 should have _id2 property: ' + str);
          kago0.read(id, function(err, item) {
            var str = JSON.stringify(item);
            assert(!err, 'kago0.read() should success');
            assert.equal(item._id1, id, 'kago0 should have _id1 property: ' + str);
            kago1.read(id, function(err, item) {
              var str = JSON.stringify(item);
              assert(!err, 'kago1.read() should success');
              assert.equal(item._id1, id, 'kago1 should have _id1 property: ' + str);
              done();
            });
          });
        });
      });
    });

    it('kago2.write()', function(done) {
      var id = 'fred';
      var item = {
        foo: "bar2"
      };
      kago2.write(id, item, function(err) {
        assert(!err, 'kago2.write() shoud success');
        kago0.read(id, function(err, item) {
          var str = JSON.stringify(item);
          assert(!err, 'kago0.read() should success');
          assert.equal(item._id2, id, 'kago0 should have _id2 property: ' + str);
          kago1.read(id, function(err, item) {
            var str = JSON.stringify(item);
            assert(!err, 'kago1.read() should success');
            assert.equal(item._id1, id, 'kago1 should have _id1 property: ' + str);
            kago2.read(id, function(err, item) {
              var str = JSON.stringify(item);
              assert(!err, 'kago2.read() should success');
              assert.equal(item._id2, id, 'kago2 should have _id2 property: ' + str);
              done();
            });
          });
        });
      });
    });
  });
});