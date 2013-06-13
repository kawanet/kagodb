/*! bundle.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');

describe('Bundle:', function() {
  var Parent = KagoDB.inherit();
  Parent.bundle.foo = foo;

  var Child = Parent.inherit();
  Child.bundle.bar = bar;

  var Uncle = KagoDB.inherit();
  Uncle.bundle.baz = baz;

  function foo() {}

  function bar() {}

  function baz() {}

  it('inherit()', function(done) {
    assert.equal(Parent.bundle.foo, foo, 'Parent should have foo');
    assert.equal(Child.bundle.foo, foo, 'Parent should have foo');
    assert(!Uncle.bundle.foo, 'Uncle should not have foo');

    assert(!Parent.bundle.bar, 'Parent should not have bar');
    assert.equal(Child.bundle.bar, bar, 'Parent should have bar');
    assert(!Uncle.bundle.bar, 'Uncle should not have bar');

    assert(!Parent.bundle.baz, 'Parent should not have baz');
    assert(!Child.bundle.baz, 'Parent should not have baz');
    assert.equal(Uncle.bundle.baz, baz, 'Uncle should have baz');
    done();
  });
});