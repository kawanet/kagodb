/*! memory.js */

module.exports = StorageMemory;

var SharedStore = {};

function StorageMemory(options) {
  if (!(this instanceof StorageMemory)) return new StorageMemory(options);
  this.options = options || {};
  this.options.namespace = this.options.namespace || 'default';
}

StorageMemory.prototype.read = read;
StorageMemory.prototype.write = write;
StorageMemory.prototype.erase = erase;
StorageMemory.prototype.exist = exist;
StorageMemory.prototype.index = index;

function read(id, callback) {
  callback = callback || NOP;
  var store = this._store || this.store();
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
  var store = this._store || this.store();
  store[id] = item;
  callback();
}

function erase(id, callback) {
  callback = callback || NOP;
  var store = this._store || this.store();
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
  var store = this._store || this.store();
  var exists = store.hasOwnProperty(id);
  callback(null, exists);
}

function index(callback) {
  callback = callback || NOP;
  var store = this._store || this.store();
  var list = Object.keys(store);
  callback(null, list);
}

StorageMemory.prototype.store = function() {
  var ns, store;
  if (!this._store) {
    if (ns = this.options.namespace) {
      store = SharedStore[ns] || (SharedStore[ns] = {}); // shared memory in a process
    } else {
      store = {}; // volatile memory available only in a instance
    }
    this._store = store;
  }
  return this._store;
};

function NOP() {}
