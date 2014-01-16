/*! http_param.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index').inherit();
KagoDB.mixin(KagoDB.bundle.ajax);

describe('http_param:', function() {
  http_param_test();
});

function http_param_test() {
  var Parent = KagoDB.inherit();
  Parent.set('http_param', {'foo': 'FOO'});

  var Child = Parent.inherit();
  var Uncle = KagoDB.inherit();

  var parent = new Parent();
  var child = new Child();
  var uncle = new Uncle();

  parent.http_param('garply', 'Garply');
  child.http_param('waldo', 'Waldo');
  uncle.http_param('fred', 'Fred');

  describe('Instance settings', function() {
    it('parent instance', function(done) {
      var param = parent.http_param();
      assert.equal(typeof param, 'object');
      assert(parent.http_param('foo'), 'should have foo');
      assert(parent.http_param('garply'), 'should have garply');
      assert(!parent.http_param('waldo'), 'should not have waldo');
      assert(!parent.http_param('fred'), 'should not have fred');
      assert(param.foo, 'should have foo');
      assert(param.garply, 'should have garply');
      assert(!param.waldo, 'should not have waldo');
      assert(!param.fred, 'should not have fred');
      done();
    });

    it('child instance', function(done) {
      var param = child.http_param();
      assert.equal(typeof param, 'object');
      assert(child.http_param('foo'), 'should have foo');
      assert(!child.http_param('garply'), 'should not have garply');
      assert(child.http_param('waldo'), 'should have waldo');
      assert(!child.http_param('fred'), 'should not have fred');
      assert(param.foo, 'should have foo');
      assert(!param.garply, 'should not have garply');
      assert(param.waldo, 'should have waldo');
      assert(!param.fred, 'should not have fred');
      done();
    });

    it('uncle instance', function(done) {
      var param = uncle.http_param();
      assert.equal(typeof param, 'object');
      assert(!uncle.http_param('foo'), 'should not have foo');
      assert(!uncle.http_param('garply'), 'should not have garply');
      assert(!uncle.http_param('waldo'), 'should not have waldo');
      assert(uncle.http_param('fred'), 'should have fred');
      assert(!param.foo, 'should not have foo');
      assert(!param.garply, 'should not have garply');
      assert(!param.waldo, 'should not have waldo');
      assert(param.fred, 'should have fred');
      done();
    });
  });
}