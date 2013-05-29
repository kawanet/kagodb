/*! core/storage.js */

var Storages = {
  yaml: require('../storage/yaml'),
  memory: require('../storage/memory')
};

/**
 * @class StorageMixin
 * @mixin
 */

module.exports = function() {
  this.read = read;
  this.write = write;
  this.remove = remove;
  this.exists = exists;
  this.keys = keys;
  this.storage = storage;
};

function read(id, callback) {
  this.storage().read(id, callback);
}

function write(id, item, callback) {
  this.storage().write(id, item, callback);
}

function remove(id, callback) {
  this.storage().remove(id, callback);
}

function exists(id, callback) {
  this.storage().exists(id, callback);
}

function keys(callback) {
  this.storage().keys(callback);
}

/** storage getter/setter
 * @method StorageMixin.prototype.storage
 * @param storage - storage
 * @returns storage class instance
 */

function storage(storage) {
  if (arguments.length) {
    this._storage = storage;
  } else {
    storage = this._storage;
    if (!storage) {
      var storageName = this.get('storage');
      if (!storageName) {
        throw new Error('storage name not specified');
      }
      var storageClass = Storages[storageName];
      if (!storageClass) {
        throw new Error('storage class invalid: ' + storageName);
      }
      storage = new storageClass(this.options);
      this._storage = storage;
    }
  }
  return storage;
}