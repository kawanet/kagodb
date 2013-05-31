/*! find.js */

var Cursor = require('../core/cursor');

/** This mixin provides find(), findOne() and count() methods.
 * @class FindMixin
 * @mixin
 */

module.exports = function() {
  this.find = find;
  this.findOne = findOne;
  this.count = count;
};

/** This creates a cursor object with a test function applied.
 * @method FindMixin.prototype.find
 * @param {Function} condition - function(item) {return true;}
 * @param {Function} [callback] - function(err, cursor) {}
 * @returns {Cursor} cursor instance
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