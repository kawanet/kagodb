/*! find.js */

var Cursor = require('../core/cursor');

/** This mixin provides find() and count() methods.
 * @class FindMixin
 * @mixin
 */

module.exports = function() {
  this.find = find;
  this.count = count;
};

/** This creates a cursor object with a test function applied.
 * @method FindMixin.prototype.find
 * @param {Function} condition - function(item) {return true;}
 * @param {Function} callback - function(err, cursor) {}
 * @returns {Cursor} cursor
 * @see {@link ConditionMixin#find}  accepts an object as query parameters
 * @example
 * collection.find().toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item);
 *   });
 * });
 */

function find(condition, callback) {
  callback = callback || NOP;
  var cursor = new Cursor(this, condition);
  callback(null, cursor);
  return cursor;
}

/** This counts number of items matched with condition.
 * @method FindMixin.prototype.count
 * @param condition - query parameters
 * @param {Function} callback - function(err, cursor) {}
 * @returns collection instance itself for method chaining
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