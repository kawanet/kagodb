/*! count.js */

/**
 * This mixin provides
 * [count()]{@linkcode KagoDB#count} method.
 *
 * @class count
 * @mixin
 * @example
 * var collection = new KagoDB();
 *
 * // count item
 * collection.count({ category: 'fruit' }, function(err, count) {
 *   console.log(count);
 * });
 */

module.exports = function() {
  var mixin = {};
  mixin.count = count;
  return mixin;
};

/**
 * This counts number of items matched with condition.
 *
 * @method KagoDB.prototype.count
 * @param condition - same as find() method
 * @param {Object} [options] - options: skip, limit
 * @param {Function} callback - function(err, cursor) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * collection.find().count(function(err, count) {
 *   console.log(count);
 * });
 */

function count(condition, options, callback) {
  if ('function' == typeof options && !callback) {
    callback = options;
    options = null;
  }
  options = options || {};
  callback = callback || NOP;

  this.find(condition, null, options).count(callback);
  return this;
}

function NOP() {}