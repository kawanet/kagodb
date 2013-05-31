/*! find.js */

var Cursor = require('../core/cursor');
var Condition = require('../core/condition');

/** This mixin provides find(), findOne() and count() methods.
 * @class FindMixin
 * @mixin
 */

module.exports = function() {
  this.find = find;
  this.findOne = findOne;
  this.count = count;
};

/** This creates a cursor object with condition given as a test function or query parameters.
 * Null condition will find all items in the collection
 * @method FindMixin.prototype.find
 * @param {Function|Object} [condition] - test function or query parameters
 * @param {Function} [callback] - function(err, cursor) {}
 * @returns {Cursor} cursor instance
 * @example
 * // all items
 * collection.find().toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item.name, item.price);
 *   });
 * });
 *
 * // test function
 * var test = function(item) {
 *   return item.price > 100;
 * };
 * collection.find(test).toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item.name, item.price);
 *   });
 * });
 *
 * // query parameters
 * var cond = {
 *   name: "John"
 * };
 * collection.find(cond).toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item.name, item.price);
 *   });
 * });
 */

function find(condition, callback) {
  callback = callback || NOP;

  // parse condition
  var condParser = this.get('condition-parser') || Condition.parser;
  if ('function' != typeof condParser) {
    throw new Error('invalid condition parser: ' + condParser);
  }
  var func = condParser(condition);

  // create a cursor
  var cursorClass = this.get('cursor') || Cursor;
  if ('function' != typeof cursorClass) {
    throw new Error('invalid cursor class: ' + cursorClass);
  }
  var cursor = new cursorClass(this, func);
  callback(null, cursor);
  return cursor;
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