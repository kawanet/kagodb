/*! memory.js */

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
  var ns = this.options.namespace;
  var store = Stores[ns] || (Stores[ns] = {});
  if (store.hasOwnProperty(id)) {
    var item = store[id];
    callback(null, item);
  } else {
    var err = new Error('Item not found');
    callback(err, null);
  }
}

function write(id, item, callback) {
  callback = callback || NOP;
  var ns = this.options.namespace;
  var store = Stores[ns] || (Stores[ns] = {});
  store[id] = item;
  callback();
}

function remove(id, callback) {
  callback = callback || NOP;
  var ns = this.options.namespace;
  var store = Stores[ns] || (Stores[ns] = {});
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
  var ns = this.options.namespace;
  var store = Stores[ns] || (Stores[ns] = {});
  var exist = store.hasOwnProperty(id);
  callback(null, exist);
}

function keys(callback) {
  callback = callback || NOP;
  var ns = this.options.namespace;
  var store = Stores[ns] || (Stores[ns] = {});
  var list = Object.keys(store);
  callback(null, list);
}

function NOP() {}