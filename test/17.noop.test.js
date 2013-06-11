/*! noop.test.js */

var assert = require('chai').assert;
var KagoDB = require('../index');

describe('Noop', function() {
  var opts = {
    storage: 'memory'
  };
  var collection = new KagoDB(opts);
  it('noop()', function(done) {
    assert.equal(collection.noop(), collection, 'should return itself');
    assert(collection.memory_store, 'should invoke a storage mixin');
    done();
  });
});