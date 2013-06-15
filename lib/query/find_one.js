/*! find_one.js */

/**
 * This mixin provides
 * [findOne()]{@linkcode KagoDB#findOne} method.
 *
 * @class find_one
 * @mixin
 * @example
 * var collection = new KagoDB();
 *
 * // first item
 * collection.findOne({ name: 'Apple' }, function(err, item) {
 *   console.log(item.name, item.price);
 * });
 */

module.exports = function() {
  var mixin = {};
  mixin.findOne = findOne;
  return mixin;
};

/**
 * This invokes a callback function with an item found under specified condition.
 *
 * @method KagoDB.prototype.findOne
 * @param {Function|Object} condition - test function or query selectors
 * @param {Object} [options] - options: sort, skip
 * @param {Function} [callback] - function(err, item) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * collection.findOne({}, function(err, item) {
 *   console.log(item);
 * });
 */

function findOne(condition, options, callback) {
  if ('function' == typeof options && !callback) {
    callback = options;
    options = null;
  }
  options = options || {};
  callback = callback || NOP;

  var cursor = this.find(condition, null, options).limit(1).toArray(function(err, list) {
    if (err) {
      callback(err);
    } else if (list && list.length) {
      var item = list[0];
      callback(null, item);
    } else {
      callback();
    }
  });
  return this;
}

function NOP() {}