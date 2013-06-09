/*! getset.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');

describe('get() and set() tests:', function() {
  getset_test();
});

function getset_test() {
  var Parent = KagoDB.inherit();
  Parent.set('foo', 'FOO');

  var Child = Parent.inherit();
  Child.set('bar', 'BAR');

  var Uncle = KagoDB.inherit();
  Uncle.set('baz', 'BAZ');

  var parent = new Parent();
  var child = new Child();
  var uncle = new Uncle();

  parent.set('garply', 'Garply');
  child.set('waldo', 'Waldo');
  uncle.set('fred', 'Fred');

  describe('Class settings', function() {
    it('Parent class', function(done) {
      assert(Parent.get('foo'), 'should have foo');
      assert(!Parent.get('bar'), 'should not have bar');
      assert(!Parent.get('baz'), 'should not have baz');
      assert(!Parent.get('garply'), 'should not have garply');
      assert(!Parent.get('waldo'), 'should not have waldo');
      assert(!Parent.get('fred'), 'should not have fred');
      done();
    });

    it('Child class', function(done) {
      assert(Child.get('foo'), 'should have foo');
      assert(Child.get('bar'), 'should have bar');
      assert(!Child.get('baz'), 'should not have baz');
      assert(!Child.get('garply'), 'should not have garply');
      assert(!Child.get('waldo'), 'should not have waldo');
      assert(!Child.get('fred'), 'should not have fred');
      done();
    });

    it('Uncle class', function(done) {
      assert(!Uncle.get('foo'), 'should not have foo');
      assert(!Uncle.get('bar'), 'should not have bar');
      assert(Uncle.get('baz'), 'should have baz');
      assert(!Uncle.get('garply'), 'should not have garply');
      assert(!Uncle.get('waldo'), 'should not have waldo');
      assert(!Uncle.get('fred'), 'should not have fred');
      done();
    });
  });

  describe('Instance settings', function() {
    it('parent instance', function(done) {
      assert(parent.get('foo'), 'should have foo');
      assert(!parent.get('bar'), 'should not have bar');
      assert(!parent.get('baz'), 'should not have baz');
      assert(parent.get('garply'), 'should have garply');
      assert(!parent.get('waldo'), 'should not have waldo');
      assert(!parent.get('fred'), 'should not have fred');
      done();
    });

    it('child instance', function(done) {
      assert(child.get('foo'), 'should have foo');
      assert(child.get('bar'), 'should have bar');
      assert(!child.get('baz'), 'should not have baz');
      assert(!child.get('garply'), 'should not have garply');
      assert(child.get('waldo'), 'should have waldo');
      assert(!child.get('fred'), 'should not have fred');
      done();
    });

    it('uncle instance', function(done) {
      assert(!uncle.get('foo'), 'should not have foo');
      assert(!uncle.get('bar'), 'should not have bar');
      assert(uncle.get('baz'), 'should have baz');
      assert(!uncle.get('garply'), 'should not have garply');
      assert(!uncle.get('waldo'), 'should not have waldo');
      assert(uncle.get('fred'), 'should have fred');
      done();
    });
  });
}