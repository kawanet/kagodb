/*! inherit.test.js */

var assert = require('chai').assert;
var _base = require('../../lib/core/base');
var _default = require('../../bundle/default');
var _browser = require('../../bundle/browser');

describe('Inherit:', function() {
  inherit_test('base', _base);
  inherit_test('default', _default);
  inherit_test('browser', _browser);
});

function inherit_test(name, KagoDB) {
  describe(name, function() {

    var Parent = KagoDB.inherit({foo: 'FOO'});

    // add a method before inheriting again
    Parent.prototype.test1 = function() {};

    var Child = Parent.inherit('bar', 'BAR');
    Child.prototype.test2 = function() {};

    // add another method after inheriting
    Parent.prototype.test3 = function() {};

    var Uncle = KagoDB.inherit();

    var kago = new KagoDB();
    var parent = new Parent();
    var child = new Child();
    var uncle = new Uncle();

    it('root class', function(done) {
      assert(!kago.test1, 'should not have test1 method');
      assert(!kago.test2, 'should not have test2 method');
      assert(!kago.test3, 'should not have test3 method');
      assert(!kago.get('foo'), 'should not have foo option');
      assert(!kago.get('bar'), 'should not have bar option');
      done();
    });

    it('parent class', function(done) {
      assert(parent.test1, 'should have test1 method');
      assert(!parent.test2, 'should not have test2 method');
      assert(parent.test3, 'should have test3 method');
      assert(parent.get('foo'), 'should have foo option');
      assert(!parent.get('bar'), 'should not have bar option');
      done();
    });

    it('child class', function(done) {
      assert(child.test1, 'should have test1 method');
      assert(child.test2, 'should have test2 method');
      assert(child.test3, 'should have test3 method');
      assert(child.get('foo'), 'should have foo option');
      assert(child.get('bar'), 'should have bar option');
      done();
    });

    it('uncle class', function(done) {
      assert(!uncle.test1, 'should not have test1 method');
      assert(!uncle.test2, 'should not have test2 method');
      assert(!uncle.test3, 'should not have test3 method');
      assert(!uncle.get('foo'), 'should have foo option');
      assert(!uncle.get('bar'), 'should have bar option');
      done();
    });
  });
}