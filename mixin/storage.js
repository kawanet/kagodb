/*! storage.js */

var StorageBase = '../storage';

/** This mixin provides storage() method as well as CRUD methods: write(), read(), remove(), exists(), keys().
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

/** This reads an item.
 * @method StorageMixin.prototype.read
 * @param {String} id - item ID
 * @param {Function} callback - function(err, item) {}
 * @returns collection instance itself for method chaining
 */

function read(id, callback) {
  this.storage().read(id, callback);
  return this;
}

/** This writes an item.
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

/** This removes an item.
 * @method StorageMixin.prototype.remove
 * @param {String} id - item ID
 * @param {Function} callback - function(err) {}
 * @returns collection instance itself for method chaining
 */

function remove(id, callback) {
  this.storage().remove(id, callback);
  return this;
}

/** This tests an item existance.
 * @method StorageMixin.prototype.exists
 * @param {String} id - item ID
 * @param {Function} callback - function(err, exist) {}
 * @returns collection instance itself for method chaining
 */

function exists(id, callback) {
  this.storage().exists(id, callback);
  return this;
}

/** This lists all item IDs in array.
 * @method StorageMixin.prototype.remove
 * @param {String} id - item ID
 * @param {Function} callback - function(err, list) {}
 * @returns collection instance itself for method chaining
 */

function keys(callback) {
  this.storage().keys(callback);
  return this;
}

/** This gets or sets a storage engine.
 * @method StorageMixin.prototype.storage
 * @param {Function|String} [store] - storage class or storage name
 * @returns storage instance
 */

function storage(store) {
  // remove store instance cache
  if (store) {
    this._store = null;
  }
  if (!this._store) {
    store = store || this.get('storage');
    if (!store) {
      throw new Error('storage not specified');
    }
    if ('function' != typeof store) {
      store += '';
      if (store.search(/^[\w\-\.]+$/) < 0) {
        throw new Error('invalid store name: ' + store);
      } else {
        var path = StorageBase + '/' + store;
        try {
          store = require(path);
        } catch (e) {
          throw new Error('storage class invalid: ' + store);
        }
        if (!store) {
          throw new Error('storage class invalid: ' + store);
        }
      }
    }
    // cache the last store instance
    this._store = new store(this.options);
  }
  return this._store;
}