/*! find.js */

var Cursor = require('../core/cursor');
var SortOp = require('../op/sort_op');

/**
 * This mixin provides
 * [find()]{@linkcode KagoDB#find},
 * [findOne()]{@linkcode KagoDB#findOne} and
 * [count()]{@linkcode KagoDB#count} methods.
 *
 * @class find
 * @mixin
 * @example
 * var collection = new KagoDB();
 *
 * // all items
 * collection.find().toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item.name, item.price);
 *   });
 * });
 *
 * // first item
 * collection.findOne({ name: 'Apple' }, function(err, item) {
 *   console.log(item.name, item.price);
 * });
 *
 * // count item
 * collection.count({ category: 'fruit' }, function(err, count) {
 *   console.log(count);
 * });
 */

module.exports = function() {
  var mixin = {};
  mixin.find = find;
  mixin.findOne = findOne;
  mixin.count = count;
  return mixin;
};

/**
 * This creates a cursor object with condition given as a test function or query parameters.
 * Null condition will find all items in the collection
 *
 * @method KagoDB.prototype.find
 * @param {Function|Object} condition - test function or query selectors
 * @param {Function|Object} projection - map function or output fields
 * @param {Object} [options] - options: sort, skip, limit, fields
 * @returns {Cursor} cursor instance
 * @example
 * var collection = new KagoDB();
 *
 * // all items
 * collection.find().toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item.name, item.price);
 *   });
 * });
 *
 * // condition using a test function
 * var test = function(item) {
 *   return item.price > 100;
 * };
 * collection.find(test).toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item.name, item.price);
 *   });
 * });
 *
 * // condition using query parameters
 * var cond = {
 *   name: 'Apple'
 * };
 * collection.find(cond).toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item.name, item.price);
 *   });
 * });
 *
 * // projection
 * var proj = {
 *   name: 1,
 *   price: 1
 * };
 * collection.find({}, proj).toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item.name, item.price);
 *   });
 * });
 */

function find(condition, projection, options) {
  options = options || {};
  if (options.fields) {
    projection = options.fields;
  }
  var cursor = new Cursor(this, condition, projection);
  if (options.sort) {
    cursor.sort(options.sort);
  }
  if (options.skip) {
    cursor.offset(options.skip);
  }
  if (options.limit) {
    cursor.limit(options.limit);
  }
  return cursor;
}

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