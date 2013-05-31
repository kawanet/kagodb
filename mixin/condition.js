/* condition.js */

var FindMixin = require('./find');

/** This mixin overrides find() method to provide a function which tests conditions applied as an object.
 * @class ConditionMixin
 * @mixin
 */

/** This creates a cursor object with query parameters.
 * @method ConditionMixin.prototype.find
 * @param {Object} condition - query parameters
 * @param {Function} callback - function(err, cursor) {}
 * @returns {Cursor} cursor
 * @see {@link FindMixin#find} accepts a condition test function
 * @example
 * collection.find().toArray(function(err, list) {
 *   list.forEach(function(item) {
 *     console.log(item);
 *   });
 * });
 */

module.exports = function() {
  if (!this.find) {
    FindMixin.call(this); // dependent mixin
  }
  if (!this.find) {
    throw new Error('find() method not available');
  }
  var _find = this.find;
  this.find = function(condition) {
    var args = Array.prototype.slice.call(arguments);
    args[0] = conditionParser(args[0]);
    return _find.apply(this, args);
  };
};

function conditionParser(condition) {
  // function type
  if ('function' == typeof condition) {
    return condition;
  }

  // default condition
  condition = condition || {};

  // other types than object
  if ('object' != typeof condition) {
    throw new Error('unknown condition: ' + condition);
  }

  var queries = Object.keys(condition);

  // no condition: every item OK
  if (!queries.length) {
    return null;
  }

  // one condition: faster
  if (queries.length == 1) {
    var key = queries[0];
    var val = condition[key];
    if ('object' != typeof val) {
      return function(item) {
        return (item[key] == val);
      };
    }
  }

  // more conditions:
  return function(item) {
    for (var key in condition) {
      if (item[key] != condition[key]) return false;
    }
    return true;
  };
}