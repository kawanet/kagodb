/*! storage.js */

/**
 * This mixin provides a dynamic storage dispatching mechanism.
 *
 * @class storage
 * @mixin
 */

var dynamic_mixin = require('../mixin/dynamic_mixin');

module.exports = function() {
  return mixin;

  function mixin() {
    return dynamic_mixin.call(this, 'storage');
  }
};

/**
 * This reads an item.
 *
 * @method KagoDB.prototype.read
 * @param {String} id - item ID
 * @param {Function} callback - function(err, item) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * var collection = new KagoDB();
 *
 * collection.read('foo', function(err, item) {
 *   console.log(item);
 * });
 */

/**
 * This writes an item.
 *
 * @method KagoDB.prototype.write
 * @param {String} id - item ID
 * @param {Object} item - item content
 * @param {Function} callback - function(err) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * var collection = new KagoDB();
 *
 * var item = {
 *   name: 'FOO',
 * };
 * collection.write('foo', item, function(err) {
 *   console.log(err || 'no error');
 * });
 */

/**
 * This erases an item.
 *
 * @method KagoDB.prototype.erase
 * @param {String} id - item ID
 * @param {Function} callback - function(err) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * var collection = new KagoDB();
 *
 * collection.erase('foo', function(err) {
 *   console.log(err || 'no error');
 * });
 */

/**
 * This tests an item existance.
 *
 * @method KagoDB.prototype.exist
 * @param {String} id - item ID
 * @param {Function} callback - function(err, exist) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * var collection = new KagoDB();
 *
 * collection.exist('foo', function(err, exist) {
 *   console.log(exist ? 'exists' : 'not exist');
 * });
 */

/**
 * This lists all item IDs in array.
 *
 * @method KagoDB.prototype.index
 * @param {String} id - item ID
 * @param {Function} callback - function(err, list) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * var collection = new KagoDB();
 *
 * collection.index(function(err, list) {
 *   console.log(list.length + ' items found');
 * });
 */
