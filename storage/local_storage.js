/*! local_storage.js */

var memory = require('./memory');

module.exports = function() {
  var mixin = memory.call(this);
  mixin.memory_store = memory_store;
  mixin.escape = escape;
  mixin.unescape = unescape;
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

function escape(id) {
  var ns = this.get('namespace');
  id = encodeURIComponent(id);
  if (ns) {
    id = ns + ':' + id;
  }
  return id;
}

function unescape(id) {
  var ns = this.get('namespace');
  if (ns) {
    ns += ':';
    var prelen = ns.length;
    if (id.substr(0, prelen) != ns) {
      return new Error('Invalid ID: ' + id);
    }
    id = id.substr(prelen);
  }
  id = decodeURIComponent(id);
  return id;
}