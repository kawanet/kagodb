/*! storage.js */

/** This mixin provides storage() method as well as low-level CRUD methods: write(), read(), erase(), exist(), index().
 * @class StorageMixin
 * @mixin
 */

var dynamic_mixin = require('../core/dynamic_mixin');

var opts = {
  layer: 'storage',
  basepath: '../storage',
  preload: 'storage_preload'
};

module.exports = function() {
  return mixin;

  function mixin() {
    this.read = this.read || read;
    this.write = this.write || write;
    this.erase = this.erase || erase;
    this.exist = this.exist || exist;
    this.index = this.index || index;
    return dynamic_mixin.call(this, opts);
  }
};

/** This reads an item.
 * @method StorageMixin.prototype.read
 * @param {String} id - item ID
 * @param {Function} callback - function(err, item) {}
 * @returns {KagoDB} collection instance itself for method chaining
 */

function read(id, callback) {
  throw new Error('method not implemented: read');
}

/** This writes an item.
 * @method StorageMixin.prototype.write
 * @param {String} id - item ID
 * @param {Object} item - item content
 * @param {Function} callback - function(err) {}
 * @returns {KagoDB} collection instance itself for method chaining
 */

function write(id, item, callback) {
  throw new Error('method not implemented: write');
}

/** This erases an item.
 * @method StorageMixin.prototype.erase
 * @param {String} id - item ID
 * @param {Function} callback - function(err) {}
 * @returns {KagoDB} collection instance itself for method chaining
 */

function erase(id, callback) {
  throw new Error('method not implemented: erase');
}

/** This tests an item existance.
 * @method StorageMixin.prototype.exist
 * @param {String} id - item ID
 * @param {Function} callback - function(err, exist) {}
 * @returns {KagoDB} collection instance itself for method chaining
 */

function exist(id, callback) {
  throw new Error('method not implemented: exist');
}

/** This lists all item IDs in array.
 * @method StorageMixin.prototype.erase
 * @param {String} id - item ID
 * @param {Function} callback - function(err, list) {}
 * @returns {KagoDB} collection instance itself for method chaining
 */

function index(callback) {
  throw new Error('method not implemented: index');
}