/* condition_op.js */

/**
 * This provides a condition operator parser. find() and other some methods use this internally.
 *
 * @module condition_op
 */

/**
 * This generates a condition function from an operator object.
 *
 * @param {Object|Function} condition - query parameters
 * @returns {Function} test function generated
 */

exports.parser = function(condition) {
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

  // more complex conditions:
  return function(item) {
    for (var key in condition) {
      if (item[key] != condition[key]) return false;
    }
    return true;
  };
};