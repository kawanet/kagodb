/*! storage/memory.js */

module.exports = StorageMemory;

var SharedStore = {};

function StorageMemory(options) {
  if (!(this instanceof StorageMemory)) return new StorageMemory(options);
  options = options || {};
};

StorageMemory.prototype.read = read;
StorageMemory.prototype.write = write;
StorageMemory.prototype.remove = remove;
StorageMemory.prototype.exists = exists;
StorageMemory.prototype.keys = keys;

function read(id, callback) {
  callback = callback || NOP;
  if (SharedStore.hasOwnProperty(id)) {
    var item = SharedStore[id];
    callback(null, item);
  } else {
    var err = new Error('Item not found');
    callback(err);
  }
}

function write(id, item, callback) {
  callback = callback || NOP;
  SharedStore[id] = item;
  callback();
}

function remove(id, callback) {
  callback = callback || NOP;
  if (SharedStore.hasOwnProperty(id)) {
    delete SharedStore[id];
    callback();
  } else {
    var err = new Error('Item not found');
    callback(err);
  }
}

function exists(id, callback) {
  callback = callback || NOP;
  var exist = SharedStore.hasOwnProperty(id);
  callback(null, exist);
}

function keys(callback) {
  callback = callback || NOP;
  var keys = Object.keys(SharedStore);
  callback(null, keys);
}

function NOP() {}