/*! memory.js */

var encode = require('../core/encode');

module.exports = function() {
  var mixin = encode.call(this);
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;
  mixin.memory_store = memory_store;
  return mixin;
};

function read(id, callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  var serial = this._memory_serialize || (this._memory_serialize = this.get('memory_serialize') ? 1 : -1);
  if (serial > 0 && this.escape) {
    id = this.escape(id);
  }
  if (store.hasOwnProperty(id) && this.decode) {
    var item = store[id];
    if (serial > 0) {
      this.decode(item, callback);
    } else {
      callback(null, item);
    }
  } else {
    var err = new Error('Item not found');
    callback(err, null);
  }
}

function write(id, item, callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  var serial = this._memory_serialize || (this._memory_serialize = this.get('memory_serialize') ? 1 : -1);
  if (serial > 0 && this.escape) {
    id = this.escape(id);
  }
  if (serial > 0 && this.encode) {
    this.encode(item, function(err, item) {
      if (!err) {
        store[id] = item;
      }
      callback(err);
    });
  } else {
    store[id] = item;
    callback();
  }
}

function erase(id, callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  var serial = this._memory_serialize || (this._memory_serialize = this.get('memory_serialize') ? 1 : -1);
  if (serial > 0 && this.escape) {
    id = this.escape(id);
  }
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
  var serial = this._memory_serialize || (this._memory_serialize = this.get('memory_serialize') ? 1 : -1);
  if (serial > 0 && this.escape) {
    id = this.escape(id);
  }
  var exists = store.hasOwnProperty(id);
  callback(null, exists);
}

function index(callback) {
  callback = callback || NOP;
  var store = this._memory_store || (this._memory_store = this.memory_store());
  var serial = this._memory_serialize || (this._memory_serialize = this.get('memory_serialize') ? 1 : -1);
  var list = Object.keys(store);
  if (serial > 0 && this.unescape) {
    var unescape = this.unescape.bind(this);
    list = list.map(unescape);
    list = list.filter(function(id) {
      return !(id instanceof Error);
    });
  }
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