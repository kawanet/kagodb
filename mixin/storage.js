/*! storage.js */

var StorageBase = '../storage';

/** This mixin provides storage() method as well as low-level CRUD methods: write(), read(), erase(), exist(), index().
 * @class StorageMixin
 * @mixin
 */

module.exports = function() {
  this.read = read;
  this.write = write;
  this.erase = erase;
  this.exist = exist;
  this.index = index;
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

/** This erases an item.
 * @method StorageMixin.prototype.erase
 * @param {String} id - item ID
 * @param {Function} callback - function(err) {}
 * @returns collection instance itself for method chaining
 */

function erase(id, callback) {
  this.storage().erase(id, callback);
  return this;
}

/** This tests an item existance.
 * @method StorageMixin.prototype.exist
 * @param {String} id - item ID
 * @param {Function} callback - function(err, exist) {}
 * @returns collection instance itself for method chaining
 */

function exist(id, callback) {
  this.storage().exist(id, callback);
  return this;
}

/** This lists all item IDs in array.
 * @method StorageMixin.prototype.erase
 * @param {String} id - item ID
 * @param {Function} callback - function(err, list) {}
 * @returns collection instance itself for method chaining
 */

function index(callback) {
  this.storage().index(callback);
  return this;
}

/** This gets or sets a storage engine.
 * @method StorageMixin.prototype.storage
 * @param {Function|String} [store] - storage class or storage name
 * @returns storage instance
 */

function storage(store) {
  // erase store instance cache
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
      var preload = this.get('storage-preload') || {};
      if (preload[store]) {
        store = preload[store];
      } else if (store.search(/^[\w\-\.]+$/) < 0) {
        throw new Error('invalid store name: ' + store);
      } else {
        var path = StorageBase + '/' + store;
        try {
          store = require(path);
        } catch (err) {
          throw new Error('storage class failed: ' + err);
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
