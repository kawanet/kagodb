/*! deny.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');
var deny = KagoDB.bundle.deny;

describe('Deny Mixin:', function() {
  var MyKago = KagoDB.inherit();

  var opts1 = {
    foo: 0,
    bar: 1,
    baz: -1
  };
  MyKago.mixin(deny(opts1));

  var opts2 = {
    qux: 0
  };
  var err2 = new MyError();
  MyKago.mixin(deny(opts2, err2));

  function MyError() {}

  var kago = new MyKago();

  it('refer first agrument as callback', function(done) {
    kago.foo(function(err) {
      assert(err instanceof Error, 'foo() should refer the first argument');
      var threw;
      try {
        kago.foo(null);
      } catch (e) {
        threw = e;
      }
      assert(threw instanceof Error, 'foo() should throw an error');
      done();
    });
  });

  it('refer second agrument as callback', function(done) {
    kago.bar(null, function(err) {
      assert(err instanceof Error, 'bar() should refer the second argument');
      var threw;
      try {
        kago.bar(true, false);
      } catch (e) {
        threw = e;
      }
      assert(threw instanceof Error, 'bar() should throw an error');
      done();
    });
  });

  it('refer last agrument as callback', function(done) {
    kago.baz(function(err) {
      assert(err instanceof Error, 'bar() should refer the last argument: 0');
      kago.baz(null, function(err) {
        assert(err instanceof Error, 'bar() should refer the last argument: 1');
        kago.baz(true, false, function(err) {
          assert(err instanceof Error, 'bar() should refer the last argument: 2');
          var threw;
          try {
            kago.baz();
          } catch (e) {
            threw = e;
          }
          assert(threw instanceof Error, 'baz() should throw an error');
          done();
        });
      });
    });
  });

  it('throw specified error', function(done) {
    kago.qux(function(err) {
      assert(err instanceof MyError, 'qux() should return a specified error');
      var threw;
      try {
        kago.qux();
      } catch (e) {
        threw = e;
      }
      assert(threw instanceof MyError, 'qux() should throw a specified error');
      done();
    });
  });
});