/*! model.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');
var async = require('async');
var model = KagoDB.bundle.model;

var Kago0 = KagoDB.inherit();
var Kago1 = KagoDB.inherit();
var Kago2 = KagoDB.inherit();
Kago2.mixin(model(Item2));

function Item1() {}
Item1.prototype.foo = 'FOO';

function Item2() {}
Item2.prototype.bar = 'BAR';

describe('Model Mixin:', function() {
  var collection;
  var opts = {
    storage: 'memory',
    namespace: 'shared',
    primary_key: '_oid'
  };

  var kago0 = new Kago0(opts);
  var kago1 = new Kago1(opts);
  var kago2 = new Kago2(opts);
  kago1.set('model', Item1);

  describe('set model class via', function() {
    it('model()', function(done) {
      var kago = new KagoDB();
      kago.model(Item1);
      assert.equal(kago.model(), Item1, 'model() getter should have a model class');
      assert.equal(kago.get('model'), Item1, 'get("model") should have a model class');
      done();
    });

    it('set()', function(done) {
      var kago = new KagoDB();
      kago.set('model', Item2);
      assert.equal(kago.model(), Item2, 'model() getter should have a model class');
      assert.equal(kago.get('model'), Item2, 'get("model") should have a model class');
      done();
    });
  });

  describe('get model class of', function() {
    it('kago0', function(done) {
      assert(!kago0.model(), 'kago0 should not have a model class');
      done();
    });

    it('kago1', function(done) {
      assert.equal(kago1.model(), Item1, 'kago1 should have a model class');
      done();
    });

    it('kago2', function(done) {
      assert.equal(kago2.model(), Item2, 'kago2 should have a model class');
      done();
    });
  });

  describe('write and read:', function() {
    it('kago0.write()', function(done) {
      var id = 'garply';
      var item = {
        baz: 'BAZ0'
      };
      kago0.write(id, item, function(err) {
        assert(!err, 'kago0.write() shoud success');
        kago1.read(id, function(err, item) {
          var str = JSON.stringify(item);
          assert(!err, 'kago1.read() should success');
          assert(item.foo, 'kago1 should have foo property: ' + str);
          assert(!item.bar, 'kago1 should not have bar property: ' + str);
          assert(item.baz, 'kago1 should have baz property: ' + str);
          assert((item instanceof Item1), 'kago1 should return an instance of Item1');
          kago2.read(id, function(err, item) {
            var str = JSON.stringify(item);
            assert(!err, 'kago2.read() should success');
            assert(!item.foo, 'kago2 should not have foo property: ' + str);
            assert(item.bar, 'kago2 should have bar property: ' + str);
            assert(item.baz, 'kago2 should have baz property: ' + str);
            assert((item instanceof Item2), 'kago2 should return an instance of Item2');
            kago0.read(id, function(err, item) {
              var str = JSON.stringify(item);
              assert(!err, 'kago0.read() should success');
              assert(!item.foo, 'kago0 should not have foo property: ' + str);
              assert(!item.bar, 'kago0 should not have bar property: ' + str);
              assert(item.baz, 'kago0 should have baz property: ' + str);
              done();
            });
          });
        });
      });
    });

    it('kago1.write()', function(done) {
      var id = 'garply';
      var item = {
        baz: 'BAZ1'
      };
      kago1.write(id, item, function(err) {
        assert(!err, 'kago1.write() shoud success');
        kago2.read(id, function(err, item) {
          var str = JSON.stringify(item);
          assert(!err, 'kago2.read() should success');
          assert(!item.foo, 'kago2 should not have foo property: ' + str);
          assert(item.bar, 'kago2 should have bar property: ' + str);
          assert(item.baz, 'kago2 should have baz property: ' + str);
          assert((item instanceof Item2), 'kago2 should return an instance of Item2');
          kago0.read(id, function(err, item) {
            var str = JSON.stringify(item);
            assert(!err, 'kago0.read() should success');
            assert(!item.foo, 'kago0 should not have foo property: ' + str);
            assert(!item.bar, 'kago0 should not have bar property: ' + str);
            assert(item.baz, 'kago0 should have baz property: ' + str);
            kago1.read(id, function(err, item) {
              var str = JSON.stringify(item);
              assert(!err, 'kago1.read() should success');
              assert(item.foo, 'kago1 should have foo property: ' + str);
              assert(!item.bar, 'kago1 should not have bar property: ' + str);
              assert(item.baz, 'kago1 should have baz property: ' + str);
              assert((item instanceof Item1), 'kago1 should return an instance of Item1');
              done();
            });
          });
        });
      });
    });

    it('kago2.write()', function(done) {
      var id = 'garply';
      var item = {
        baz: 'BAZ2'
      };
      kago2.write(id, item, function(err) {
        assert(!err, 'kago2.write() shoud success');
        kago0.read(id, function(err, item) {
          var str = JSON.stringify(item);
          assert(!err, 'kago0.read() should success');
          assert(!item.foo, 'kago0 should not have foo property: ' + str);
          assert(!item.bar, 'kago0 should not have bar property: ' + str);
          assert(item.baz, 'kago0 should have baz property: ' + str);
          kago1.read(id, function(err, item) {
            var str = JSON.stringify(item);
            assert(!err, 'kago1.read() should success');
            assert(item.foo, 'kago1 should have foo property: ' + str);
            assert(!item.bar, 'kago1 should not have bar property: ' + str);
            assert(item.baz, 'kago1 should have baz property: ' + str);
            assert((item instanceof Item1), 'kago1 should return an instance of Item1');
            kago2.read(id, function(err, item) {
              var str = JSON.stringify(item);
              assert(!err, 'kago2.read() should success');
              assert(!item.foo, 'kago2 should not have foo property: ' + str);
              assert(item.bar, 'kago2 should have bar property: ' + str);
              assert(item.baz, 'kago2 should have baz property: ' + str);
              assert((item instanceof Item2), 'kago2 should return an instance of Item2');
              done();
            });
          });
        });
      });
    });
  });

  // findOne() method should return an object blessed as well
  describe('find and findOne:', function() {
    var cond = {_oid: 'garply'};

    it('kago1.find()', function(done) {
      kago1.find(cond).toArray(function(err, list) {
        assert(!err, 'kago1.find() should success');
        assert(list instanceof Array, 'kago1 should return an array');
        assert.equal(list.length, 1, 'kago1 should return one item');
        var item = list[0];
        assert((item instanceof Item1), 'kago1 should return an instance of Item1');
        done();
      });
    });

    it('kago2.findOne()', function(done) {
      kago2.findOne(cond, function(err, item) {
        assert(!err, 'kago2.findOne() should success');
        assert((item instanceof Item2), 'kago2 should return an instance of Item2');
        done();
      });
    });
  });
});
