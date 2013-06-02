/*! local_storage.js */

var memory = require('./memory');

module.exports = function() {
  var mixin = memory.call(this);
  mixin.memory_store = memory_store;
  return mixin;
};

function memory_store() {
  this._memory_serialize = 1;
  var object = this.get('local_storage');
  if (!object) {
    throw new Error('Please .set("local_storage", window.localStorage || {}) before using this.');
  }
  return object;
}
