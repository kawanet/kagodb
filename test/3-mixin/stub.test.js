/*! stub.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');
var stub = KagoDB.bundle.stub;

describe('Stub Mixin:', function() {

  var methods1 = {
    foo: 1,
    bar: 1
  };

  var methods2 = {
    foo: function() {
      return 'FOO';
    },
    bar: function() {
      return 'BAR';
    }
  };

  var MyKagoNg = KagoDB.inherit();
  MyKagoNg.mixin(stub(methods1));

  var MyKagoOk = KagoDB.inherit();
  MyKagoOk.mixin(stub(methods2));

  // this mixin should be ignored as methods are already implemented
  var MyKagoNgOk = MyKagoNg.inherit();
  MyKagoNgOk.mixin(stub(methods2));

  var MyKagoOkNg = MyKagoOk.inherit();
  MyKagoOkNg.mixin(stub(methods1));

  // mixin could still be overridable
  var MyKagoNgOkOk = MyKagoNgOk.inherit();
  MyKagoNgOkOk.mixin(methods2);

  it('MyKagoNg with error', tests_for_error(MyKagoNg));
  it('MyKagoNgOk with error', tests_for_error(MyKagoNgOk));
  it('MyKagoOk no error', tests_no_error(MyKagoOk));
  it('MyKagoOkNg no error', tests_no_error(MyKagoOkNg));
  it('MyKagoNgOkOk no error', tests_no_error(MyKagoNgOkOk));
});

function tests_for_error(Kago) {
  return function(done) {
    var kago = new Kago();
    assert(kago.foo, 'should have foo property');
    assert(kago.bar, 'should have bar property');
    assert.equal(typeof kago.foo, 'function', 'should have foo() method');
    assert.equal(typeof kago.bar, 'function', 'should have bar() method');
    assert(check_error(kago.foo, kago), 'foo() should throw exception');
    assert(check_error(kago.bar, kago), 'bar() should throw exception');
    done();
  };
}

function check_error(func, that) {
  try {
    func.call(that);
  } catch (err) {
    return err;
  }
}

function tests_no_error(Kago) {
  return function(done) {
    var kago = new Kago();
    assert(kago.foo, 'should have foo property');
    assert(kago.bar, 'should have bar property');
    assert.equal(typeof kago.foo, 'function', 'should have foo() method');
    assert.equal(typeof kago.bar, 'function', 'should have bar() method');
    assert.notOk(check_error(kago.foo, kago), 'foo() should not throw exception');
    assert.notOk(check_error(kago.bar, kago), 'bar() should not throw exception');
    assert.equal(kago.foo(), 'FOO', 'foo() should return "FOO"');
    assert.equal(kago.bar(), 'BAR', 'bar() should return "BAR"');
    done();
  };
}
