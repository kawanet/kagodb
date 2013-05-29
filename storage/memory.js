/*! storage/memory.js */

module.exports = StorageMemory;

function StorageMemory(options) {
  if (!(this instanceof StorageMemory)) return new StorageMemory(options);
  options = options || {};
  this.store = {};
};

StorageMemory.prototype.read = read;
StorageMemory.prototype.write = write;
StorageMemory.prototype.remove = remove;
StorageMemory.prototype.exists = exists;
StorageMemory.prototype.keys = keys;

function read(id, callback) {
  callback = callback || NOP;
  if (this.store.hasOwnProperty(id)) {
    var item = this.store[id];
    callback(null, item);
  } else {
    var err = new Error('Item not found');
    callback(err);
  }
}

function write(id, item, callback) {
  callback = callback || NOP;
  this.store[id] = item;
  callback();
}

function remove(id, callback) {
  callback = callback || NOP;
  if (this.store.hasOwnProperty(id)) {
    delete this.store[id];
    callback();
  } else {
    var err = new Error('Item not found');
    callback(err);
  }
}

function exists(id, callback) {
  callback = callback || NOP;
  var exist = this.store.hasOwnProperty(id);
  callback(null, exist);
}

function keys(callback) {
  callback = callback || NOP;
  var keys = Object.keys(this.store);
  callback(null, keys);
}

function NOP() {}