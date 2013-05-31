/*! storage/memory.js */

module.exports = StorageMemory;

var Stores = {};

function StorageMemory(options) {
  if (!(this instanceof StorageMemory)) return new StorageMemory(options);
  this.options = options || {};
  this.options.namespace = this.options.namespace || 'default';
}

StorageMemory.prototype.read = read;
StorageMemory.prototype.write = write;
StorageMemory.prototype.remove = remove;
StorageMemory.prototype.exists = exists;
StorageMemory.prototype.keys = keys;

function read(id, callback) {
  callback = callback || NOP;
  var store = Stores[this.options.namespace] || (Stores[this.options.namespace] = {});
  if (store.hasOwnProperty(id)) {
    var item = store[id];
    callback(null, item);
  } else {
    var err = new Error('Item not found');
    callback(err);
  }
}

function write(id, item, callback) {
  callback = callback || NOP;
  var store = Stores[this.options.namespace] || (Stores[this.options.namespace] = {});
  store[id] = item;
  callback();
}

function remove(id, callback) {
  callback = callback || NOP;
  var store = Stores[this.options.namespace] || (Stores[this.options.namespace] = {});
  if (store.hasOwnProperty(id)) {
    delete store[id];
    callback();
  } else {
    var err = new Error('Item not found');
    callback(err);
  }
}

function exists(id, callback) {
  callback = callback || NOP;
  var store = Stores[this.options.namespace] || (Stores[this.options.namespace] = {});
  var exist = store.hasOwnProperty(id);
  callback(null, exist);
}

function keys(callback) {
  callback = callback || NOP;
  var store = Stores[this.options.namespace] || (Stores[this.options.namespace] = {});
  var list = Object.keys(store);
  callback(null, list);
}

function NOP() {}