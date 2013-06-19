/*! dynamic_storage.js */

/**
 * This mixin provides a dynamic storage engine ispatching mechanism.
 *
 * @class dynamic_storage
 * @mixin
 */

var stub = require('../mixin/stub');
var dynamic_mixin = require('../mixin/dynamic_mixin');

var methods = {
  // common methods
  read: 1,
  write: 1,
  erase: 1,
  exist: 1,
  index: 1,

  // query methods
  find: 1,
  findOne: 1,
  count: 1,
  insert: 1,
  save: 1,
  update: 1,
  findAndModify: 1,
  remove: 1,

  // optional methods
  memory_store: 1,
  file_folder: 1,
  file_suffix: 1,
  http_endpoint: 1,
  http_param: 1,
};

module.exports = function() {
  return function() {
    stub(methods).call(this);
    return dynamic_mixin('storage');
  };
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
