/*! utils.test.js */

var assert = require('chai').assert;
var _utils = require('../core/utils');
var KagoDB = require('../index');

describe('utils tests:', function() {
  utils_test('direct utils', _utils);
  // var iutils = KagoDB().utils;
  // utils_test('utils via instance', iutils);
  var butils = KagoDB.bundle.utils || {};
  utils_test('utils via bundle', butils);
});

function utils_test(name, utils) {
  describe(name, function() {

    it('utils.inherits', function(done) {
      assert('function' == typeof utils.inherits, 'utils shoud provide inherits() function');

      function Parent() {}
      Parent.prototype.foo = function() {};

      utils.inherits(Child, Parent);

      function Child() {}
      Child.prototype.bar = function() {};

      var parent = new Parent();
      assert((parent instanceof Parent), 'parent should be instance of Parent');
      assert(parent.foo, 'parent should have foo method');
      assert(!parent.bar, 'parent should not have bar method');

      var child = new Child();
      assert((parent instanceof Parent), 'parent should be instance of Parent');
      assert((child instanceof Child), 'parent should be instance of Child');
      assert(child.foo, 'child should have foo method');
      assert(child.bar, 'child should have bar method');

      done();
    });

    it('utils.eachSeries', function(done) {
      assert('function' == typeof utils.eachSeries, 'utils shoud provide eachSeries() function');

      var count = 0;
      var total = 0;
      var array1 = [1, 2, 3, 4, 5];

      utils.eachSeries(array1, iterator, function(err) {
        assert(!err, 'here should not have an error');
        assert.equal(count, array1.length, 'iterator should be called correctly');
        var sum = 1 + 2 + 3 + 4 + 5;
        assert.equal(total, sum, 'iterator should receive an argument');

        var err2 = new Error();
        var array2 = [0, err2, 0];
        count = 0;

        utils.eachSeries(array2, iterator, function(err) {
          assert(err, 'there should have an error');
          assert.equal(count, array2.length - 1, 'iterator should not be called at the last iteration');
          done();
        });
      });

      function iterator(arg, next) {
        count++;
        total += arg;
        var err = (arg instanceof Error) ? arg : null;
        next(err);
      }
    });

    it('utils.extend', function(done) {
      assert('function' == typeof utils.extend, 'utils shoud provide extend() function');

      var source = {};
      var dest = {};
      source.foo = 'FOO';
      dest.bar = 'BAR';
      utils.extend(dest, source);
      assert(source.foo, 'source should have foo property');
      assert(!source.bar, 'source should not have bar property');
      assert(dest.foo, 'destination should have foo property');
      assert(dest.bar, 'destination should have bar property');
      source.foo = 'BAZ';
      assert.equal(source.foo, 'BAZ', 'source should change itself');
      assert.equal(dest.foo, 'FOO', 'source should not change destination');
      dest.bar = 'QUX';
      assert(!source.bar, 'destination should not change source');
      assert.equal(dest.bar, 'QUX', 'destination should change itself');
      done();
    });

    it('utils.clone', function(done) {
      assert('function' == typeof utils.clone, 'utils shoud provide clone() function');

      var source = {};
      source.foo = 'FOO';
      var dest = utils.clone(source);
      dest.bar = 'BAR';
      assert(source.foo, 'source should have foo property');
      assert(!source.bar, 'source should not have bar property');
      assert(dest.foo, 'source should have foo property');
      assert(dest.bar, 'source should have bar property');
      source.foo = 'BAZ';
      assert.equal(source.foo, 'BAZ', 'source should change itself');
      assert.equal(dest.foo, 'FOO', 'source should not change destination');
      dest.bar = 'QUX';
      assert(!source.bar, 'destination should not change source');
      assert.equal(dest.bar, 'QUX', 'destination should change itself');
      done();
    });
  });
}