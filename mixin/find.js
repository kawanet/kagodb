/*! find.js */

var Cursor = require('../core/cursor');
var Condition = require('../core/condition');
var Projection = require('../core/projection');

/** This mixin provides find(), findOne() and count() methods.
 * @class FindMixin
 * @mixin
 */

module.exports = function() {
  var mixin = {};
  mixin.find = find;
  mixin.findOne = findOne;
  mixin.count = count;
  return mixin;
};

/** This creates a cursor object with condition given as a test function or query parameters.
 * Null condition will find all items in the collection
 * @method FindMixin.prototype.find
 * @param {Function|Object} condition - test function or query parameters
 * @param {Function|Object} projection - map function or output properties
 * @returns {Cursor} cursor instance
 * @example
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
 *   name: "Apple"
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

function find(condition, projection) {
  // parse condition
  var condParser = this.get('condition_parser') || Condition.parser;
  if ('function' != typeof condParser) {
    throw new Error('invalid condition parser: ' + condParser);
  }
  var parserFunc = condParser(condition);

  var projParser = this.get('projection_parser') || Projection.parser;
  if ('function' != typeof projParser) {
    throw new Error('invalid projection parser: ' + projParser);
  }
  var projFunc = projParser(projection);

  // create a cursor
  var cursorClass = this.get('cursor') || Cursor;
  if ('function' != typeof cursorClass) {
    throw new Error('invalid cursor class: ' + cursorClass);
  }
  return new cursorClass(this, parserFunc, projFunc);
}

/** This invokes a callback function with an item found under specified condition.
 * @method FindMixin.prototype.findOne
 * @param condition - same as find() method
 * @param {Function} callback - function(err, item) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * collection.findOne({}, function(err, item) {
 *   console.log(item);
 * });
 */

function findOne(condition, callback) {
  callback = callback || NOP;
  this.find(condition).limit(1).toArray(function(err, list) {
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

/** This counts number of items matched with condition.
 * @method FindMixin.prototype.count
 * @param condition - same as find() method
 * @param {Function} callback - function(err, cursor) {}
 * @returns {KagoDB} collection instance itself for method chaining
 * @example
 * collection.find().count(function(err, count) {
 *   console.log(count);
 * });
 */

function count(condition, callback) {
  callback = callback || NOP;
  var cursor = this.find(condition);
  cursor.count(callback);
  return this;
}

function NOP() {}