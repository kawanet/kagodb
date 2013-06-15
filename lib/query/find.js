/*! find.js */

var Cursor = require('../core/cursor');
var SortOp = require('../op/sort_op');

/**
 * This mixin provides
 * [find()]{@linkcode KagoDB#find} method.
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
 */

module.exports = function() {
  var mixin = {};
  mixin.find = find;
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
