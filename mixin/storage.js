/*! storage.js */

var StorageBase = '../storage';

/** This mixin provides storage() method as well as low-level CRUD methods: write(), read(), erase(), exist(), index().
 * @class StorageMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.read = read;
  mixin.write = write;
  mixin.erase = erase;
  mixin.exist = exist;
  mixin.index = index;
  mixin.storage = storage;
  return mixin;
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

/** This applies a storage mixin specified at 'storage' property.
 * @method StorageMixin.prototype.storage
 * @param {Function|String} [store] - storage mixin or storage name
 * @returns {KagoDB} this instance itself for method chaining
 */

function storage(store) {
  store = store || this.get('storage');
  if (!store) {
    throw new Error('storage not specified');
  }

  var name = store + '';
  if ('function' != typeof store) {
    var preload = this.get('storage-preload') || {};
    if (preload[name]) {
      store = preload[name];
    } else if (name.search(/^[\w\-\.]+$/) < 0) {
      throw new Error('invalid store name: ' + name);
    } else {
      try {
        store = require(StorageBase + '/' + name);
      } catch (err) {
        throw new Error('storage class failed: ' + err);
      }
      if (!store) {
        throw new Error('storage class invalid: ' + name);
      }
    }
  }
  var mixin = store();
  if (!mixin.read) {
    throw new Error('storage has no read() method: ' + name);
  }
  if (!mixin.write) {
    throw new Error('storage has no write() method: ' + name);
  }
  if (!mixin.erase) {
    throw new Error('storage has no erase() method: ' + name);
  }
  if (!mixin.exist) {
    throw new Error('storage has no exist() method: ' + name);
  }
  if (!mixin.index) {
    throw new Error('storage has no index() method: ' + name);
  }
  this.mixin(mixin);
  return this;
}