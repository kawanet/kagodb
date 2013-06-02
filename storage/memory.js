/*! memory.js */

module.exports = function() {
  var mixin = {};
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;
  mixin.memory_store = memory_store;
  return mixin;
};

var default_encode = JSON.stringify;
var default_decode = JSON.parse;

function read(id, callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  var serial = this._memory_serialize || (this._memory_serialize = this.get('memory_serialize') ? 1 : -1);
  if (serial > 0 && !this._memory_decode) {
    this._memory_decode = this.get('memory_decode') || default_decode;
  }
  if (store.hasOwnProperty(id)) {
    var item = store[id];
    if (this._memory_decode) {
      item = this._memory_decode(item);
    }
    callback(null, item);
  } else {
    var err = new Error('Item not found');
    callback(err, null);
  }
}

function write(id, item, callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  var serial = this._memory_serialize || (this._memory_serialize = this.get('memory_serialize') ? 1 : -1);
  if (serial > 0 && !this._memory_encode) {
    this._memory_encode = this.get('memory_encode') || default_encode;
  }
  if (this._memory_encode) {
    item = this._memory_encode(item);
  }
  store[id] = item;
  callback();
}

function erase(id, callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  if (store.hasOwnProperty(id)) {
    delete store[id];
    callback();
  } else {
    var err = new Error('Item not found');
    callback(err);
  }
}

function exist(id, callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  var exists = store.hasOwnProperty(id);
  callback(null, exists);
}

function index(callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  var list = Object.keys(store);
  callback(null, list);
}

var SharedStore = {};

function memory_store() {
  var ns = this.get('namespace');
  var object;
  if (ns) {
    // memory shared in a process
    object = SharedStore[ns] || (SharedStore[ns] = {});
  } else {
    // volatile memory available only in a instance
    object = {};
  }
  return object;
}

function NOP() {}