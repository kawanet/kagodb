/*! local_storage.js */

/**
 * This mixin implements a persistence
 * [storage]{@linkcode storage}
 * feature which stores items on web browser's localStorage.
 * On environments which do not support localStorage, such as node.js, this simulates a localStorage but it's volatile.
 *
 * @class local_storage
 * @mixin
 * @see http://dev.w3.org/html5/webstorage/#the-localstorage-attribute
 * @example
 * var opts = {
 *   storage: 'local_storage',
 *   namespace: 'myspace'
 * };
 *
 * var collection = new KagoDB(opts);
 *
 * collection.read('foo', function(err, item){
 *   console.log(item);
 * });
 */

var wrequire = require('wrequire');
var memory = require('./memory');
var localStorage = {};

module.exports = function() {
  var mixin = memory.call(this);
  mixin.memory_store = memory_store;
  mixin.escape = escape;
  mixin.unescape = unescape;
  return mixin;
};

function memory_store() {
  var object = this.get('local_storage');
  object = object || wrequire('localStorage') || localStorage;
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
