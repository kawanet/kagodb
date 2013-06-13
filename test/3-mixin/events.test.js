/*! events.test.js */

var assert = require('chai').assert;
var KagoDB = require('../../index');

describe('Events Mixin:', function() {
  events_test();
});

function events_test() {
  describe('emit', function() {
    var kago = KagoDB();

    kago.on('foo', foo);
    kago.on('bar', bar);
    kago.on('baz', baz);
    kago.on('barz', bar);
    kago.on('barz', baz);
    kago.once('qux', qux);

    it('first emit', function(done) {
      kago.emit('foo');
      kago.emit('bar');
      kago.emit('baz');
      kago.emit('barz');
      kago.emit('qux');
      assert.equal(foo.count, 1, 'foo should be fired once');
      assert.equal(bar.count, 2, 'bar should be fired twice');
      assert.equal(baz.count, 2, 'baz should be fired twice');
      assert.equal(qux.count, 1, 'qux should be fired once');
      done();
    });

    it('second emit', function(done) {
      kago.emit('foo');
      kago.emit('bar');
      kago.emit('baz');
      kago.emit('barz');
      kago.emit('qux');
      assert.equal(foo.count, 2, 'foo should be fired twice');
      assert.equal(bar.count, 4, 'bar should be fired four times');
      assert.equal(baz.count, 4, 'baz should be fired four times');
      assert.equal(qux.count, 1, 'qux should be fired once');
      done();
    });

    it('third emit after some off()', function(done) {
      kago.off('foo', foo);
      kago.off('bar');
      kago.emit('foo');
      kago.emit('bar');
      kago.emit('baz');
      kago.emit('barz');
      assert.equal(foo.count, 2, 'foo should not be fired');
      assert.equal(bar.count, 5, 'bar should be fired once more');
      assert.equal(baz.count, 6, 'baz should be fired again');
      done();
    });

    it('fourth emit after all off()', function(done) {
      kago.off();
      kago.emit('bar');
      kago.emit('baz');
      kago.emit('barz');
      assert.equal(bar.count, 5, 'bar should not be fired');
      assert.equal(baz.count, 6, 'baz should not be fired');
      done();
    });

    it('emit with arguments', function(done) {
      kago.on('quux', quux);
      kago.emit('quux');
      assert.equal(quux.args.length, 0, 'no arguments');

      kago.emit('quux', 'hoge');
      assert.equal(quux.args.length, 1, 'one argument');
      assert.equal(quux.args[0], 'hoge', 'first argument');

      kago.emit('quux', 'hoge', 'pomu');
      assert.equal(quux.args.length, 2, 'two arguments');
      assert.equal(quux.args[0], 'hoge', 'first argument');
      assert.equal(quux.args[1], 'pomu', 'second argument');
      done();
    });
  });
}

function foo() {
  foo.count = (foo.count || 0) + 1;
}

function bar() {
  bar.count = (bar.count || 0) + 1;
}

function baz() {
  baz.count = (baz.count || 0) + 1;
}

function qux() {
  qux.count = (qux.count || 0) + 1;
}

function quux() {
  quux.args = Array.prototype.slice.call(arguments);
}