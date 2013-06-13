/*! mixin.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');

// object-style mixin
var mixin1 = {
  foo: _foo
};

// function-style mixin
var mixin2 = function() {
  this.bar = _bar;
};

// "function which returns an object"-style mixin
var mixin3 = function() {
  return {
    baz: _baz
  };
};

describe('Mixin:', function() {
  mixin_test();
});

function mixin_test() {
  var Parent = KagoDB.inherit();
  Parent.mixin(mixin1);
  Parent.mixin(mixin2);
  Parent.mixin(mixin3);

  var Child = Parent.inherit();
  var Uncle = KagoDB.inherit();

  var parent = new Parent();
  var child = new Child();
  var uncle = new Uncle();

  describe('styles', function() {
    it('object style -', function(done) {
      assert(parent.foo, 'parent should have foo method');
      assert(child.foo, 'child should have foo method');
      assert(!uncle.foo, 'uncle should not have foo method');
      done();
    });

    it('function style -', function(done) {
      assert(parent.bar, 'parent should have bar method');
      assert(child.bar, 'child should have bar method');
      assert(!uncle.bar, 'uncle should not have bar method');
      done();
    });

    it('function&object style -', function(done) {
      assert(parent.baz, 'parent should have baz method');
      assert(child.baz, 'child should have baz method');
      assert(!uncle.baz, 'uncle should not have baz method');
      done();
    });
  });
}

function _foo() {}

function _bar() {}

function _baz() {}