/*! core/storage.js */

var StorageBase = '../storage';

var Storages = {
  yaml: require('../storage/yaml'),
  memory: require('../storage/memory')
};

/**
 * @class StorageMixin
 * @mixin
 */

exports.exporter = function() {
  this.read = read;
  this.write = write;
  this.remove = remove;
  this.exists = exists;
  this.keys = keys;
  this.storage = storage;
};

/** reads an item
 * @method StorageMixin.prototype.read
 * @param {String} id - item ID
 * @param {Function} callback - function(err, item) {}
 * @returns collection instance itself for method chaining
 */

function read(id, callback) {
  this.storage().read(id, callback);
  return this;
}

/** writes an item
 * @method StorageMixin.prototype.write
 * @param {String} id - item ID
 * @param {Object} item - item content
 * @param {Function} callback - function(err) {}
 * @returns collection instance itself for method chaining
 */

function write(id, item, callback) {
  this.storage().write(id, item, callback);
  return this;
}

/** removes an item
 * @method StorageMixin.prototype.remove
 * @param {String} id - item ID
 * @param {Function} callback - function(err) {}
 * @returns collection instance itself for method chaining
 */

function remove(id, callback) {
  this.storage().remove(id, callback);
  return this;
}

/** tests an item existance
 * @method StorageMixin.prototype.exists
 * @param {String} id - item ID
 * @param {Function} callback - function(err, exist) {}
 * @returns collection instance itself for method chaining
 */

function exists(id, callback) {
  this.storage().exists(id, callback);
  return this;
}

/** lists a list of all item IDs
 * @method StorageMixin.prototype.remove
 * @param {String} id - item ID
 * @param {Function} callback - function(err, list) {}
 * @returns collection instance itself for method chaining
 */

function keys(callback) {
  this.storage().keys(callback);
  return this;
}

/** gets or sets a storage engine
 * @method StorageMixin.prototype.storage
 * @param {String|Function} [storage] - storage class or storage name
 * @returns storage instance
 */

function storage(storage) {
  // remove storage instance cache
  if (storage) {
    this._storage = null;
  }
  if (!this._storage) {
    storage = storage || this.get('storage');
    if (!storage) {
      throw new Error('storage not specified');
    }
    if ('function' != typeof storage) {
      storage += '';
      if (storage.search(/^[\w\-\.]+$/) < 0) {
        throw new Error('invalid storage name: ' + storage);
      } else {
        var path = StorageBase + '/' + storage;
        try {
          storage = require(path);
        } catch (e) {
          throw new Error('storage class invalid: ' + storage);
        }
        if (!storage) {
          throw new Error('storage class invalid: ' + storage);
        }
      }
    }
    // cache the last storage instance
    this._storage = new storage(this.options);
  }
  return this._storage;
}